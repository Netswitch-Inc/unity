const HelpdeskSupport  = require("../models/HelpdeskSupport.model");

exports.getHelpdeskSupports = async function (query = {}, page = 1, limit = 0, sortField = "", sortType) {
    const skips = limit * (page - 1);
    const sorts = {};
    if (sortField) sorts[sortField] = sortType;

    try {
        const helpdesks = await HelpdeskSupport.find(query).skip(skips).limit(limit).sort(sorts);
        return helpdesks;
    } catch (e) {
        throw Error(e.message);
    }
};

exports.getHelpdeskSupportCount = async function (query) {
    try {
        const count = await HelpdeskSupport.find(query).countDocuments();
        return count;
    } catch (e) {
        throw Error(e.message);
    }
};

exports.getHelpdeskSupportOne = async function (query = {}) {
    try {
        var helpdesk = await HelpdeskSupport.findOne(query);

        return helpdesk;
    } catch (e) {
        // return a Error message describing the reason 
        return null
    }
}

exports.getHelpdeskSupport = async function (id) {
    try {
        const helpdesk = await HelpdeskSupport.findOne({ _id: id, deletedAt: null });
        if (helpdesk?._id) {
            return helpdesk;
        } else {
            throw Error("Helpdesk Support not found");
        }
    } catch (e) {
        throw Error(e.message);
    }
};

exports.createHelpdeskSupport  = async function (helpdeskSupport) {
    const newHelpdesk = new HelpdeskSupport ({
        type: helpdeskSupport.type ? helpdeskSupport.type : "",
        date: helpdeskSupport.date ? helpdeskSupport.date : null,
        time: helpdeskSupport.time ? helpdeskSupport.time : "",
        date_in_string: helpdeskSupport.date_in_string ? helpdeskSupport.date_in_string : "",
        date_time: helpdeskSupport.date_time ? helpdeskSupport.date_time : null,
        closed_request_content: helpdeskSupport.closed_request_content ? helpdeskSupport.closed_request_content : null,
        open_request_content: helpdeskSupport.open_request_content ? helpdeskSupport.open_request_content : null,
        received_request_content: helpdeskSupport.received_request_content ? helpdeskSupport.received_request_content : null,
        request_summary_content: helpdeskSupport.request_summary_content ? helpdeskSupport.request_summary_content : null,
        sla_violated_request_content: helpdeskSupport.sla_violated_request_content ? helpdeskSupport.sla_violated_request_content : null,
        status: helpdeskSupport.status !== undefined ? helpdeskSupport.status : true,
        deletedAt: null
    });

    try {
        const savedHelpdesk = await newHelpdesk.save();
        return savedHelpdesk;
    } catch (e) {
        throw Error(e.message);
    }
};


exports.updateHelpdeskSupport  = async function (helpdeskSupport) {
    const id = helpdeskSupport._id;
    try {
        // Find the existing HelpdeskSupport  document by ID
        const oldHelpdesk = await HelpdeskSupport .findById(id);
        if (!oldHelpdesk) {
            throw Error("Helpdesk Support not found");
        }

        // Update fields only if they exist in the input HelpdeskSupport 
        if (helpdeskSupport.type) {
            oldHelpdesk.type = helpdeskSupport.type;
        }

        if (helpdeskSupport.date || helpdeskSupport.date === null) {
            oldHelpdesk.date = helpdeskSupport.date || null;
        }

        if (helpdeskSupport.time) {
            oldHelpdesk.time = helpdeskSupport.time;
        }

        if (helpdeskSupport.date_in_string) {
            oldHelpdesk.date_in_string = helpdeskSupport.date_in_string;
        }

        if (helpdeskSupport.date_time || helpdeskSupport.date_time === null) {
            oldHelpdesk.date_time = helpdeskSupport.date_time || null;
        }

        if (helpdeskSupport.closed_request_content || helpdeskSupport.closed_request_content === null) {
            oldHelpdesk.closed_request_content = helpdeskSupport.closed_request_content || null;
        }

        if (helpdeskSupport.open_request_content || helpdeskSupport.open_request_content === null) {
            oldHelpdesk.open_request_content = helpdeskSupport.open_request_content || null;
        }

        if (helpdeskSupport.received_request_content || helpdeskSupport.received_request_content === null) {
            oldHelpdesk.received_request_content = helpdeskSupport.received_request_content || null;
        }

        if (helpdeskSupport.request_summary_content || helpdeskSupport.request_summary_content === null) {
            oldHelpdesk.request_summary_content = helpdeskSupport.request_summary_content || null;
        }

        if (helpdeskSupport.sla_violated_request_content || helpdeskSupport.sla_violated_request_content === null) {
            oldHelpdesk.sla_violated_request_content = helpdeskSupport.sla_violated_request_content || null;
        }

        if (helpdeskSupport.status || helpdeskSupport.status === false) {
            oldHelpdesk.status = helpdeskSupport.status;
        }

        if (helpdeskSupport.deletedAt || helpdeskSupport.deletedAt === null) {
            oldHelpdesk.deletedAt = helpdeskSupport.deletedAt || null;
        }

        // Save the updated document
        const updatedHelpdesk = await oldHelpdesk.save();
        return updatedHelpdesk;

    } catch (e) {
        // Handle errors and rethrow them
        throw Error(e.message);
    }
};

exports.getLast20DaysData = async function (startDate) {
    try {
        // Calculate the start and end date for the range
        const endDate = startDate || new Date();
        const last20Days = new Date(endDate);
        last20Days.setDate(endDate.getDate() - 20);

        // Query to find data within the range and not deleted
        const query = {
            date: { $gte: last20Days, $lte: endDate },
            deletedAt: null,
        };

        const result = await HelpdeskSupport.find(query).sort({ date: -1 }); // Sorted by date, descending
        return result;
    } catch (e) {
        throw Error(e.message);
    }
};


exports.softDeleteHelpdeskSupport  = async function (id) {
    try {
        var deleted = await HelpdeskSupport .updateOne({
            _id: id
        }, {
            $set: { deletedAt: new Date() }
        });

        return deleted;
    } catch (e) {
        throw Error(e.message)
    }
}
// Utility function to format a timestamp to DD/MM/YYYY
const formatDate = (timestamp) => {
  const date = new Date(Number(timestamp));
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${date.getFullYear()}`;
};

// Helper function: Process Closed Requests (Graph 1)

const processClosedRequests = (docs) => {
  const closedGraphMap = {};

  docs.forEach((doc) => {
    const closedRequests = doc.closed_request_content?.requests || [];
    closedRequests.forEach((req) => {
      if (!req.created_time?.value) return;
      const dateStr = formatDate(req.created_time.value);
      if (!closedGraphMap[dateStr]) {
        closedGraphMap[dateStr] = { violated: 0, nonViolated: 0 };
      }
      // Count as violated if SLA is not null, otherwise non-violated
      req.sla !== null
        ? closedGraphMap[dateStr].violated++
        : closedGraphMap[dateStr].nonViolated++;
    });
  });

  return Object.entries(closedGraphMap)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, data]) => ({ date, ...data }));
};

 // Helper function: Process SLA Chart (Graph 2)
 
const processSLAChart = (docs) => {
  const slaChartMap = {};

  docs.forEach((doc) => {
    const receivedRequests =
      doc.received_request_content?.requests ||
      doc.request_summary_content?.requests ||
      [];
    receivedRequests.forEach((req) => {
      if (!req.created_time?.value) return;
      const dateStr = formatDate(req.created_time.value);
      if (!slaChartMap[dateStr]) {
        slaChartMap[dateStr] = { violated: 0, nonViolated: 0 };
      }
      req.sla !== null
        ? slaChartMap[dateStr].violated++
        : slaChartMap[dateStr].nonViolated++;
    });
  });

  return Object.entries(slaChartMap)
    .sort(([a], [b]) => new Date(a) - new Date(b))
    .map(([date, data]) => ({ date, ...data }));
};

// Helper function: Process Unassigned Gauge (Graph 3) 
const processUnassignedGauge = (docs) => {
  let totalOpen = 0;
  let unassignedCount = 0;

  docs.forEach((doc) => {
    const openRequests = doc.open_request_content?.requests || [];
    totalOpen += openRequests.length;
    openRequests.forEach((req) => {
      if (req.technician === null) unassignedCount++;
    });
  });

  return {
    totalOpen,
    unassignedCount,
    percentage: totalOpen ? unassignedCount / totalOpen : 0,
  };
};

 // Helper function: Process SLA Violated Open Gauge (Graph 4)

const processSLAViolatedGauge = (docs) => {
  let totalOpenSLA = 0;
  let violatedCount = 0;

  docs.forEach((doc) => {
    const slaViolatedRequests =
      doc.sla_violated_request_content?.requests || [];
    totalOpenSLA += slaViolatedRequests.length;
    slaViolatedRequests.forEach((req) => {
      if (req.sla !== null) violatedCount++;
    });
  });

  return {
    totalOpen: totalOpenSLA,
    violatedCount,
    percentage: totalOpenSLA ? violatedCount / totalOpenSLA : 0,
  };
};

// Helper function: Process Summary Chart (Graph 5)

const processSummaryChart = (docs) => {
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const summaryChartData = daysOfWeek.map((day) => ({
    day,
    OverDue: 0,
    Inbound: 0,
    Completed: 0,
  }));

  docs.forEach((doc) => {
    const summaryRequests = doc.request_summary_content?.requests || [];
    summaryRequests.forEach((req) => {
      if (!req.created_time?.value) return;
      const dayName = new Date(Number(req.created_time.value)).toLocaleString(
        "en-us",
        {
          weekday: "short",
        }
      );
      const dayObj = summaryChartData.find((d) => d.day === dayName);
      if (dayObj) {
        dayObj.Inbound++;
        if (req.is_overdue) dayObj.OverDue++;
        if (req.Completed_time?.value) dayObj.Completed++;
      }
    });
  });

  return summaryChartData;
};

/**
 * Main function: Get Dashboard Graph Data (all five graphs)
 * @param {Date} fromDate - The starting date to filter documents.
 */
exports.getHelpdeskSupportGraphData = async function (fromDate) {
  const docs = await HelpdeskSupport.find(
    { date: { $gte: fromDate } },
    {
      closed_request_content: 1,
      open_request_content: 1,
      request_summary_content: 1,
      sla_violated_request_content: 1,
      date: 1,
    }
  );

  // Define days of the week for summary chart default
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (docs.length === 0) {
    return {
      closedGraphData: [],
      slaChartData: [],
      unassignedGauge: { totalOpen: 0, unassignedCount: 0, percentage: 0 },
      slaViolatedGauge: { totalOpen: 0, violatedCount: 0, percentage: 0 },
      summaryChartData: daysOfWeek.map((day) => ({
        day,
        OverDue: 0,
        Inbound: 0,
        Completed: 0,
      })),
    };
  }

  return {
    closedGraphData: processClosedRequests(docs),
    slaChartData: processSLAChart(docs),
    unassignedGauge: processUnassignedGauge(docs),
    slaViolatedGauge: processSLAViolatedGauge(docs),
    summaryChartData: processSummaryChart(docs),
  };
};