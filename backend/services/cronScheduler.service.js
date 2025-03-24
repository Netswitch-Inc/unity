var CronScheduler = require("../models/CronScheduler.model");

exports.getCronSchedulers = async function (query = {}, page = 1, limit = 0, sortField = "", sortType) {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) { sorts[sortField] = sortType; }

    // Try Catch the awaited promise to handle the error 
    try {
        var cronSchedulers = await CronScheduler.find(query)
            .skip(skips)
            .limit(limit)
            .sort(sorts);

        return cronSchedulers;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getCronSchedulerCount = async function (query) {
    try {
        var count = await CronScheduler.find(query).count();

        return count;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getCronScheduler = async function (id) {
    try {
        // Find the Data
        var _details = await CronScheduler.findOne({ _id: id, deletedAt: null });
        if (_details?._id) {
            return _details;
        } else {
            throw Error("CronScheduler not available");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.message);
    }
}

exports.getCronSchedulerOne = async function (query = {}) {
    try {
        var cronScheduler = await CronScheduler.findOne(query);

        return cronScheduler;
    } catch (e) {
        // return a Error message describing the reason
        return null
    }
}

exports.createCronScheduler = async function (cronScheduler) {
    var newCronScheduler = new CronScheduler({
        tool_slug: cronScheduler.tool_slug ? cronScheduler.tool_slug : "",
        name: cronScheduler.name ? cronScheduler.name : "",
        type: cronScheduler.type ? cronScheduler.type : "",
        slug: cronScheduler.slug ? cronScheduler.slug : "",
        cron_style: cronScheduler.cron_style ? cronScheduler.cron_style : "",
        cron_style_disabled: cronScheduler.cron_style_disabled ? cronScheduler.cron_style_disabled : false,
        description: cronScheduler.description ? cronScheduler.description : "",
        is_default: false,
        status: cronScheduler.status ? cronScheduler.status : false,
        deletedAt: null
    })

    try {
        // Saving the CronScheduler 
        var savedCronScheduler = await newCronScheduler.save();
        return savedCronScheduler;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.message);
    }
}

exports.updateCronScheduler = async function (cronScheduler) {
    var id = cronScheduler._id;
    try {
        // Find the old CronScheduler Object by the Id
        var oldCronScheduler = await CronScheduler.findById(id);
    } catch (e) {
        throw Error("CronScheduler not found");
    }

    if (!oldCronScheduler) { return false; }

    if (cronScheduler.tool_slug) {
        oldCronScheduler.tool_slug = cronScheduler.tool_slug;
    }

    if (cronScheduler.name) {
        oldCronScheduler.name = cronScheduler.name;
    }

    if (cronScheduler.type) {
        oldCronScheduler.type = cronScheduler.type;
    }

    if (cronScheduler.slug) {
        oldCronScheduler.slug = cronScheduler.slug;
    }

    if (cronScheduler.cron_style) {
        oldCronScheduler.cron_style = cronScheduler.cron_style;
    }

    if (cronScheduler.cron_style_disabled || cronScheduler.cron_style_disabled == false) {
        oldCronScheduler.cron_style_disabled = cronScheduler?.cron_style_disabled || false;
    }

    if (cronScheduler?.description || cronScheduler.description == "") {
        oldCronScheduler.description = cronScheduler?.description || "";
    }

    if (cronScheduler?.status || cronScheduler.status == false) {
        oldCronScheduler.status = cronScheduler?.status || false;
    }

    if (cronScheduler?.deletedAt || cronScheduler.deletedAt == "") {
        oldCronScheduler.deletedAt = cronScheduler?.deletedAt || null;
    }

    try {
        var savedCronScheduler = await oldCronScheduler.save();
        return savedCronScheduler;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.updateManyCronScheduler = async function (query, payload) {
    try {
        var cronSchedulers = await CronScheduler.updateMany(query, payload);
        return cronSchedulers;
    } catch (error) {
        console.log("updateManyCronScheduler catch >>> ", error);
        throw Error("Error occurred while updating the cron schedulers");
    }
}

exports.softDeleteCronScheduler = async function (id) {
    try {
        var deleted = await CronScheduler.updateOne({
            _id: id
        }, {
            $set: { deletedAt: new Date() }
        })

        return deleted;
    } catch (e) {
        throw Error(e.message)
    }
}
