var ControlService = require("../services/control.service");

// Saving the context of this module inside the _the variable
_this = this;

exports.getControls = async function (req, res, next) {
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
        { relation: { $regex: search, $options: "i" } },
        { impact: { $regex: search, $options: "i" } },
        { priority: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    var count = await ControlService.getControlCount(query);
    var controls = await ControlService.getControls(query, page, limit, sortColumn, sort);
    if (!controls || !controls.length) {
      if (Number(req.query?.page || 0) > 0) {
        page = 1;
        controls = await ControlService.getControls(query, page, limit, sortColumn, sort);
      }
    }

    if (controls && controls.length) {
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

    // Return the Controls with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: controls,
      pagination,
      message: "Compliance controls received successfully",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.getControl = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var id = req.params.id;
  try {
    var control = await ControlService.getControl(id);

    // Return the Control with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: control,
      message: "Compliance control received successfully.",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.createControl = async function (req, res, next) {
  try {
    // Calling the Service function with the new object from the Request Body
    var createdControl =
      await ControlService.createControl(req.body);
    return res.status(200).json({
      status: 200,
      flag: true,
      data: createdControl,
      message: "Compliance control created successfully.",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.updateControl = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body._id) {
    return res.status(200).json({ status: 200, flag: false, message: "Id must be present" });
  }

  try {
    var updatedControl = await ControlService.updateControl(req.body);
    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedControl,
      message: "Compliance control updated successfully.",
    });
  } catch (e) {
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.removeControl = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res.status(200).json({ status: 200, flag: true, message: "Id must be present" });
  }

  try {
    var deleted = await ControlService.softDeleteControl(id);
    return res.status(200).send({
      status: 200,
      flag: true,
      message: "Compliance control deleted successfully.",
    });
  } catch (e) {
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.getControlsByFrameworkId = async function (req, res, next) {
  try {
    // Extract framework_id from query parameters
    const frameworkIds = req.query?.framework_id;

    if (!frameworkIds) {
      return res.status(200).json({
        status: 200,
        flag: false,
        message: "Please provide FrameworkIds.",
      });
    }

    const idsArray = frameworkIds.split(",");
    // Construct the query to find documents with any of the provided IDs
    const query = { framework_id: { $in: idsArray } };

    // Fetch the compliance controls from the service
    const Controls = await ControlService.getControlsByFrameworkIds(query);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: Controls,
      message: "Compliance controls received successfully.",
    });
  } catch (error) {
    console.error("Error fetching compliance controls:", error);
    return res.status(500).json({ status: 500, flag: false, message: error.message });
  }
}
