var CISControlService = require("../services/CISControl.service");
var CISControl = require("../models/CISControl.model");

// Saving the context of this module inside the _the variable
_this = this;

exports.getCISControls = async function (req, res, next) {
  try {
    var sort = req.query?.sort == "asc" ? 1 : -1;
    var sortColumn = req.query.sortColumn ? req.query.sortColumn : "_id";
    var page = req.query.page ? Number(req.query.page) : 1;
    var limit = req.query.limit ? Number(req.query.limit) : 100;
    var search = req.query?.search || "";
    var pageIndex = 0;
    var startIndex = 0;
    var endIndex = 0;

    var query = { deletedAt: null };

    if (search) {
      search = search.trim();
      query["$or"] = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { asset_type: { $regex: search, $options: "i" } },
        { security_function: { $regex: search, $options: "i" } },
      ];
    }

    var count = await CISControlService.getCISControlCount(query);
    var cisControls = await CISControlService.getCISControls(query, page, limit, sortColumn, sort);
    if (!cisControls || !cisControls.length) {
      if (page && page > 0) {
        page = 1;
        cisControls = await CISControlService.getCISControls(query, page, limit, sortColumn, sort);
      }
    }

    if (cisControls && cisControls.length) {
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

    // Return the CISControls with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: cisControls,
      pagination,
      message: "CIS controls received successfully"
    });
  } catch (error) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.getCISControl = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var id = req.params.id;
  try {
    var cisControl = await CISControlService.getCISControl(id);

    // Return the CISControl with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: cisControl,
      message: "CIS control received successfully."
    });
  } catch (error) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.createCISControl = async function (req, res, next) {
  try {
    // Calling the Service function with the new object from the Request Body
    var createdCISControl = await CISControlService.createCISControl(req.body);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: createdCISControl,
      message: "CIS control created successfully."
    });
  } catch (error) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.updateCISControl = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body._id) {
    return res.status(200).json({ status: 200, flag: false, message: "Id must be present" });
  }

  try {
    var updatedCISControl = await CISControlService.updateCISControl(req.body);
    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedCISControl,
      message: "CIS control updated successfully."
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.removeCISControl = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res.status(200).json({ status: 200, flag: true, message: "Id must be present." });
  }

  try {
    var deleted = await CISControlService.softDeleteCISControl(id);
    return res.status(200).send({
      status: 200,
      flag: true,
      message: "CIS control deleted successfully."
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.getComplinceCISControl = async function (req, res, next) {
  try {
    const { framework_id, control_id } = req.query;
    var sort = req.query?.sort == "asc" ? 1 : -1;
    var sortColumn = req.query.sortColumn ? req.query.sortColumn : "_id";
    var page = req.query.page ? Number(req.query.page) : 1;
    var limit = req.query.limit ? Number(req.query.limit) : 100;
    var search = req.query?.search || "";
    var pageIndex = 0;
    var startIndex = 0;
    var endIndex = 0;

    var query = { deletedAt: null, status: 1 };
    if (!framework_id || !control_id) {
      return res.status(200).json({
        status: 200,
        flag: false,
        message: "Please provide both framework_id and control_id"
      });
    }

    query.framework_id = framework_id;
    query.control_id = control_id;
    var count = await CISControlService.getCISControlCount(query);
    let cisControl = await CISControlService.getCISControls(query, page, limit, sortColumn, sort);
    if (!cisControl || !cisControl.length) {
      if (page && page > 0) {
        page = 1;
        cisControl = await CISControlService.getCISControls(query, page, limit, sortColumn, sort);
      }
    }

    if (cisControl && cisControl.length) {
      pageIndex = page - 1;
      startIndex = pageIndex * limit + 1;
      endIndex = Math.min(startIndex - 1 + limit, count);
    }

    var pagination = {
      pages: Math.ceil(count / limit),
      total: count,
      pageIndex,
      startIndex,
      endIndex
    };

    return res.status(200).json({
      status: 200,
      flag: true,
      data: cisControl,
      pagination,
      message: "CIS control we get succsessfully"
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.importIcons = async function (req, res, next) {
  try {
    const data = await CISControlService.getCISControls();

    // Check if no data is returned
    if (!data) {
      return res.status(200).json({ status: 200, flag: false, message: "No CIS controls found" });
    }

    // Define an array of tool_icon values
    const toolIcons = [
      'PENTEST',
      'SIEM',
      "LOC",
      "VA"
    ];

    const updatedData = data.map(item => ({
      updateOne: {
        filter: { _id: item._id }, // Match document by _id
        update: { $set: { tool_icon: toolIcons[Math.floor(Math.random() * toolIcons.length)] } }, // Set the new order value
      }
    }));
    const result = await CISControl.bulkWrite(updatedData);
    // Respond with updated data
    return res.status(200).json({ status: 200, flag: true, data: result });
  } catch (error) {
    console.error(error); // Log the error for debugging
    return res.status(500).json({ status: 500, flag: false, message: "Internal server error" });
  }
}
