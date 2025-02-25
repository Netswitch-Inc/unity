var CompanyComplianceControlService = require("../services/companyComplianceControl.service");
var FrameworkService = require('../services/framework.service');

// Saving the context of this module inside the _the variable
_this = this;

exports.getCompanyComplianceControls = async function (req, res, next) {
  try {
    var sort = req.query?.sort == "asc" ? 1 : -1;
    var sortColumn = req.query.sortColumn ? req.query.sortColumn : "_id";
    var page = Number(req.query?.page || 1);
    var limit = Number(req.query?.limit || 100);
    var search = req.query?.search || "";
    var pageIndex = 0;
    var startIndex = 0;
    var endIndex = 0;

    var query = { deletedAt: null };

    var count = await CompanyComplianceControlService.getCompanyComplianceControlCount(query);
    var companyComplianceControls = await CompanyComplianceControlService.getCompanyComplianceControls(query, page, limit, sortColumn, sort);
    if (!companyComplianceControls || !companyComplianceControls.length) {
      if (Number(req.query?.page || 0) > 0) {
        page = 1;
        companyComplianceControls = await CompanyComplianceControlService.getCompanyComplianceControls(query, page, limit, sortColumn, sort);
      }
    }

    if (companyComplianceControls && companyComplianceControls.length) {
      pageIndex = page - 1;
      startIndex = pageIndex * limit + 1;
      endIndex = Math.min(startIndex - 1 + limit, count);
    }

    var pagination = {
      pages: Math.ceil(count / limit),
      total: count,
      pageIndex,
      startIndex,
      endIndex,
    };

    // Return the CompanyComplianceControls with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: companyComplianceControls,
      pagination,
      message: "Company Compliance Controls received successfully.",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.getCompanyComplianceControlList = async function (req, res, next) {
  try {
    var companyId = req.body?.company_id || req?.companyId || "";
    if (!companyId) {
      return res.status(200).json({ status: 200, flag: false, message: "Company Id must be present" });
    }

    var query = { company_id: companyId };

    var frameworks = [];
    var frameworkIds = await CompanyComplianceControlService.getCompanyComplianceControlsDistinct("framework_id", query);
    if (frameworkIds && frameworkIds?.length) {
      frameworks = await FrameworkService.getFrameworks({ _id: { $in: frameworkIds }, deletedAt: null });
    }

    var companyComplianceControls = await CompanyComplianceControlService.getCompanyComplianceControls(query);

    // Return the CompanyComplianceControls with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      frameworks,
      data: companyComplianceControls,
      message: "Company Compliance Controls received successfully.",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.getCompanyComplianceControl = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var id = req.params.id;
  try {
    var companyComplianceControl = await CompanyComplianceControlService.getCompanyComplianceControl(id);

    // Return the CompanyComplianceControl with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: companyComplianceControl,
      message: "Company Compliance Control received successfully.",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.createCompanyComplianceControl = async function (req, res, next) {
  try {
    // Calling the Service function with the new object from the Request Body
    var createdCompanyComplianceControl = await CompanyComplianceControlService.createCompanyComplianceControl(req.body);
    return res.status(200).json({
      status: 200,
      flag: true,
      data: createdCompanyComplianceControl,
      message: "Company Compliance Control created successfully.",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.updateCompanyComplianceControl = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body._id) {
    return res.status(200).json({ status: 200, flag: false, message: "Id must be present" });
  }

  try {
    var updatedCompanyComplianceControl = await CompanyComplianceControlService.updateCompanyComplianceControl(req.body);
    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedCompanyComplianceControl,
      message: "Company Compliance Control updated successfully.",
    });
  } catch (e) {
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.removeCompanyComplianceControl = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res.status(200).json({ status: 200, flag: true, message: "Id must be present" });
  }

  try {
    var deleted = await CompanyComplianceControlService.deleteCompanyComplianceControl(id);
    return res.status(200).send({
      status: 200,
      flag: true,
      message: "Company Compliance Control deleted successfully.",
    });
  } catch (e) {
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.createCompanyComplianceControls = async function (req, res, next) {
  try {
    var controls = req.body?.data || [];
    var companyId = req.body?.company_id || req?.companyId || "";
    if (!req.body?.data?.length) {
      return res.status(200).json({ status: 200, flag: false, message: "Controls data must be present" });
    } else if (!companyId) {
      return res.status(200).json({ status: 200, flag: false, message: "Company Id must be present" });
    }

    var query = { company_id: companyId };

    var companyComplianceControls = await CompanyComplianceControlService.getCompanyComplianceControls(query);
    if (controls && controls?.length) {
      if (companyComplianceControls?.length) {
        await CompanyComplianceControlService.deleteCompanyComplianceControlOne(query);
      }

      for (let i = 0; i < controls.length; i++) {
        var control = controls[i];
        var frameworkId = control?.framework_id?._id || control.framework_id || "";
        var controlId = control._id || "";

        await CompanyComplianceControlService.createCompanyComplianceControl({
          company_id: companyId,
          framework_id: frameworkId,
          control_id: controlId
        });
      }
    }

    var frameworks = [];
    var frameworkIds = await CompanyComplianceControlService.getCompanyComplianceControlsDistinct("framework_id", query);
    if (frameworkIds && frameworkIds?.length) {
      frameworks = await FrameworkService.getFrameworks({ _id: { $in: frameworkIds }, deletedAt: null });
    }
    companyComplianceControls = await CompanyComplianceControlService.getCompanyComplianceControls(query);

    // Calling the Service function with the new object from the Request Body
    return res.status(200).json({
      status: 200,
      flag: true,
      frameworks,
      data: companyComplianceControls,
      message: "Company Compliance Control created successfully.",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}