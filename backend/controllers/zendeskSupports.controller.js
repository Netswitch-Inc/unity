const ZendeskSupportService = require("../services/zendeskSupport.service");

exports.getZendeskSupports = async function (req, res, next) {
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

        const count = await ZendeskSupportService.getZendeskSupportCount(query);
        const zendesks = await ZendeskSupportService.getZendeskSupports(
            query,
            page,
            limit,
            sortColumn,
            sort
        );
        if (!zendesks || !zendesks.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                zendesks = await ZendeskSupportService.getZendeskSupports(
                    query,
                    page,
                    limit,
                    sortColumn,
                    sort
                );
            }
        }

        if (zendesks && zendesks.length) {
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
                data: zendesks,
                pagination,
                message: "ZendeskSupports received successfully.",
            });
    } catch (e) {
        return res
            .status(200)
            .json({ status: 200, flag: false, message: e.message });
    }
};

exports.getZendeskSupport = async function (req, res, next) {
    var id = req.params.id;
    try {
        var zendesk = await ZendeskSupportService.getZendeskSupport(id);
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res
            .status(200)
            .json({
                status: 200,
                flag: true,
                data: zendesk,
                message: "ZendeskSupport received successfully.",
            });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res
            .status(200)
            .json({ status: 200, flag: false, message: e.message });
    }
};

exports.createZendeskSupport = async function (req, res, next) {
    try {
        var createdzendesk = await ZendeskSupportService.createZendeskSupport(
            req.body
        );
        return res
            .status(200)
            .json({
                status: 200,
                flag: true,
                data: createdzendesk,
                message: "Zendesk Support created successfully.",
            });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res
            .status(200)
            .json({ status: 200, flag: false, message: e.message });
    }
};

exports.updateZendeskSupport = async function (req, res, next) {
    if (!req.body?._id) {
        return res
            .status(400)
            .json({ status: 400, flag: false, message: "Id must be present" });
    }

    try {
        const updatedZendesk = await ZendeskSupportService.updateZendeskSupport(
            req.body
        );

        if (updatedZendesk?._id) {
            if (updatedZendesk?.status === false) {
                console.log(`Zendesk ${updatedZendesk._id} is now inactive.`);
            }
        }

        return res
            .status(200)
            .json({
                status: 200,
                flag: true,
                data: updatedZendesk,
                message: "Zendesk Support updated successfully",
            });
    } catch (e) {
        console.error("Error:", e.message);
        return res
            .status(200)
            .json({ status: 200, flag: false, message: e.message });
    }
};


exports.softDeleteZendeskSupport = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res
            .status(200)
            .json({ status: 200, flag: true, message: "Id must be present" });
    }

    try {
        var deleted = await ZendeskSupportService.softDeleteZendeskSupport(id);
        res
            .status(200)
            .send({
                status: 200,
                flag: true,
                message: "ZendeskSupport deleted successfully.",
            });
    } catch (e) {
        return res
            .status(200)
            .json({ status: 200, flag: false, message: e.message });
    }
};

exports.getZendeskSupportGraphData = async (req, res, next) => {
    try {
        const { filter } = req.query;
        let days;

        // Default to three weeks (21 days)
        switch (filter?.toLowerCase()) {
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
        const data = await ZendeskSupportService.getZendeskSupportGraphData(
            filterDate
        );

        if (!data || Object.keys(data).length === 0) {
            console.warn("No zendesk data found.");
            return res.status(200).json({
                status: 200,
                flag: false,
                message: "No zendesk data available.",
            });
        }

        return res
            .status(200)
            .json({
                status: 200,
                flag: true,
                data,
                message: "Zendesk graph data retrieved successfully.",
            });
    } catch (error) {
        console.error("Error fetching dashboard data:", error.message, error.stack);
        return res.status(200).json({ status: 200, flag: false, message: error.message });
    }
};