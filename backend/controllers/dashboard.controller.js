var DashboardService = require("../services/dashboard.service");
var AgentService = require("../services/agent.service");
var ConfigurationAssessmentService = require("../services/configurationAssessment.service");
var WazuhIndexerService = require("../services/wazuhIndexer.service");
var OpenVASScanReportService = require("../services/openVASScanReport.service");
var NetswitchThreatIntelStatsService = require("../services/netswitchThreatIntelStats.service");
var ConnectionService = require("../services/connection.service");

const {
  wazuhToolAgentsData,
  netswitchThreatIntelTxtData,
  wazuhToolAgentsConfigurationAssessmentData
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
        medium_severity_hits_count:
          wazuhIndexer?.medium_severity_hits_count || 0,
        high_severity_hits_count: wazuhIndexer?.high_severity_hits_count || 0,
        critical_severity_hits_count:
          wazuhIndexer?.critical_severity_hits_count || 0,
        agents_count: totalActiveAgents || 0,
        active_agents: 0,
        agentCounts: counts,
        wazuhIndexer: wazuhIndexer,
      },
      message: `Wazuh indexer statistics data for ${timeRange} received successfully!`,
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
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
      return res.status(201).json({ status: 201, flag: false, message: "Invalid severity level." });
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
        return res.status(200).json({
          status: 200,
          flag: false,
          message: "Invalid time range. Supported values: 'today', 'this month', 'this year', '1week'."
        });
    }

    // Fetch data from the service
    const { mergedBucketArray, perDayCounts, allRecords } = await WazuhIndexerService.getPerDayCountsWithBuckets({
      severityField,
      startTime,
      endTime: now
    });

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
        date_histogram_aggregation_buckets: mergedBucketArray
      },
      message: "Per-day counts and all records fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching per-day counts:", error.message);
    return res.status(200).json({
      status: 200,
      flag: false,
      message: error.message
    })
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
      critical: "critical_severity_hits_content"
    };

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
        return res.status(200).json({
          status: 200,
          flag: false,
          message: "Invalid time range. Supported values: 'today', 'this month', 'this year', 'week'."
        });
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
    return res.status(200).json({
      status: 200,
      flag: false,
      message: error.message
    })
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
        dateFormat = "%d-%m-%Y";
        break;
      case "month":
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
        dateFormat = "%m-%Y";
        break;
      case "year":
        startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // Last 1 year
        dateFormat = "%Y";
        break;
      case "week":
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
        dateFormat = "%d-%m-%Y";
        break;
      default:
        return res.status(200).json({
          status: false,
          message: "Invalid time range. Supported values: 'day', 'month', 'year', 'week'.",
        })
    }

    var query = { deletedAt: null, end_scan: { $gte: startTime, $lte: now } };

    var configureStatsData =
      await ConfigurationAssessmentService.getConfigurationAssessmentsGraph(
        query
      );

    return res.status(200).json({
      status: 200,
      flag: true,
      data: configureStatsData,
      message: "Configuration assessment statistics data received successfully."
    });
  } catch (error) {
    console.log("Error fetching per-day counts:", error.message);
    return res.status(200).json({
      flag: false,
      message: "Error occurred while fetching per-day counts."
    })
  }
}

exports.openVASScanReportStatsGraphData = async function (req, res, next) {
  try {
    var query = { deletedAt: null }; // Ensure deletedAt handling is correct

    var timeRange = req.query?.timeRange || "year";

    // Determine time range dynamically
    const now = new Date(); // Current datetime
    let startTime;

    switch (timeRange?.toLowerCase()) {
      case "day":
        dateFormat = "%d-%m-%Y";
        startTime = new Date(now.getTime() - 24 * 60 * 60 * 1000); // Last 24 hours
        break;
      case "week":
        dateFormat = "%d-%m-%Y";
        startTime = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000); // Last 7 days
        break;
      case "month":
        dateFormat = "%m-%Y";
        startTime = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // Last 30 days
        break;
      case "year":
        dateFormat = "%Y-%m";
        startTime = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000); // Last 1 year
        break;
      default:
        return res.status(201).json({
          status: 201,
          flag: false,
          message: "Invalid time range. Supported values: 'day', 'week', 'month', 'year'."
        })
    }

    const result = await OpenVASScanReportService.getOpenVASScanReportGraph(startTime, now, query, dateFormat)

    return res.status(200).json({
      status: 200,
      flag: true,
      data: result,
      message: "OpenVAS scan report statistics data received successfully."
    });
  } catch (error) {
    console.error("Error fetching severity count by IP:", error);
    return res.status(200).json({ status: 200, flag: false, message: error.message });
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
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: e.message });
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
        update: { $set: { order: item.order } },
      },
    }));

    // Get existing data for the user
    const existWidget = await DashboardService.getDashboardOne({
      user_id: user_id,
    });
    if (!existWidget) {
      var widgets = await DashboardService.getDashboards({ user_id });

      const createPromises = widgetCompoNames.map((name, index) => {
        var item = widgets.find((x) => x?.name == name) || null;
        if (!item) {
          return DashboardService.createDashboard({
            user_id: user_id,
            name: name,
            show: true,
            order: index,
          });
        }

        return null;
      });

      // Wait for all new data to be created concurrently
      await Promise.all(createPromises);
    }

    // Perform the bulk write operation
    const updateBulkItems = await DashboardService.bulkWriteOperation(
      bulkOperations
    );

    return res.status(200).json({
      status: 200,
      flag: true,
      data: updateBulkItems,
      message: "Orders updated successfully, and new data created",
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.updateDashboardWidgetToggleUpdate = async (req, res) => {
  try {
    let { name, user_id, show, widgetCompoNames } = req.body;
    if (!name || !user_id) {
      return res.status(200).json({
        status: 200,
        flag: false,
        message: "Name and User Id is required",
      });
    }

    const existWidget = await DashboardService.getDashboardOne({
      user_id,
      name,
    });
    if (!existWidget) {
      var widgets = await DashboardService.getDashboards({ user_id });

      const createPromises = widgetCompoNames.map((name, index) => {
        var item = widgets.find((x) => x?.name == name) || null;
        if (!item) {
          return DashboardService.createDashboard({
            user_id: user_id,
            name: name,
            show: true,
            order: index,
          });
        }

        return null;
      });

      // Wait for all new data to be created concurrently
      await Promise.all(createPromises);
    }

    const updatedData = await DashboardService.FindUserIdAndNameAndUpdate(
      user_id,
      name,
      show
    );

    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedData,
      message: "Dashboard widget toggle update successfully",
    });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}

exports.getNetswitchThreatIntelsStatsCount = async (req, res, next) => {
  try {
    const { limit = 7, sort = -1, timeRange = "year" } = req.query;

    const refreshType = req.query?.refresh_type || "";
    if (refreshType === "threat_intel") {
      await netswitchThreatIntelTxtData();
    }

    const startDate = new Date();
    const endDate = new Date();

    switch (timeRange?.toLowerCase()) {
      case "week":
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      case "year":
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      case "day":
      default:
        // startDate.setDate(startDate.getDate() - maxAttempts);
        startDate.setDate(startDate.getDate() - 1);
        break;
    }

    const pipeline = [{
      $match: { date: { $gte: startDate, $lte: endDate } }
    }, {
      $unwind: "$stats_data"
    }, {
      $group: {
        _id: "$stats_data.country_name",
        totalCount: { $sum: "$stats_data.count" }
      }
    }, {
      $project: {
        count: "$totalCount",
        country_name: "$_id",
        _id: 0
      }
    }, {
      $sort: { count: parseInt(sort) }
    }, {
      $limit: parseInt(limit)
    }]

    let netSwitchThreatIntels = await NetswitchThreatIntelStatsService.getTotalCountBasedOnCountryStats(pipeline);
    if (!netSwitchThreatIntels?.length && timeRange == "day") {
      const netSwitchThreatIntelsNot = await NetswitchThreatIntelStatsService.getNetswitchThreatIntelsStats({}, 1, 1, "_id", -1);
      if (netSwitchThreatIntelsNot.length > 0 && netSwitchThreatIntelsNot[0]?.stats_data) {
        let statsData = netSwitchThreatIntelsNot[0]?.stats_data || [];
        netSwitchThreatIntels = statsData.slice(0, 7); // Assign value
      }
    }

    var connectionType = "netswitch-threat-intel-txt-file";
    var connection = await ConnectionService.getConnectionOne({
      type: connectionType,
      status: true,
      deletedAt: null
    });

    var link = connection?._id ? connection.ip_address : null;

    var list = {
      link: netSwitchThreatIntels?.length ? link : null,
      data: netSwitchThreatIntels
    }

    return res.status(200).json({
      status: 200,
      flag: true,
      data: list,
      message: `Netswitch threat intel ${timeRange} data received successfully.`
    })
  } catch (error) {
    console.log("getNetswitchThreatIntelsStatsCount catch >>>> ", error);
    return res.status(201).json({ status: 201, flag: false, message: error.message })
  }
}
