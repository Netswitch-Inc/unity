// Importing the Mongoose Model
var WazuhIndexer = require("../models/WazuhIndexer.model");
const moment = require('moment');
// var moment = require('moment');
_this = this;

// Function to get a list of Wazuh Indexer statistics
exports.getWazuhIndexer = async function (query = {}, page = 1, limit = 0, sortField = "", sortType = "") {
  try {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) {
      sorts[sortField] = sortType;
    }

    var statistics = await WazuhIndexer.find(query)
      .sort(sorts)
      .skip(skips)
      .limit(limit);

    return statistics;
  } catch (e) {
    throw Error("Error- occurred while retrieving Wazuh Indexer statistics");
  }
}

exports.getWazuhIndexerCount = async function (query) {
  try {
    var count = await WazuhIndexer.find(query).count();

    return count;
  } catch (e) {
    throw Error("Error while Counting  Wazuh Indexer");
  }
}

// Function to create a new Wazuh Indexer statistic
exports.getPerDayCountsWithBuckets = async function (filters) {
  try {
    const { severityField, startTime, endTime } = filters;

    // Build the aggregation pipeline

    const pipeline = [
      {
        $match: {
          [`${severityField}.hits.total.value`]: { $gte: 1 }, // Ensure hits exist
          date_time: { $gte: startTime, $lte: endTime },       // Time range filter
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$date_time" } }, // Group by day
          totalRecords: { $sum: `$${severityField}.hits.total.value` },       // Sum the counts
        },
      },
      {
        $sort: { _id: 1 }, // Sort by date
      },
    ];

    // Fetch grouped data
    const perDayCounts = await WazuhIndexer.aggregate(pipeline);

    // Fetch all matching records (raw data)
    const allRecords = await WazuhIndexer.find({
      [`${severityField}.hits.total.value`]: { $gte: 1 },
      date_time: { $gte: startTime, $lte: endTime },
    }).lean();

    // Process and merge bucket data
    const mergedBuckets = {};
    allRecords.forEach((record) => {
      const graphContent = record[`${severityField}`]?.aggregations?.date_histogram_aggregation?.buckets;
      if (graphContent) {
        graphContent.forEach((bucket) => {
          const key = bucket.key_as_string;
          if (!mergedBuckets[key]) {
            mergedBuckets[key] = { ...bucket };
          } else {
            mergedBuckets[key].doc_count += bucket.doc_count;
          }
        });
      }
    });

    // Convert mergedBuckets object back to array
    const mergedBucketArray = Object.values(mergedBuckets);

    return { perDayCounts, allRecords, mergedBucketArray };
  } catch (error) {
    throw new Error(`Error occurred while fetching per-day counts: ${error.message}`);
  }
}

exports.getTotalCountsBySeverity = async function (timeRange) {
  try {
    // Calculate the start date based on the time range
    const startDate = new Date();
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
        startDate.setHours(startDate.getHours() - 24);
        break;
    }

    // Build the aggregation pipeline
    const pipeline = [
      {
        $match: {
          createdAt: { $gte: startDate } // Filter data based on the calculated start date
        }
      },
      {
        $group: {
          _id: null, // No specific grouping field, combine all data
          low_severity_hits_count: { $sum: "$low_severity_hits_count" },
          medium_severity_hits_count: { $sum: "$medium_severity_hits_count" },
          high_severity_hits_count: { $sum: "$high_severity_hits_count" },
          critical_severity_hits_count: { $sum: "$critical_severity_hits_count" }
        }
      },
      {
        $project: {
          _id: 0, // Exclude the `_id` field
          low_severity_hits_count: 1,
          medium_severity_hits_count: 1,
          high_severity_hits_count: 1,
          critical_severity_hits_count: 1
        }
      }
    ];

    // Execute the aggregation
    const result = await WazuhIndexer.aggregate(pipeline);

    // Return the counts (ensure a default structure if no data exists)
    return (
      result[0] || {
        low_severity_hits_count: 0,
        medium_severity_hits_count: 0,
        high_severity_hits_count: 0,
        critical_severity_hits_count: 0
      }
    );
  } catch (error) {
    throw new Error(
      `Error occurred while fetching total counts by severity: ${error.message}`
    );
  }
};

// exports.fetchIncidentTrendingData = async () => {
//     const currentTime = moment();
//     const startTime = currentTime.subtract(24, 'hours').toDate();
//     // var currentTime = "2025-01-20";
//     // var startTime = "2025-01-16"
//     console.log("cu--",currentTime,"start,",startTime);

//     try {
//         // Fetch data for the last 24 hours
//         const results = await WazuhIndexer.aggregate([
//             {
//                 $match: {
//                     date_time: { $gte: startTime, $lte: currentTime},
//                     deletedAt: null,
//                     status: true,
//                 },
//             },
//             {
//                 $project: {
//                     low_severity_hits_content: "$low_severity_hits_content.aggregations.date_histogram_aggregation.buckets",
//                     medium_severity_hits_content: "$medium_severity_hits_content.aggregations.date_histogram_aggregation.buckets",
//                     high_severity_hits_content: "$high_severity_hits_content.aggregations.date_histogram_aggregation.buckets",
//                     critical_severity_hits_content: "$critical_severity_hits_content.aggregations.date_histogram_aggregation.buckets",
//                 },
//             },
//         ]);
//         console.log("result----",results);
//         // Process the buckets to the desired format
//         const formatData = (buckets) => {
//             return buckets.map((bucket) => ({
//                 Time: bucket.key_as_string,
//                 Alert: bucket.doc_count,
//             }));
//         };

//         const data = results.map((result) => ({
//             low: formatData(result.low_severity_hits_content || []),
//             medium: formatData(result.medium_severity_hits_content || []),
//             high: formatData(result.high_severity_hits_content || []),
//             critical: formatData(result.critical_severity_hits_content || []),
//         }));

//         return data.length ? data[0] : { low: [], medium: [], high: [], critical: [] };
//     } catch (error) {
//         throw new Error("Error fetching incident trending data: " + error.message);
//     }
// };

exports.fetchIncidentTrendingData = async (startTime, endTime) => {
  try {
    const results = await WazuhIndexer.aggregate([
      {
        $match: {
          date_time: { $gte: startTime, $lte: endTime },
          deletedAt: null,
          status: true
        }
      },
      {
        $project: {
          low_severity_hits_content: "$low_severity_hits_content.aggregations.date_histogram_aggregation.buckets",
          medium_severity_hits_content: "$medium_severity_hits_content.aggregations.date_histogram_aggregation.buckets",
          high_severity_hits_content: "$high_severity_hits_content.aggregations.date_histogram_aggregation.buckets",
          critical_severity_hits_content: "$critical_severity_hits_content.aggregations.date_histogram_aggregation.buckets"
        }
      }
    ])

    const formatData = (buckets) => {
      return buckets.map((bucket) => ({
        Time: bucket.key_as_string,
        Alert: bucket.doc_count,
      }))
    }

    const data = results.map((result) => ({
      low: formatData(result.low_severity_hits_content || []),
      medium: formatData(result.medium_severity_hits_content || []),
      high: formatData(result.high_severity_hits_content || []),
      critical: formatData(result.critical_severity_hits_content || []),
    }));

    return data.length ? data[0] : { low: [], medium: [], high: [], critical: [] };
  } catch (error) {
    throw new Error("Error fetching incident trending data: " + error.message);
  }
};

exports.getWazuhIndexerById = async function (id) {
  try {
    var statistic = await WazuhIndexer.findById(id);
    if (statistic) {
      return statistic;
    } else {
      throw Error("Statistic not found");
    }
  } catch (e) {
    throw Error("Error occurred while retrieving the statistic");
  }
}

exports.getWazuhIndexerOne = async function (query, sortField = "", sortType = "") {
  try {
    var sorts = {};
    if (sortField) { sorts[sortField] = sortType; }

    var wazuhIndexer = await WazuhIndexer.findOne(query)
      .sort(sorts);

    return wazuhIndexer;
  } catch (error) {
    return null;
  }
}

exports.createWazuhIndexer = async function (statisticData) {
  var newStatistic = new WazuhIndexer({
    type: statisticData?.type || "",
    date: statisticData?.date || null,
    date_in_string: statisticData?.date_in_string || "",
    time: statisticData?.time || "",
    date_time: statisticData?.date_time || null,
    low_severity_hits_count: statisticData?.low_severity_hits_count || 0,
    low_severity_hits_content: statisticData?.low_severity_hits_content || null,
    medium_severity_hits_count: statisticData?.medium_severity_hits_count || 0,
    medium_severity_hits_content: statisticData?.medium_severity_hits_content || null,
    high_severity_hits_count: statisticData?.high_severity_hits_count || 0,
    high_severity_hits_content: statisticData?.high_severity_hits_content || null,
    critical_severity_hits_count: statisticData?.critical_severity_hits_count || 0,
    critical_severity_hits_content: statisticData?.critical_severity_hits_content || null,
    status: statisticData?.status || true,
    deletedAt: null
  })

  try {
    var savedStatistic = await newStatistic.save();
    return savedStatistic;
  } catch (e) {
    throw Error("Error occurred while creating the statistic: " + e.message);
  }
}

// Function to update an existing Wazuh Indexer statistic
exports.updateWazuhIndexer = async function (statisticData) {
  var id = statisticData._id;

  try {
    var oldStatistic = await WazuhIndexer.findById(id);
  } catch (e) {
    throw Error("Statistic not found");
  }

  if (!oldStatistic) { return false; }

  // Update fields
  if (statisticData.type) {
    oldStatistic.type = statisticData.type;
  }

  if (statisticData.date) {
    oldStatistic.date = statisticData.date;
  }

  if (statisticData.date_in_string) {
    oldStatistic.date_in_string = statisticData.date_in_string;
  }

  if (statisticData.time) {
    oldStatistic.time = statisticData.time;
  }

  if (statisticData.date_time) {
    oldStatistic.date_time = statisticData.date_time;
  }

  if (statisticData.low_severity_hits_count) {
    oldStatistic.low_severity_hits_count = statisticData.low_severity_hits_count;
  }

  if (statisticData.low_severity_hits_content) {
    oldStatistic.low_severity_hits_content = statisticData.low_severity_hits_content;
  }

  if (statisticData.medium_severity_hits_count) {
    oldStatistic.medium_severity_hits_count = statisticData.medium_severity_hits_count;
  }

  if (statisticData.medium_severity_hits_content) {
    oldStatistic.medium_severity_hits_content = statisticData.medium_severity_hits_content;
  }

  if (statisticData.high_severity_hits_count) {
    oldStatistic.high_severity_hits_count = statisticData.high_severity_hits_count;
  }

  if (statisticData.high_severity_hits_content) {
    oldStatistic.high_severity_hits_content = statisticData.high_severity_hits_content;
  }

  if (statisticData.critical_severity_hits_count) {
    oldStatistic.critical_severity_hits_count = statisticData.critical_severity_hits_count;
  }

  if (statisticData.critical_severity_hits_content) {
    oldStatistic.critical_severity_hits_content = statisticData.critical_severity_hits_content;
  }

  if (statisticData?.status || statisticData.status == false) {
    oldStatistic.status = statisticData?.status || false;
  }

  try {
    var savedStatistic = await oldStatistic.save();
    return savedStatistic;
  } catch (e) {
    throw Error("Error occurred while updating the statistic");
  }
}

// Function to delete a Wazuh Indexer statistic
exports.deleteWazuhIndexer = async function (id) {
  // Delete the Project
  try {
    var deleted = await WazuhIndexer.updateOne({
      _id: id
    }, {
      $set: { deletedAt: new Date() }
    });

    return deleted;
  } catch (e) {
    throw Error(e.message)
  }
}
