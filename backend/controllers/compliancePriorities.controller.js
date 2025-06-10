var CompliancePriorityService = require("../services/compliancePriority.service");
var CompanyComplianceControlService = require("../services/companyComplianceControl.service");

// Saving the context of this module inside the _the variable
_this = this;

exports.getCompliancePriorities = async function (req, res, next) {
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
    if (req.query?.user_id) {
      query.user_id = req.query.user_id;
    }

    var count = await CompliancePriorityService.getCompliancePriorityCount(query);
    var compliancePriorities = await CompliancePriorityService.getCompliancePriorities(query, page, limit, sortColumn, sort);
    if (!compliancePriorities || !compliancePriorities.length) {
      if (Number(req.query?.page || 0) > 0) {
        page = 1;
        compliancePriorities = await CompliancePriorityService.getCompliancePriorities(query, page, limit, sortColumn, sort);
      }
    }

    if (compliancePriorities && compliancePriorities.length) {
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

    // Return the CompliancePrioritys with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: compliancePriorities,
      pagination,
      message: "Compliance Priorities received successfully."
    });
  } catch (error) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.getCompliancePriority = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var id = req.params.id;
  try {
    var compliancePriority = await CompliancePriorityService.getCompliancePriority(id);

    // Return the CompliancePriority with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: compliancePriority,
      message: "Compliance Priority received successfully."
    });
  } catch (error) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.createCompliancePriority = async function (req, res, next) {
  try {
    // Calling the Service function with the new object from the Request Body
    var createdCompliancePriority = await CompliancePriorityService.createCompliancePriority(req.body);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: createdCompliancePriority,
      message: "Compliance Priority created successfully."
    });
  } catch (error) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.updateCompliancePriority = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body._id) {
    return res.status(200).json({ status: 200, flag: false, message: "Id must be present" });
  }

  try {
    var updatedCompliancePriority = await CompliancePriorityService.updateCompliancePriority(req.body);
    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedCompliancePriority,
      message: "Compliance Priority updated successfully."
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.removeCompliancePriority = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res.status(200).json({ status: 200, flag: true, message: "Id must be present" });
  }

  try {
    var deleted = await CompliancePriorityService.deleteCompliancePriority(id);
    return res.status(200).send({
      status: 200,
      flag: true,
      message: "Compliance Priority deleted successfully."
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.softDeleteCompliancePriority = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res.status(200).json({ status: 200, flag: true, message: "Id must be present" })
  }

  try {
    var deleted = await CompliancePriorityService.softDeleteCompliancePriority(id);
    return res.status(200).send({ status: 200, flag: true, message: "Compliance Priority deleted successfully." });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.createCompanyCompliancesPriotity = async function (req, res, next) {
  try {
    var companyId = req.body?.company_id || req?.companyId || null;
    var userId = req.body?.user_id || req?.userId || null;
    var complianceControls = req.body?.compliance_controls || [];

    var throwError = false;
    var flag = false;
    var message = "Something went wrong while creating compliance priority."

    if (!companyId && !userId) {
      flag = false;
      throwError = true;
      message = "company_id or user_id is required.";
    } else if (!complianceControls || !complianceControls?.length) {
      flag = false;
      throwError = true;
      message = "compliance_controls is required.";
    } else if (!Array.isArray(complianceControls)) {
      flag = false;
      throwError = true;
      message = "compliance_controls must be an array.";
    }

    if (throwError) {
      return res.status(200).json({ status: 200, flag, message });
    }

    var createdCompliancePriority = await CompliancePriorityService.createCompliancePriority({
      ...req.body,
      company_id: companyId,
      user_id: userId
    });

    var companyComplianceData = [];
    if (createdCompliancePriority?._id) {
      flag = true;
      message = "Compliance Priority created successfully.";

      if (complianceControls?.length) {
        for (let i = 0; i < complianceControls.length; i++) {
          let complianceControl = complianceControls[i];

          var companyComplianceItem = {
            company_id: companyId,
            user_id: userId,
            compliance_priority_id: createdCompliancePriority?._id || null,
            framework_id: complianceControl?.framework_id?._id || complianceControl?.framework_id || null,
            control_id: complianceControl?._id || null,
            tool_icons: complianceControl?.tool_icons || ""
          }

          companyComplianceData.push(companyComplianceItem)
        }

        var companyComplianceControls = await CompanyComplianceControlService.createManyCompanyComplianceControl(companyComplianceData);
      }
    }

    return res.status(200).json({ status: 200, flag, data: createdCompliancePriority, message: "Compliance Priority created successfully." });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}
