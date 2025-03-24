var CronSchedulerError = require("../models/CronSchedulerError.model");

exports.getCronSchedulerErrors = async function (query = {}, page = 1, limit = 0, sortField = "", sortType) {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) { sorts[sortField] = sortType; }

    // Try Catch the awaited promise to handle the error 
    try {
        var cronSchedulerErrors = await CronSchedulerError.find(query)
            .populate({ path: 'cron_scheduler_id' })
            .skip(skips)
            .limit(limit)
            .sort(sorts);

        return cronSchedulerErrors;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getCronSchedulerErrorCount = async function (query) {
    try {
        var count = await CronSchedulerError.find(query).count();

        return count;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getCronSchedulerError = async function (id) {
    try {
        // Find the Data
        var _details = await CronSchedulerError.findOne({ _id: id, deletedAt: null })
            .populate({ path: 'cron_scheduler_id' });
        if (_details?._id) {
            return _details;
        } else {
            throw Error("CronSchedulerError not available");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.message);
    }
}

exports.getCronSchedulerErrorOne = async function (query = {}) {
    try {
        var cronSchedulerError = await CronSchedulerError.findOne(query)
            .populate({ path: 'cron_scheduler_id' });

        return cronSchedulerError;
    } catch (e) {
        // return a Error message describing the reason
        return null
    }
}

exports.createCronSchedulerError = async function (cronSchedulerError) {
    var newCronSchedulerError = new CronSchedulerError({
        connection_id: cronSchedulerError.connection_id ? cronSchedulerError.connection_id : null,
        cron_scheduler_id: cronSchedulerError.cron_scheduler_id ? cronSchedulerError.cron_scheduler_id : null,
        tool_slug: cronSchedulerError.tool_slug ? cronSchedulerError.tool_slug : "",
        date: cronSchedulerError.date ? cronSchedulerError.date : null,
        slug: cronSchedulerError.slug ? cronSchedulerError.slug : "",
        cron_style: cronSchedulerError.cron_style ? cronSchedulerError.cron_style : "",
        cron_style_disabled: cronSchedulerError.cron_style_disabled ? cronSchedulerError.cron_style_disabled : false,
        description: cronSchedulerError.description ? cronSchedulerError.description : "",
        error_logs: cronSchedulerError.error_logs ? cronSchedulerError.error_logs : null,
        status: cronSchedulerError.status ? cronSchedulerError.status : false,
        deletedAt: null
    })

    try {
        // Saving the CronSchedulerError 
        var savedCronSchedulerError = await newCronSchedulerError.save();
        return savedCronSchedulerError;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.message);
    }
}

exports.updateCronSchedulerError = async function (cronSchedulerError) {
    var id = cronSchedulerError._id;
    try {
        // Find the old CronSchedulerError Object by the Id
        var oldCronSchedulerError = await CronSchedulerError.findById(id);
    } catch (e) {
        throw Error("Cron Scheduler Error not found");
    }

    if (!oldCronSchedulerError) { return false; }

    if (cronSchedulerError.connection_id) {
        oldCronSchedulerError.connection_id = cronSchedulerError.connection_id;
    }

    if (cronSchedulerError.cron_scheduler_id) {
        oldCronSchedulerError.cron_scheduler_id = cronSchedulerError.cron_scheduler_id;
    }

    if (cronSchedulerError.tool_slug) {
        oldCronSchedulerError.tool_slug = cronSchedulerError.tool_slug;
    }

    if (cronSchedulerError.date) {
        oldCronSchedulerError.date = cronSchedulerError.date;
    }

    if (cronSchedulerError.slug) {
        oldCronSchedulerError.slug = cronSchedulerError.slug;
    }

    if (cronSchedulerError.cron_style) {
        oldCronSchedulerError.cron_style = cronSchedulerError.cron_style;
    }

    if (cronSchedulerError.cron_style_disabled || cronSchedulerError.cron_style_disabled == false) {
        oldCronSchedulerError.cron_style_disabled = cronSchedulerError?.cron_style_disabled || false;
    }

    if (cronSchedulerError?.description || cronSchedulerError.description == "") {
        oldCronSchedulerError.description = cronSchedulerError?.description || "";
    }

    if (cronSchedulerError?.status || cronSchedulerError.status == false) {
        oldCronSchedulerError.status = cronSchedulerError?.status || false;
    }

    if (cronSchedulerError?.deletedAt || cronSchedulerError.deletedAt == "") {
        oldCronSchedulerError.deletedAt = cronSchedulerError?.deletedAt || null;
    }

    try {
        var savedCronSchedulerError = await oldCronSchedulerError.save();
        return savedCronSchedulerError;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.updateManyCronSchedulerError = async function (query, payload) {
    try {
        var cronSchedulerErrors = await CronSchedulerError.updateMany(query, payload);
        return cronSchedulerErrors;
    } catch (error) {
        console.log("updateManyCronSchedulerError catch >>> ", error);
        throw Error("Error occurred while updating the cron schedulers");
    }
}

exports.softDeleteCronSchedulerError = async function (id) {
    try {
        var deleted = await CronSchedulerError.updateOne({
            _id: id
        }, {
            $set: { deletedAt: new Date() }
        })

        return deleted;
    } catch (e) {
        throw Error(e.message)
    }
}
