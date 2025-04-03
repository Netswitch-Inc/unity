var OpenVASScanReportService = require('../services/openVASScanReport.service');

// Saving the context of this module inside the _the variable
_this = this;

exports.getOpenVASScanReports = async function (req, res, next) {
    try {
        var page = Number(req.query?.page || 1);
        var limit = Number(req.query?.limit || 100);
        var sort = req.query?.sort == "asc" ? 1 : -1;
        var sortColumn = req.query.sortColumn ? req.query.sortColumn : '_id';
        var search = req.query?.search || "";
        var pageIndex = 0;
        var startIndex = 0;
        var endIndex = 0;

        var query = { deletedAt: null };
        if (req.query?.search) {
            search = search.trim();
            query["$or"] = [
                { ip: { $regex: search, $options: 'i' } },
                { severity: { $regex: search, $options: 'i' } },
                { task_name: { $regex: search, $options: 'i' } },
                { solution_type: { $regex: search, $options: 'i' } },
                { hostname: { $regex: search, $options: 'i' } },
                { solution: { $regex: search, $options: 'i' } },
                { impact: { $regex: search, $options: 'i' } },
            ];
        }

        var count = await OpenVASScanReportService.getOpenVASScanReportCount(query);
        var openVASScanReports = await OpenVASScanReportService.getOpenVASScanReports(query, page, limit, sortColumn, sort);
        if (!openVASScanReports || !openVASScanReports.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                openVASScanReports = await OpenVASScanReportService.getOpenVASScanReports(query, page, limit, sortColumn, sort);
            }
        }

        if (openVASScanReports && openVASScanReports.length) {
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
        }

        // Return the Roles list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: openVASScanReports, pagination, message: "OpenVAS Scan Report received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getOpenVASScanReport = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var openVASScanReport = await OpenVASScanReportService.getOpenVASScanReport(id);
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: openVASScanReport, message: "OpenVAS Scan Report received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.createOpenVASScanReport = async function (req, res, next) {
    try {
        var createdOpenVASScanReport = await OpenVASScanReportService.createOpenVASScanReport(req.body);
        return res.status(200).json({ status: 200, flag: true, data: createdOpenVASScanReport, message: "OpenVAS Scan Report created successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.updateOpenVASScanReport = async function (req, res, next) {
    if (!req.body?._id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present" })
    }

    try {
        var updatedOpenVASScanReport = await OpenVASScanReportService.updateOpenVASScanReport(req.body);

        return res.status(200).json({ status: 200, flag: true, data: updatedOpenVASScanReport, message: "OpenVAS Scan Report updated successfully." })
    } catch (e) {
        console.log('e', e.message);
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.softDeleteOpenVASScanReport = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present" })
    }

    try {
        var deleted = await OpenVASScanReportService.softDeleteOpenVASScanReport(id);
        return res.status(200).send({ status: 200, flag: true, message: "OpenVAS Scan Report deleted successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.insertMultipleOpenVASScanReport = async function (req, res, next) {
    try {
        const scanReports = req.body;
        if (!Array.isArray(scanReports) || scanReports.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid input, expected an array of objects.' });
        }

        const result = await OpenVASScanReportService.insertMultipleOpenVASScanReport(scanReports);

        return res.status(200).json({ status: 200, flag: true, data: result, message: "OpenVAS Scan Report Multiple record inserted successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.openVASScanReportGraphData = async function (req, res, next) {
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

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        console.error("Error fetching severity count by IP:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
}
