var OpenVASScanReport = require("../models/OpenVASScanReport.model");

exports.getOpenVASScanReports = async function (query = {}, page = 1, limit = 0, sortField = "", sortType) {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) { sorts[sortField] = sortType; }

    // Try Catch the awaited promise to handle the error 
    try {
        var openVASScanReports = await OpenVASScanReport.find(query)
            .skip(skips)
            .limit(limit)
            .sort(sorts);

        return openVASScanReports;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getOpenVASScanReportCount = async function (query) {
    try {
        var count = await OpenVASScanReport.find(query).count();

        return count;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getOpenVASScanReport = async function (id) {
    try {
        // Find the Data
        var _details = await OpenVASScanReport.findOne({ _id: id, deletedAt: null });
        if (_details?._id) {
            return _details;
        } else {
            throw Error("OpenVASScanReport not available");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.message);
    }
}

exports.getOpenVASScanReportOne = async function (query = {}) {
    try {
        var openVASScanReport = await OpenVASScanReport.findOne(query);

        return openVASScanReport;
    } catch (e) {
        // return a Error message describing the reason
        return null
    }
}
exports.createOpenVASScanReport = async function (openVASScanResultData) {
    var newOpenVASScanReport = new OpenVASScanReport({
        ip: openVASScanResultData.ip ? openVASScanResultData.ip : "",
        hostname: openVASScanResultData.hostname ? openVASScanResultData.hostname : "",
        port: openVASScanResultData.port ? openVASScanResultData.port : "",
        port_protocol: openVASScanResultData.port_protocol ? openVASScanResultData.port_protocol : "",
        cvss: openVASScanResultData.cvss ? openVASScanResultData.cvss : 0,
        severity: openVASScanResultData.severity ? openVASScanResultData.severity : "",
        qod: openVASScanResultData.qod ? openVASScanResultData.qod : 0,
        solution_type: openVASScanResultData.solution_type ? openVASScanResultData.solution_type : "",
        nvt_name: openVASScanResultData.nvt_name ? openVASScanResultData.nvt_name : "",
        summary: openVASScanResultData.summary ? openVASScanResultData.summary : "",
        specific_result: openVASScanResultData.specific_result ? openVASScanResultData.specific_result : "",
        nvt_oid: openVASScanResultData.nvt_oid ? openVASScanResultData.nvt_oid : "",
        cves: openVASScanResultData.cves ? openVASScanResultData.cves : "",
        task_id: openVASScanResultData.task_id ? openVASScanResultData.task_id : "",
        task_name: openVASScanResultData.task_name ? openVASScanResultData.task_name : "",
        timestamp: openVASScanResultData.timestamp ? openVASScanResultData.timestamp : new Date(),
        result_id: openVASScanResultData.result_id ? openVASScanResultData.result_id : "",
        impact: openVASScanResultData.impact ? openVASScanResultData.impact : "",
        solution: openVASScanResultData.solution ? openVASScanResultData.solution : "",
        affected_software_os: openVASScanResultData.affected_software_os ? openVASScanResultData.affected_software_os : "",
        vulnerability_insight: openVASScanResultData.vulnerability_insight ? openVASScanResultData.vulnerability_insight : "",
        vulnerability_detection_method: openVASScanResultData.vulnerability_detection_method ? openVASScanResultData.vulnerability_detection_method : "",
        product_detection_result: openVASScanResultData.product_detection_result ? openVASScanResultData.product_detection_result : "",
        bids: openVASScanResultData.bids ? openVASScanResultData.bids : "",
        certs: openVASScanResultData.certs ? openVASScanResultData.certs : "",
        other_references: openVASScanResultData.other_references ? openVASScanResultData.other_references : "",
        deletedAt: null
    });

    try {
        // Saving the OpenVASScanReport 
        var savedOpenVASScanReport = await newOpenVASScanReport.save();
        return savedOpenVASScanReport;
    } catch (e) {
        // Return an error message describing the reason
        throw Error(e.message);
    }
};

exports.updateOpenVASScanReport = async function (openVASScanReport) {
    var id = openVASScanReport._id;
    try {
        // Find the old OpenVASScanReport Object by the Id
        var oldOpenVASScanReport = await OpenVASScanReport.findById(id);
    } catch (e) {
        throw Error("OpenVASScanReport not found");
    }

    if (!oldOpenVASScanReport) { return false; }

    if (openVASScanReport.ip) {
        oldOpenVASScanReport.ip = openVASScanReport.ip;
    }

    if (openVASScanReport.hostname) {
        oldOpenVASScanReport.hostname = openVASScanReport.hostname;
    }

    if (openVASScanReport.port) {
        oldOpenVASScanReport.port = openVASScanReport.port;
    }

    if (openVASScanReport.port_protocol) {
        oldOpenVASScanReport.port_protocol = openVASScanReport.port_protocol;
    }

    if (openVASScanReport.cvss || openVASScanReport.cvss === 0) {
        oldOpenVASScanReport.cvss = openVASScanReport.cvss;
    }

    if (openVASScanReport.severity) {
        oldOpenVASScanReport.severity = openVASScanReport.severity;
    }

    if (openVASScanReport.qod || openVASScanReport.qod === 0) {
        oldOpenVASScanReport.qod = openVASScanReport.qod;
    }

    if (openVASScanReport.solution_type) {
        oldOpenVASScanReport.solution_type = openVASScanReport.solution_type;
    }

    if (openVASScanReport.nvt_name) {
        oldOpenVASScanReport.nvt_name = openVASScanReport.nvt_name;
    }

    if (openVASScanReport.summary) {
        oldOpenVASScanReport.summary = openVASScanReport.summary;
    }

    if (openVASScanReport.specific_result) {
        oldOpenVASScanReport.specific_result = openVASScanReport.specific_result;
    }

    if (openVASScanReport.nvt_oid) {
        oldOpenVASScanReport.nvt_oid = openVASScanReport.nvt_oid;
    }

    if (openVASScanReport.cves) {
        oldOpenVASScanReport.cves = openVASScanReport.cves;
    }

    if (openVASScanReport.task_id) {
        oldOpenVASScanReport.task_id = openVASScanReport.task_id;
    }

    if (openVASScanReport.task_name) {
        oldOpenVASScanReport.task_name = openVASScanReport.task_name;
    }

    if (openVASScanReport.timestamp) {
        oldOpenVASScanReport.timestamp = openVASScanReport.timestamp;
    }

    if (openVASScanReport.result_id) {
        oldOpenVASScanReport.result_id = openVASScanReport.result_id;
    }

    if (openVASScanReport.impact) {
        oldOpenVASScanReport.impact = openVASScanReport.impact;
    }

    if (openVASScanReport.solution) {
        oldOpenVASScanReport.solution = openVASScanReport.solution;
    }

    if (openVASScanReport.affected_software_os) {
        oldOpenVASScanReport.affected_software_os = openVASScanReport.affected_software_os;
    }

    if (openVASScanReport.vulnerability_insight) {
        oldOpenVASScanReport.vulnerability_insight = openVASScanReport.vulnerability_insight;
    }

    if (openVASScanReport.vulnerability_detection_method) {
        oldOpenVASScanReport.vulnerability_detection_method = openVASScanReport.vulnerability_detection_method;
    }

    if (openVASScanReport.product_detection_result) {
        oldOpenVASScanReport.product_detection_result = openVASScanReport.product_detection_result;
    }

    if (openVASScanReport.bids) {
        oldOpenVASScanReport.bids = openVASScanReport.bids;
    }

    if (openVASScanReport.certs) {
        oldOpenVASScanReport.certs = openVASScanReport.certs;
    }

    if (openVASScanReport.other_references) {
        oldOpenVASScanReport.other_references = openVASScanReport.other_references;
    }

    if (openVASScanReport.deletedAt || openVASScanReport.deletedAt === "") {
        oldOpenVASScanReport.deletedAt = openVASScanReport.deletedAt || null;
    }

    try {
        // Saving the updated OpenVASScanReport
        var savedOpenVASScanReport = await oldOpenVASScanReport.save();
        return savedOpenVASScanReport;
    } catch (e) {
        throw Error(e.message);
    }
};


exports.softDeleteOpenVASScanReport = async function (id) {
    try {
        var deleted = await OpenVASScanReport.updateOne({
            _id: id
        }, {
            $set: { deletedAt: new Date() }
        });

        return deleted;
    } catch (e) {
        throw Error(e.message)
    }
}


exports.insertMultipleOpenVASScanReport = async function (scanResults) {
    try {
        // Filter out empty objects
        const filteredResults = scanResults.filter(obj => Object.keys(obj).length > 0);

        if (filteredResults.length === 0) {
            throw new Error('No valid data to insert.');
        }

        // Insert filtered data into MongoDB
        // const insertedResults = await OpenVASScanReport.insertMany(filteredResults);
        const allData = []
        for (const data of scanResults) {
            const newData = new OpenVASScanReport(data)
            await newData.save()

            allData.push(newData)
        }
        return allData;
    } catch (e) {
        throw Error(e.message)
    }
}

exports.getOpenVASScanReportGraph = async function (startTime, endTime, query, dateFormat) {
    try {
        if (typeof query !== "object" || Array.isArray(query)) {
            throw new Error("Invalid query format: Query must be an object.");
        }

        var scanResults = await OpenVASScanReport.aggregate([
            {
                $match: {
                    ...query,
                    timestamp: { $gte: startTime, $lte: endTime } // Filter based on timestamp range
                }
            },
            {
                $addFields: {
                    yearMonth: {
                        $dateToString: { format: dateFormat, date: "$timestamp" } // Extract year and month in YYYY-MM format
                    }
                }
            },
            {
                $group: {
                    _id: {
                        yearMonth: "$yearMonth",
                        severity: { $toLower: "$severity" }
                    },
                    vulnerabilities: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.yearMonth": 1 }
            },
            {
                $project: {
                    timestamp: "$_id.yearMonth", // Keep YYYY-MM format
                    severity: {
                        $concat: [
                            { $toUpper: { $substrCP: ["$_id.severity", 0, 1] } }, // Capitalize first letter
                            { $substrCP: ["$_id.severity", 1, { $strLenCP: "$_id.severity" }] } // Keep remaining lowercase
                        ]
                    },
                    vulnerabilities: "$vulnerabilities",
                    _id: 0
                }
            }
        ]);

        return scanResults || [];
    } catch (error) {
        throw new Error(error.message);
    }
};
