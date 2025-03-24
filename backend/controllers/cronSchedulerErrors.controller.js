var CronSchedulerErrorService = require('../services/cronSchedulerError.service');

const { getToolsPermissions } = require('../helper');

// Saving the context of this module inside the _the variable
_this = this;

exports.getCronSchedulerErrors = async function (req, res, next) {
    try {
        var page = Number(req.query?.page || 1);
        var limit = Number(req.query?.limit || 100);
        var sort = req.query?.sort == "asc" ? 1 : -1;
        var sortColumn = req.query.sortColumn ? req.query.sortColumn : '_id';
        var search = req.query?.search || "";
        var pageIndex = 0;
        var startIndex = 0;
        var endIndex = 0;

        var query = { deletedAt: null }

        var toolsPermission = await getToolsPermissions() || [];
        query.tool_slug = { $in: toolsPermission }

        if (search) {
            search = search.trim();
            query["$or"] = [
                { tool_slug: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } },
                { cron_style: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        var count = await CronSchedulerErrorService.getCronSchedulerErrorCount(query);
        var cronSchedulerErrors = await CronSchedulerErrorService.getCronSchedulerErrors(query, page, limit, sortColumn, sort);
        if (!cronSchedulerErrors || !cronSchedulerErrors.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                cronSchedulerErrors = await CronSchedulerErrorService.getCronSchedulerErrors(query, page, limit, sortColumn, sort);
            }
        }

        if (cronSchedulerErrors && cronSchedulerErrors.length) {
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
        return res.status(200).json({ status: 200, flag: true, data: cronSchedulerErrors, pagination, message: "Cron scheduler received successfully." });
    } catch (error) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: error.message });
    }
}

exports.getCronSchedulerError = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var cronSchedulerError = await CronSchedulerErrorService.getCronSchedulerError(id);
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: cronSchedulerError, message: "Cron scheduler received successfully." });
    } catch (error) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: error.message });
    }
}

exports.createCronSchedulerError = async function (req, res, next) {
    try {
        var createdCronSchedulerError = await CronSchedulerErrorService.createCronSchedulerError(req.body);
        return res.status(200).json({ status: 200, flag: true, data: createdCronSchedulerError, message: "Cron scheduler created successfully." });
    } catch (error) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: error.message });
    }
}

exports.updateCronSchedulerError = async function (req, res, next) {
    if (!req.body?._id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present" })
    }

    try {
        var updatedCronSchedulerError = await CronSchedulerErrorService.updateCronSchedulerError(req.body);

        return res.status(200).json({ status: 200, flag: true, data: updatedCronSchedulerError, message: "Cron scheduler updated successfully." })
    } catch (error) {
        console.log("updateCronSchedulerError catch >>> ", error.message);
        return res.status(200).json({ status: 200, flag: false, message: error.message });
    }
}

exports.softDeleteCronSchedulerError = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present" })
    }

    try {
        var deleted = await CronSchedulerErrorService.softDeleteCronSchedulerError(id);
        res.status(200).send({ status: 200, flag: true, message: "Cron scheduler deleted successfully." });
    } catch (error) {
        return res.status(200).json({ status: 200, flag: false, message: error.message });
    }
}
