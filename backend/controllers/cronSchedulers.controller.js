var CronSchedulerService = require('../services/cronScheduler.service');

const { cronTaskFuntions, stopCronJob, scheduleCronJob } = require('./crons.controller');

const { getToolsPermissions } = require('../helper');

// Saving the context of this module inside the _the variable
_this = this;

exports.getCronSchedulers = async function (req, res, next) {
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
        query.tool_id = { $in: toolsPermission }

        if (req.query?.search) {
            search = search.trim();
            query["$or"] = [
                { type: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { slug: { $regex: search, $options: 'i' } },
                { cron_style: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        var count = await CronSchedulerService.getCronSchedulerCount(query);
        var cronSchedulers = await CronSchedulerService.getCronSchedulers(query, page, limit, sortColumn, sort);
        if (!cronSchedulers || !cronSchedulers.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                cronSchedulers = await CronSchedulerService.getCronSchedulers(query, page, limit, sortColumn, sort);
            }
        }

        if (cronSchedulers && cronSchedulers.length) {
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
        return res.status(200).json({ status: 200, flag: true, data: cronSchedulers, pagination, message: "Cron scheduler received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getCronScheduler = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var cronScheduler = await CronSchedulerService.getCronScheduler(id);
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: cronScheduler, message: "Cron scheduler received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.createCronScheduler = async function (req, res, next) {
    try {
        var createdCronScheduler = await CronSchedulerService.createCronScheduler(req.body);
        return res.status(200).json({ status: 200, flag: true, data: createdCronScheduler, message: "Cron scheduler created successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.updateCronScheduler = async function (req, res, next) {
    if (!req.body?._id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present" })
    }

    try {
        var updatedCronScheduler = await CronSchedulerService.updateCronScheduler(req.body);

        // ** Cron execution
        if (updatedCronScheduler?._id) {
            if (updatedCronScheduler?.status == false) {
                stopCronJob(updatedCronScheduler._id)
            }

            if (updatedCronScheduler?.slug && updatedCronScheduler?.cron_style && cronTaskFuntions[updatedCronScheduler.slug] && updatedCronScheduler?.status == true) {
                stopCronJob(updatedCronScheduler._id)
                scheduleCronJob(updatedCronScheduler._id, updatedCronScheduler.cron_style, cronTaskFuntions[updatedCronScheduler.slug])
            }
        }

        return res.status(200).json({ status: 200, flag: true, data: updatedCronScheduler, message: "Cron scheduler updated successfully." })
    } catch (e) {
        console.log('e', e.message);
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.softDeleteCronScheduler = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present" })
    }

    try {
        var deleted = await CronSchedulerService.softDeleteCronScheduler(id);
        res.status(200).send({ status: 200, flag: true, message: "Cron scheduler deleted successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}
