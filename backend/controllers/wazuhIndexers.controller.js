var WazuhIndexerService = require('../services/wazuhIndexer.service');
const moment = require('moment');
// Saving the context of this controller inside the _this variable
_this = this;

// Async Controller function to get the Wazuh Indexer list
exports.getWazuhIndexers = async function (req, res, next) {
    try {
        var page = Number(req.query?.page || 1);
        var limit = Number(req.query?.limit || 100);
        var sort = req.query?.sort == "asc" ? 1 : -1;
        var sortColumn = req.query.sortColumn ? req.query.sortColumn : "_id";
        var search = req.query?.search || "";
        var pageIndex = 0;
        var startIndex = 0;
        var endIndex = 0;

        var query = { deletedAt: null };
        if (search) {
            query['$or'] = [
                { type: { $regex: '.*' + search + '.*', $options: 'i' } }
            ];
        }

        var count = await WazuhIndexerService.getWazuhIndexerCount(query);
        var wazuhIndexers = await WazuhIndexerService.getWazuhIndexer(query, page, limit, sortColumn, sort);
        if (!wazuhIndexers || !wazuhIndexers.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                wazuhIndexers = await WazuhIndexerService.getWazuhIndexer(query, page, limit, sortColumn, sort);
            }
        }

        if (wazuhIndexers && wazuhIndexers.length) {
            pageIndex = page - 1;
            startIndex = (pageIndex * limit) + 1;
            endIndex = Math.min(startIndex - 1 + limit, count);
        }

        var pagination = {
            pages: Math.ceil(count / limit),
            total: count,
            pageIndex,
            startIndex,
            endIndex
        };

        // Return the Wazuh Indexer list
        return res.status(200).json({ status: 200, flag: true, data: wazuhIndexers, pagination, message: "Wazuh Indexers received successfully!" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
};

exports.getWazuhIndexer = async function (req, res, next) {
    var id = req.params.id;
    try {
        var wazuhIndexer = await WazuhIndexerService.getWazuhIndexerById(id);
        return res.status(200).json({ status: 200, flag: true, data: wazuhIndexer, message: "Wazuh Indexer received successfully!" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
};

exports.filterWazuhData = async function (req, res) {
    try {
        const { severity, timeRange } = req.body;

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
                return res.status(400).json({ status: false, message: "Invalid time range. Supported values: 'today', 'thismonth', 'thisyear', '1week'." });
        }
        // Fetch data from the service
        const { mergedBucketArray, perDayCounts, allRecords } = await WazuhIndexerService.getPerDayCountsWithBuckets({
            severityField,
            startTime,
            endTime: now,
        });

        // Prepare filters
        const filters = { severityField, startTime, endTime: now };

        // Calculate the total records across all days
        const totalRecords = perDayCounts.reduce((sum, day) => sum + day.totalRecords, 0);

        return res.status(200).json({
            status: true,
            data: {
                perDayCounts,
                allRecords,
                totalRecords,
                mergedBucketArray,
            },
            message: "Per-day counts and all records fetched successfully.",
        });
    } catch (error) {
        console.error("Error fetching per-day counts:", error.message);
        return res.status(200).json({
            status: false,
            message: "Error occurred while fetching per-day counts.",
        });
    }
};

// exports.wazuhIndexerStatisticsData = async function (req, res, next) {
//     try {
//       // Get the time range from query parameters (default to 'day')
//       const timeRange = req.query.timeRange || "day";
  
//       // Fetch data from the service function
//       var wazuhIndexer =
//         (await WazuhIndexerService.getTotalCountsBySeverity(timeRange)) || null;
  
//       return res.status(200).send({
//         status: 200,
//         flag: true,
//         data: {
//           low_severity_hits_count: wazuhIndexer?.low_severity_hits_count || 0,
//           medium_severity_hits_count: wazuhIndexer?.medium_severity_hits_count || 0,
//           high_severity_hits_count: wazuhIndexer?.high_severity_hits_count || 0,
//           critical_severity_hits_count: wazuhIndexer?.critical_severity_hits_count || 0
//         },
//         message: `Wazuh indexer statistics data for ${timeRange} received successfully!`
//       });
//     } catch (error) {
//       return res
//         .status(200)
//         .json({ status: 200, flag: false, message: error.message });
//     }
//   };
  

exports.getIncidentTrendingData = async (req, res) => {
    try {
        // Call the service function to fetch and process the data
        const data = await WazuhIndexerService.fetchIncidentTrendingData();
        res.status(200).json({
            success: true,
            data,
            message: "Incident trending data retrieved successfully",
        });
    } catch (error) {
        console.error("Error fetching incident trending data:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch incident trending data",
            error: error.message,
        });
    }
};

exports.getLast24HoursData = async function (req, res) {
    try {
        const currentTime = moment();
        const startTime = moment().subtract(24, 'hours');

        const data = await WazuhIndexerService.fetchIncidentTrendingData(startTime.toDate(), currentTime.toDate());

        return res.status(200).json({
            status: true,
            data: data,
            message: "Last 24 hours data fetched successfully"
        });
    } catch (error) {
        console.error("Error fetching last 24 hours data:", error);
        return res.status(500).json({
            status: false,
            message: "Error occurred while fetching last 24 hours data",
            error: error.message
        });
    }
};
exports.createWazuhIndexer = async function (req, res, next) {
    try {
        var createdWazuhIndexer = await WazuhIndexerService.createWazuhIndexer(req.body);
        return res.status(200).json({ status: 200, flag: true, data: createdWazuhIndexer, message: "Wazuh Indexer created successfully!" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
};

exports.updateWazuhIndexer = async function (req, res, next) {
    if (!req.body._id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present!" });
    }

    try {
        var updatedWazuhIndexer = await WazuhIndexerService.updateWazuhIndexer(req.body);
        return res.status(200).json({ status: 200, flag: true, data: updatedWazuhIndexer, message: "Wazuh Indexer updated successfully!" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
};

exports.removeWazuhIndexer = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present!" });
    }

    try {
        var softDelete = false;
        if (softDelete) {
            await WazuhIndexerService.updateWazuhIndexer({ _id: id, deletedAt: new Date() });
        } else {
            await WazuhIndexerService.deleteWazuhIndexer(id);
        }

        return res.status(200).send({ status: 200, flag: true, message: "Successfully Deleted... " });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
};
