var https = require("https");

let DashboardService = require("../services/dashboard.service");

var AgentService = require("../services/agent.service");
var ConfigurationAssessmentService = require("../services/configurationAssessment.service");
var WazuhIndexerService = require('../services/wazuhIndexer.service');
var OpenVASScanReportService = require('../services/openVASScanReport.service');

const {
  lowSeverityGraph,
  mediumSeverityGraph,
  highSeverityGraph,
  criticalSeverityGraph
} = require('../helper/wazuhJson')

const {
  requestSummary,
  requestReceived,
  requestClosed,
  slaViolated,
  unassignedOpenRequest
} = require('../helper/helpdeskJson')

const {
  wazuhToolAgentsData,
  wazuhToolAgentsConfigurationAssessmentData,
} = require("./crons.controller");

// Saving the context of this module inside the _the variable
_this = this;

exports.wazuhIndexerStatisticsData = async function (req, res, next) {
  try {
    // Get the time range from query parameters (default to 'day')
    const timeRange = req.query?.timeRange || "day";
    const refreshType = req.query?.refresh_type || "";
    if (refreshType === "agent") {
      await wazuhToolAgentsData();
    }

    const query = { status: "active", deletedAt: null };
    const totalActiveAgents = await AgentService.getAgentCount(query);
    const counts = await AgentService.getActiveAndInactiveAgentsCount();
    // Fetch data from the service function
    var wazuhIndexer = (await WazuhIndexerService.getTotalCountsBySeverity(timeRange)) || null;

    return res.status(200).send({
      status: 200,
      flag: true,
      data: {
        low_severity_hits_count: wazuhIndexer?.low_severity_hits_count || 0,
        medium_severity_hits_count: wazuhIndexer?.medium_severity_hits_count || 0,
        high_severity_hits_count: wazuhIndexer?.high_severity_hits_count || 0,
        critical_severity_hits_count: wazuhIndexer?.critical_severity_hits_count || 0,
        agents_count: totalActiveAgents || 0,
        active_agents: 0,
        agentCounts: counts,
        wazuhIndexer: wazuhIndexer
      },
      message: `Wazuh indexer statistics data for ${timeRange} received successfully!`
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message })
  }
}

exports.filterWazuhIndexerStatisticsGraphData = async function (req, res) {
  try {
    const { severity, timeRange } = req.query;

    // Map severity level to corresponding field
    const severityMapping = {
      low: "low_severity_hits_content",
      medium: "medium_severity_hits_content",
      high: "high_severity_hits_content",
      critical: "critical_severity_hits_content",
    };

    const severityField = severityMapping[severity?.toLowerCase()];
    if (!severityField) {
      return res.status(400).json({ status: false, message: "Invalid severity level." });
    }

    // Determine time range dynamically
    const now = new Date(); // Current datetime
    let startTime;

    switch (timeRange?.toLowerCase()) {
      case "day":
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
        break;
      case "month":
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
        break;
      case "year":
        startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // Last 1 year
        break;
      case "week":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
        break;
      default:
        return res.status(200).json({ status: false, message: "Invalid time range. Supported values: 'today', 'this month', 'this year', '1week'." })
    }

    // Fetch data from the service
    const { mergedBucketArray, perDayCounts, allRecords } = await WazuhIndexerService.getPerDayCountsWithBuckets({
      severityField,
      startTime,
      endTime: now
    })

    // Prepare filters
    const filters = { severityField, startTime, endTime: now };

    // Calculate the total records across all days
    const totalRecords = perDayCounts.reduce((sum, day) => sum + day.totalRecords, 0);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: {
        perDayCounts,
        wazuh_indexers: allRecords,
        totalSeverityCount: totalRecords,
        date_histogram_aggregation_buckets: mergedBucketArray,
      },
      message: "Per-day counts and all records fetched successfully."
    })
  } catch (error) {
    console.error("Error fetching per-day counts:", error.message);
    return res.status(200).json({ status: false, message: "Error occurred while fetching per-day counts." })
  }
}

exports.incidentTrendingWazuhIndexerStatsGraphData = async function (req, res, next) {
  try {
    var timeRange = req.query?.timeRange || "day";

    // Map severity level to corresponding field
    const severityMapping = {
      low: "low_severity_hits_content",
      medium: "medium_severity_hits_content",
      high: "high_severity_hits_content",
      critical: "critical_severity_hits_content",
    }

    // Determine time range dynamically
    const now = new Date(); // Current datetime
    let startTime;

    switch (timeRange?.toLowerCase()) {
      case "day":
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
        break;
      case "month":
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
        break;
      case "year":
        startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // Last 1 year
        break;
      case "week":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
        break;
      default:
        return res.status(200).json({ status: false, message: "Invalid time range. Supported values: 'today', 'this month', 'this year', '1week'." });
    }

    // Fetch data from the service
    var lowStatsData = await WazuhIndexerService.getPerDayCountsWithBuckets({
      severityField: severityMapping.low,
      startTime,
      endTime: now
    });

    var mediumStatsData = await WazuhIndexerService.getPerDayCountsWithBuckets({
      severityField: severityMapping.medium,
      startTime,
      endTime: now
    });

    var highStatsData = await WazuhIndexerService.getPerDayCountsWithBuckets({
      severityField: severityMapping.high,
      startTime,
      endTime: now
    });

    var criticalStatsData = await WazuhIndexerService.getPerDayCountsWithBuckets({
      severityField: severityMapping.critical,
      startTime,
      endTime: now
    });

    return res.status(200).json({
      status: 200,
      flag: true,
      data: {
        low_date_histogram_aggregation_buckets: lowStatsData?.mergedBucketArray || [],
        medium_date_histogram_aggregation_buckets: mediumStatsData?.mergedBucketArray || [],
        high_date_histogram_aggregation_buckets: highStatsData?.mergedBucketArray || [],
        critical_date_histogram_aggregation_buckets: criticalStatsData?.mergedBucketArray || [],
      },
      message: "Per-day counts and all records fetched successfully."
    })
  } catch (error) {
    console.error("Error fetching per-day counts:", error.message);
    return res.status(200).json({ flag: false, message: "Error occurred while fetching per-day counts." })
  }
}

exports.configurationAssessmentStatsGraphData = async function (req, res, next) {
  try {
    var timeRange = req.query?.timeRange || "day";
     const refreshType = req.query?.refresh_type || "";
     if (refreshType === "configuration") {
       await wazuhToolAgentsConfigurationAssessmentData();
     }
    // Determine time range dynamically
    const now = new Date(); // Current datetime
    let startTime;

    switch (timeRange?.toLowerCase()) {
      case "day":
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
        break;
      case "month":
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
        break;
      case "year":
        startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // Last 1 year
        break;
      case "week":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
        break;
      default:
        return res.status(200).json({ status: false, message: "Invalid time range. Supported values: 'day', 'month', 'year', 'week'." });
    }

    var query = { deletedAt: null, end_scan: { $gte: startTime, $lte: now } }

    var configureStatsData = await ConfigurationAssessmentService.getConfigurationAssessmentsGraph(query)

    return res.status(200).json({
      status: 200,
      flag: true,
      data: configureStatsData,
      message: "Configuration assessment statistics data received successfully."
    })
  } catch (error) {
    console.log("Error fetching per-day counts:", error.message);
    return res.status(200).json({ flag: false, message: "Error occurred while fetching per-day counts." })
  }
}

exports.openVASScanReportStatsGraphData = async function (req, res, next) {
  try {
    var query = { deletedAt: null }; // Ensure deletedAt handling is correct

    var timeRange = req.query?.timeRange || "day";  // Default: 'day'

    // Determine time range dynamically
    const now = new Date(); // Current datetime
    let startTime;

    switch (timeRange?.toLowerCase()) {
      case "day":
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
        break;
      case "month":
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
        break;
      case "year":
        startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // Last 1 year
        break;
      case "week":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
        break;
      default:
        return res.status(400).json({ status: false, message: "Invalid time range. Supported values: 'day', 'week', 'month', 'year'." });
    }

    const result = await OpenVASScanReportService.getOpenVASScanReportGraph(startTime, now, query); // Pass startTime and endTime as arguments

    return res.status(200).json({ status: 200, flag: true, data: result, message: "OpenVAS scan report statistics data received successfully." });
  } catch (error) {
    console.error("Error fetching severity count by IP:", error);
    return res.status(500).json({ status: 200, flag: false, message: "Internal Server Error" });
  }
}


exports.MediumWazuhGraphAPI = async function (req, res, next) {
  try {
    // console.log(typeof req.query.interval, "interval");
    const agent = new https.Agent({
      rejectUnauthorized: false,
    });
    var userName = "admin";
    var password = "q3dzcwCz3FwTAik+ZoiVSYZb?blD3+1I";
    var credentials = new Buffer.from(`${userName}:${password}`, "utf8").toString("base64");

    var url = `https://192.235.98.180:9200/wazuh-alerts*/_search?pretty=true`;
    var headers = {
      Authorization: `Basic ${credentials}`,
    };

    var data = {
      query: {
        bool: {
          must: [],
          filter: [
            {
              range: {
                timestamp: {
                  gte: "now-24h", // Adjusted to cover the last 24 hours
                  lte: "now",
                  format: "epoch_millis",
                },
              },
            },
            {
              range: {
                "rule.level": {
                  gte: req.query.gte, // Level range filter from query
                  lte: req.query.lte,
                },
              },
            },
          ],
          should: [],
          must_not: [],
        },
      },
      aggs: {
        date_histogram_aggregation: {
          date_histogram: {
            field: "timestamp",
            min_doc_count: 1, // Ensure empty buckets are excluded
          },
        },
      },
      script_fields: {},
      size: 500, // Ensure you're requesting enough documents
      sort: [],
      stored_fields: ["*"],
    }

    // Set the appropriate interval based on the query parameter
    if (
      req.query.interval === "1y" ||
      req.query.interval === "1h" ||
      req.query.interval === "1w" ||
      req.query.interval === "1M" ||
      req.query.interval === "1d"
    ) {
      // For calendar-based intervals
      data.aggs.date_histogram_aggregation.date_histogram.calendar_interval =
        req.query.interval;
      console.log("1Y, 1H, 1W, 1M, 1D")
    } else if (req.query.interval === "10m" || req.query.interval === "30m") {
      // For fixed time intervals
      data.aggs.date_histogram_aggregation.date_histogram.fixed_interval =
        req.query.interval;
      console.log("10M, 30M")
    } else {
      // Default to 1h (1 hour) if no valid interval is provided
      data.aggs.date_histogram_aggregation.date_histogram.fixed_interval = "1h";
      console.log("1H")
    }

    // Making the API POST request
    // var apiResponse = await axios.get(url, { data, headers, httpsAgent: agent })
    //   .then((res) => res.data)
    //   .catch((error) => error);

    var apiResponse = null;
    if (req.query?.gte == 0 && req.query?.lte == 6) {
      apiResponse = lowSeverityGraph.auto;
      if (req.query.interval === "1y" || req.query.interval === "1h" || req.query.interval === "1w" || req.query.interval === "1M" || req.query.interval === "1d") {
        // For calendar-based intervals
        apiResponse = lowSeverityGraph["1h1d1w1M1y"];
      } else if (req.query.interval === "10m" || req.query.interval === "30m") {
        // For fixed time intervals
        apiResponse = lowSeverityGraph["1030m"];
      } else {
        // Default to 1h (1 hour) if no valid interval is provided
        apiResponse = lowSeverityGraph["1h1d1w1M1y"];
      }
    } else if (req.query?.gte == 7 && req.query?.lte == 11) {
      apiResponse = mediumSeverityGraph.auto;
      if (req.query.interval === "1y" || req.query.interval === "1h" || req.query.interval === "1w" || req.query.interval === "1M" || req.query.interval === "1d") {
        // For calendar-based intervals
        apiResponse = mediumSeverityGraph["1h1d1w1M1y"];
      } else if (req.query.interval === "10m" || req.query.interval === "30m") {
        // For fixed time intervals
        apiResponse = mediumSeverityGraph["1030m"];
      } else {
        // Default to 1h (1 hour) if no valid interval is provided
        apiResponse = mediumSeverityGraph["1h1d1w1M1y"];
      }
    } else if (req.query?.gte == 12 && req.query?.lte == 14) {
      apiResponse = highSeverityGraph.auto;
      if (req.query.interval === "1y" || req.query.interval === "1h" || req.query.interval === "1w" || req.query.interval === "1M" || req.query.interval === "1d") {
        // For calendar-based intervals
        apiResponse = highSeverityGraph["1h1d1w1M1y"];
      } else if (req.query.interval === "10m" || req.query.interval === "30m") {
        // For fixed time intervals
        apiResponse = highSeverityGraph["1030m"];
      } else {
        // Default to 1h (1 hour) if no valid interval is provided
        apiResponse = highSeverityGraph["1h1d1w1M1y"];
      }
    } else if (req.query?.gte == 15) {
      apiResponse = criticalSeverityGraph.auto;
      if (req.query.interval === "1y" || req.query.interval === "1h" || req.query.interval === "1w" || req.query.interval === "1M" || req.query.interval === "1d") {
        // For calendar-based intervals
        apiResponse = criticalSeverityGraph["1h1d1w1M1y"];
      } else if (req.query.interval === "10m" || req.query.interval === "30m") {
        // For fixed time intervals
        apiResponse = criticalSeverityGraph["1030m"];
      } else {
        // Default to 1h (1 hour) if no valid interval is provided
        apiResponse = criticalSeverityGraph["1h1d1w1M1y"];
      }
    }
    // console.log("apiResponse >>> ", apiResponse);

    // Sending the response to the client
    return res.status(200).send({
      status: 200,
      flag: true,
      data: apiResponse,
      message: "Wazuh Test function called successfully!"
    })
  } catch (e) {
    console.error("Error during API call: ", e.message);
    return res.status(200).json({
      status: 200,
      flag: false,
      message: e.message || "An error occurred while processing the request"
    })
  }
}

exports.getDashboardWidgets = async (req, res) => {
  try {
    var query = { user_id: req.userId };

    var widgets = await DashboardService.getDashboards(query);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: widgets,
      message: "Dashboard Data Get Successfully"
    })
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: e.message })
  }
}

exports.updateDashboardData = async function (req, res, next) {
  try {
    const { bulkItems, user_id, widgetCompoNames } = req.body;

    // Check if updates array exists
    if (!bulkItems || !Array.isArray(bulkItems) || bulkItems.length === 0) {
      return res.status(200).json({ status: 200, flag: false, message: "No updates provided" });
    }

    // Create bulk operations for MongoDB
    const bulkOperations = bulkItems.map((item) => ({
      updateOne: {
        filter: { name: item.name, user_id: user_id },
        update: { $set: { order: item.order } }
      }
    }));

    // Get existing data for the user
    const existWidget = await DashboardService.getDashboardOne({ user_id: user_id });
    if (!existWidget) {
      var widgets = await DashboardService.getDashboards({ user_id });

      const createPromises = widgetCompoNames.map((name, index) => {
        var item = widgets.find((x) => x?.name == name) || null;
        if (!item) {
          return DashboardService.createDashboard({
            user_id: user_id,
            name: name,
            show: true,
            order: index
          })
        }

        return null
      })

      // Wait for all new data to be created concurrently
      await Promise.all(createPromises);
    }

    // Perform the bulk write operation
    const updateBulkItems = await DashboardService.bulkWriteOperation(bulkOperations)

    return res.status(200).json({
      status: 200,
      flag: true,
      data: updateBulkItems,
      message: "Orders updated successfully, and new data created"
    })
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message })
  }
}

exports.updateDashboardWidgetToggleUpdate = async (req, res) => {
  try {
    let { name, user_id, show, widgetCompoNames } = req.body;
    if (!name || !user_id) {
      return res.status(200).json({ status: 200, flag: false, message: "Name and User Id is required" })
    }

    const existWidget = await DashboardService.getDashboardOne({ user_id, name });
    if (!existWidget) {
      var widgets = await DashboardService.getDashboards({ user_id });

      const createPromises = widgetCompoNames.map((name, index) => {
        var item = widgets.find((x) => x?.name == name) || null;
        if (!item) {
          return DashboardService.createDashboard({
            user_id: user_id,
            name: name,
            show: true,
            order: index
          })
        }

        return null
      })

      // Wait for all new data to be created concurrently
      await Promise.all(createPromises);
    }

    const updatedData = await DashboardService.FindUserIdAndNameAndUpdate(user_id, name, show)

    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedData,
      message: "Dashboard widget toggle update successfully"
    })
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message })
  }
}

exports.helpdeskTicketsGraph = async function (req, res, next) {
  try {
    var headers = { Authtoken: "7F63A0F6-3B95-473F-821B-77DAE8C8C6A0" }
    let queryData = req.query.queryData;

    // var params = {
    //     list_info: {
    //         row_count: 5,
    //         get_total_count: true
    //     }
    // }
    var params = queryData;
    var encodeParams = encodeURIComponent(JSON.stringify(params));
    var url = `https://helpdesk.netswitch.net/api/v3/requests?input_data=${encodeParams}`;

    // var apiResponse = await axios.get(url, { headers })
    //   .then((res) => res.data)
    //   .catch((error) => error);

    var apiResponse = slaViolated;
    console.log("apiResponse >>> ", apiResponse);

    return res.status(200).send({ status: 200, flag: true, data: apiResponse, message: "Helpdesk ticket function called successfully!" })
  } catch (e) {
    return res.status(200).json({ status: 200, flag: false, message: e.message })
  }
}

exports.helpdeskTicketsGraphForUnassigned = async function (req, res, next) {
  try {
    var headers = { Authtoken: "7F63A0F6-3B95-473F-821B-77DAE8C8C6A0" }
    let queryData = req.query.queryData;

    // var params = {
    //     list_info: {
    //         row_count: 5,
    //         get_total_count: true
    //     }
    // }
    var params = queryData;
    var encodeParams = encodeURIComponent(JSON.stringify(params));
    var url = `https://helpdesk.netswitch.net/api/v3/requests?input_data=${encodeParams}`;

    // var apiResponse = await axios.get(url, { headers })
    //   .then((res) => res.data)
    //   .catch((error) => error);

    var apiResponse = unassignedOpenRequest;
    // console.log("apiResponse >>> ", apiResponse);

    return res.status(200).send({ status: 200, flag: true, data: apiResponse, message: "Helpdesk ticket function called successfully!" })
  } catch (e) {
    return res.status(200).json({ status: 200, flag: false, message: e.message })
  }
}

exports.helpdeskTicketsGraphForRequestSummery = async function (req, res, next) {
  try {
    var headers = { Authtoken: "7F63A0F6-3B95-473F-821B-77DAE8C8C6A0" }
    let queryData = req.query.queryData;

    // var params = {
    //     list_info: {
    //         row_count: 5,
    //         get_total_count: true
    //     }
    // }
    var params = queryData;
    var encodeParams = encodeURIComponent(JSON.stringify(params));
    var url = `https://helpdesk.netswitch.net/api/v3/requests?input_data=${encodeParams}`;

    // var apiResponse = await axios.get(url, { headers })
    //   .then((res) => res.data)
    //   .catch((error) => error);

    var apiResponse = requestSummary;
    // console.log("apiResponse >>> ", apiResponse);

    return res.status(200).send({ status: 200, flag: true, data: apiResponse, message: "Helpdesk ticket function called successfully!" })
  } catch (e) {
    return res.status(200).json({ status: 200, flag: false, message: e.message })
  }
}

exports.helpdeskTicketsGraphForCloseRequest = async function (req, res, next) {
  try {
    var headers = { Authtoken: "7F63A0F6-3B95-473F-821B-77DAE8C8C6A0" }
    let queryData = req.query.queryData;

    // var params = {
    //     list_info: {
    //         row_count: 5,
    //         get_total_count: true
    //     }
    // }
    var params = queryData;
    var encodeParams = encodeURIComponent(JSON.stringify(params));
    var url = `https://helpdesk.netswitch.net/api/v3/requests?input_data=${encodeParams}`;

    // var apiResponse = await axios.get(url, { headers })
    //   .then((res) => res.data)
    //   .catch((error) => error);

    var apiResponse = requestClosed;
    // console.log("apiResponse >>> ", apiResponse);

    return res.status(200).send({ status: 200, flag: true, data: apiResponse, message: "Helpdesk ticket function called successfully!" });
  } catch (e) {
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.helpdeskTicketsGraphForRecivedRequest = async function (req, res, next) {
  try {
    var headers = { Authtoken: "7F63A0F6-3B95-473F-821B-77DAE8C8C6A0" }
    let queryData = req.query.queryData;

    var params = queryData;
    var encodeParams = encodeURIComponent(JSON.stringify(params));
    var url = `https://helpdesk.netswitch.net/api/v3/requests?input_data=${encodeParams}`;

    // var apiResponse = await axios.get(url, { headers })
    //   .then((res) => res.data)
    //   .catch((error) => error);

    var apiResponse = requestReceived;
    // console.log("apiResponse >>> ", apiResponse);

    return res.status(200).send({ status: 200, flag: true, data: apiResponse, message: "Helpdesk ticket function called successfully!" })
  } catch (e) {
    return res.status(200).json({ status: 200, flag: false, message: e.message })
  }
}

