var Company = require("../models/Company.model");

var fs = require("fs");
var publicPath = require("path").resolve("public");
var ImageService = require("../services/image.service");

const { createUpdateEventLog } = require("../helper");

// Saving the context of this module inside the _the variable
_this = this;

// Async function to get the Company List
exports.getCompanies = async function (
  query = {},
  page = 1,
  limit = 0,
  sortField = "",
  sortType = ""
) {
  var skips = limit * (page - 1);
  var sorts = {};
  if (sortField) {
    sorts[sortField] = sortType;
  }

  // Try Catch the awaited promise to handle the error
  try {
    var companies = await Company.find(query)
      .populate({ path: "user_id", select: { _id: 1, user_name: 1 } })
      .sort(sorts)
      .skip(skips)
      .limit(limit);

    return companies;
  } catch (e) {
    throw Error("Error occurred while finding Company");
  }
};

exports.getCompanyCount = async function (query) {
  try {
    var count = await Company.find(query).count();

    return count;
  } catch (e) {
    throw Error("Error while Counting Company");
  }
};

exports.getCompany = async function (id) {
  try {
    // Find the Data
    var _details = await Company.findOne({ _id: id }).populate({
      path: "user_id",
      select: { _id: 1, first_name: 1, last_name: 1, user_name: 1, email: 1 },
    });

    if (_details._id) {
      return _details;
    } else {
      throw Error("Company not available");
    }
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Company not available");
  }
};

const getCompanyDetail = async (query) => {
  try {
    // Find the Company
    var company = await Company.findOne(query).populate({
      path: "user_id",
      select: { _id: 1, first_name: 1, last_name: 1, user_name: 1, email: 1 },
    });

    return company || null;
  } catch (e) {
    // return a Error message describing the reason
    return null;
  }
};

exports.createCompany = async function (company) {
  if (!fs.existsSync(publicPath + "/images/company")) {
    fs.mkdirSync(publicPath + "/images/company", { recursive: true });
  }

  if (company?.logo) {
    var isImage = await ImageService.saveImage(
      company.logo,
      "/images/company/"
    ).then((data) => {
      return data;
    });

    if (typeof isImage != "undefined" && isImage != null && isImage != "") {
      company.logo = isImage;
    }
  }

  var newCompany = new Company({
    user_id: company?.user_id ? company?.user_id : null,
    name: company.name ? company.name : "",
    logo: company.logo ? company.logo : "",
    country_code: company.country_code ? company.country_code : "",
    contact_no: company.contact_no ? company.contact_no : "",
    email: company.email ? company.email : "",
    address: company.address ? company.address : "",
    header_color: company.header_color ? company.header_color : "#FFFFFF",
    footer_color: company.footer_color ? company.footer_color : "#FFFFFF",
    status: 1,
    deletedAt: null,
  });

  try {
    // Saving the Company
    var savedCompany = await newCompany.save();
    if (savedCompany?._id) {
      var currentData = await getCompanyDetail({ _id: savedCompany._id });

      var updatedByName = company?.auth_user_name || currentData?.user_id?.user_name || "";
      var description = `${savedCompany?.name || "Company"} created ${updatedByName ? `by ${updatedByName}` : ""}`;

      const payload = {
        reference_id: savedCompany._id,
        company_id: savedCompany?._id,
        module_id: null,
        action_user_id: company?.auth_user_id || currentData?.user_id?._id,
        user_id: currentData?.user_id?._id || currentData?.user_id,
        module_slug: "companies",
        type: "companies",
        action: "create",
        description,
        previous_data: null,
        current_data: currentData,
      };
      createUpdateEventLog(payload, "create", "companies");
    }

    return savedCompany;
  } catch (e) {
    // return a Error message describing the reason
    throw Error(e.message);
  }
};

exports.updateCompany = async function (company) {
  var id = company._id;
  try {
    // Find the old Company Object by the Id
    var oldCompany = await Company.findById(id);
  } catch (e) {
    throw Error("Company not found.");
  }

  if (!oldCompany) {
    return false;
  }

  var oldData = null;
  if (oldCompany?._id) {
    oldData = await getCompanyDetail({ _id: oldCompany._id });
  }

  if (company.user_id) {
    oldCompany.user_id = company.user_id;
  }

  if (company.name) {
    oldCompany.name = company.name;
  }

  if (company.country_code) {
    oldCompany.country_code = company.country_code;
  }

  if (company.contact_no) {
    oldCompany.contact_no = company.contact_no;
  }

  if (company.email) {
    oldCompany.email = company.email;
  }

  if (company.address) {
    oldCompany.address = company.address;
  }

  if (company.header_color) {
    oldCompany.header_color = company.header_color;
  }

  if (company.footer_color) {
    oldCompany.footer_color = company.footer_color;
  }

  if (company.logo) {
    if (!fs.existsSync(publicPath + "/images/company")) {
      fs.mkdirSync(publicPath + "/images/company", { recursive: true });
    }

    var isImage = await ImageService.saveImage(
      company.logo,
      "/images/company/"
    ).then((data) => {
      return data;
    });

    if (typeof isImage != "undefined" && isImage != null && isImage != "") {
      if (oldCompany.logo != "images/company/default.avif") {
        //console.log("\n User Info >>>>>>",isImage,"\n");
        //Remove Previous User Image
        try {
          var filePath = publicPath + "/" + oldCompany.logo;
          //console.log("\n filePath >>>>>>",filePath,"\n");
          fs.unlinkSync(filePath);
        } catch (e) {
          //console.log("\n\nImage Remove Issues >>>>>>>>>>>>>>\n\n");
        }
      }

      oldCompany.logo = isImage;
    }
  }

  if (company?.status || company.status == 0) {
    oldCompany.status = company.status ? company.status : 0;
  }

  if (company?.deletedAt || company.deletedAt == "") {
    oldCompany.deletedAt = company.deletedAt || null;
  }

  try {
    var savedCompany = await oldCompany.save();
    if (savedCompany?._id) {
      var action = "update";

      var currentData = await getCompanyDetail({ _id: savedCompany._id });
      var updatedByName = company?.auth_user_name || currentData?.user_id?.user_name || "";
      var description = `${savedCompany?.name || "Company"} updated ${updatedByName ? `by ${updatedByName}` : ""}`;
      if (savedCompany?.deletedAt) {
        action = "delete";
        description = `${savedCompany?.name || "Company"} deleted ${updatedByName ? `by ${updatedByName}` : ""}`;
      }

      const payload = {
        reference_id: savedCompany._id,
        company_id: savedCompany._id,
        module_id: null,
        action_user_id: company?.auth_user_id || currentData?.user_id?._id,
        user_id: currentData?.user_id?._id || currentData?.user_id,
        module_slug: "companies",
        type: "companies",
        action: action,
        description,
        previous_data: oldData,
        current_data: currentData,
      };
      createUpdateEventLog(payload, action, "companies");
    }

    return savedCompany;
  } catch (e) {
    // console.log(e)
    throw Error(e.message);
  }
};

exports.softDeleteCompany = async function (id) {
  try {
    var deleted = await Company.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date(), status: 0 } },
      { new: true }
    );
    return deleted;
  } catch (e) {
    throw Error("Error occurred while Deleting the Company");
  }
};
