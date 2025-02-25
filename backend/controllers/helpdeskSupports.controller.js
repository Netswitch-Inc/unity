const HelpdeskSupportService = require("../services/helpdeskSupport.service");

exports.getHelpdeskSupports = async function (req, res, next) {
  try {
    const page = Number(req.query?.page || 1);
    const limit = Number(req.query?.limit || 10);
    const sort = req.query?.sort === "asc" ? 1 : -1;
    const sortColumn = req.query.sortColumn || "_id";
    var search = req.query?.search || "";
    var pageIndex = 0;
    var startIndex = 0;
    var endIndex = 0;

    var query = { deletedAt: null };
    if (req.query.search && req.query.search != "undefined") {
      search = search.trim();
      query["$or"] = [{ type: { $regex: search, $options: "i" } }];
    }

    const count = await HelpdeskSupportService.getHelpdeskSupportCount(query);
    const helpdesks = await HelpdeskSupportService.getHelpdeskSupports(
      query,
      page,
      limit,
      sortColumn,
      sort
    );
    if (!helpdesks || !helpdesks.length) {
      if (Number(req.query?.page || 0) > 0) {
        page = 1;
        helpdesks = await HelpdeskSupportService.getHelpdeskSupports(
          query,
          page,
          limit,
          sortColumn,
          sort
        );
      }
    }

    if (helpdesks && helpdesks.length) {
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
    return res
      .status(200)
      .json({
        status: 200,
        flag: true,
        data: helpdesks,
        pagination,
        message: "HelpdeskSupports received successfully.",
      });
  } catch (e) {
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.getHelpdeskSupport = async function (req, res, next) {
  var id = req.params.id;
  try {
    var helpdesk = await HelpdeskSupportService.getHelpdeskSupport(id);
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res
      .status(200)
      .json({
        status: 200,
        flag: true,
        data: helpdesk,
        message: "HelpdeskSupport received successfully.",
      });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.createHelpdeskSupport = async function (req, res, next) {
  try {
    var createdhelpdesk = await HelpdeskSupportService.createHelpdeskSupport(
      req.body
    );
    return res
      .status(200)
      .json({
        status: 200,
        flag: true,
        data: createdhelpdesk,
        message: "Helpdesk Support created successfully.",
      });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.updateHelpdeskSupport = async function (req, res, next) {
  if (!req.body?._id) {
    return res
      .status(400)
      .json({ status: 400, flag: false, message: "Id must be present" });
  }

  try {
    const updatedHelpdesk = await HelpdeskSupportService.updateHelpdeskSupport(
      req.body
    );

    if (updatedHelpdesk?._id) {
      if (updatedHelpdesk?.status === false) {
        console.log(`Helpdesk ${updatedHelpdesk._id} is now inactive.`);
      }
    }

    return res
      .status(200)
      .json({
        status: 200,
        flag: true,
        data: updatedHelpdesk,
        message: "Helpdesk Support updated successfully",
      });
  } catch (e) {
    console.error("Error:", e.message);
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.getLast20DaysData = async function (req, res, next) {
  try {
    // Parse the query parameter for the selected date
    const selectedDate = req.query.date ? new Date(req.query.date) : null;

    // Fetch data using the service function
    const data = await HelpdeskSupportService.getLast20DaysData(selectedDate);

    // Respond with the data
    return res.status(200).json({
      status: 200,
      flag: true,
      data,
      message: "Last 20 days of data retrieved successfully.",
    });
  } catch (e) {
    return res.status(500).json({
      status: 500,
      flag: false,
      message: e.message,
    });
  }
};

exports.softDeleteHelpdeskSupport = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res
      .status(200)
      .json({ status: 200, flag: true, message: "Id must be present" });
  }

  try {
    var deleted = await HelpdeskSupportService.softDeleteHelpdeskSupport(id);
    res
      .status(200)
      .send({
        status: 200,
        flag: true,
        message: "HelpdeskSupport deleted successfully.",
      });
  } catch (e) {
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.getHelpdeskSupportGraphData = async (req, res) => {
  try {
    console.log("Fetching dashboard data...");

    // Read filter from query params: allowed values "week", "threeweek", "month", "year"
    const { filter } = req.query;
    let days;

    // Default to three weeks (21 days)
    switch (filter) {
      case "week":
        days = 7;
        break;
      case "month":
        days = 30;
        break;
      case "year":
        days = 365;
        break;
      case "threeweek":
      default:
        days = 21;
        break;
    }

    const filterDate = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const data = await HelpdeskSupportService.getHelpdeskSupportGraphData(
      filterDate
    );

    if (!data || Object.keys(data).length === 0) {
      console.warn("No helpdesk data found.");
      return res.status(200).json({
        status: 200,
        flag: false,
        message: "No helpdesk data available.",
      });
    }

    return res
      .status(200)
      .json({
        status: 200,
        flag: true,
        data,
        message: "Helpdesk graph data retrieved successfully.",
      });
  } catch (error) {
    console.error("Error fetching dashboard data:", error.message, error.stack);
    return res.status(200).json({ status: 200, flag: false, message: e.messa });
  }
};
