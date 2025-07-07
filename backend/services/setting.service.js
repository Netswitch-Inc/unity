var Setting = require('../models/Setting.model');

var fs = require("fs");
var publicPath = require("path").resolve("public");
var ImageService = require("../services/image.service");

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the Setting List
exports.getSettings = async function (query = {}, page = 1, limit = 0) {
    var skips = limit * (page - 1);
    // Try Catch the awaited promise to handle the error 
    try {
        var settings = await Setting.find(query)
            .skip(skips)
            .limit(limit);

        return settings;
    } catch (e) {
        throw Error('Error occurred while finding Settings.');
    }
}

exports.getSettingDistinct = async function (field, query) {
    try {
        var settings = await Setting.distinct(field, query);

        return settings;
    } catch (e) {
        // console.log("Error ", e);
        // return a Error message describing the reason 
        throw Error('Error while Distinct Setting.');
    }
}

exports.getSettingsByGroupName = async function (group) {
    try {
        var settings = await Setting.find({ group_name: group });
        return settings;
    } catch (e) {
        // console.log("Error ", e);
        // return a Error message describing the reason 
        throw Error('Error while Finding Settings by Group Name.');
    }
}

exports.getSetting = async function (id) {
    try {
        // Find the Data 
        var _details = await Setting.findOne({ _id: id });
        if (_details._id) {
            return _details;
        } else {
            throw Error("Setting not available.");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Setting not available.");
    }
}

exports.getSettingOne = async function (query) {
    try {
        // Find the Data 
        var setting = await Setting.findOne(query);
        return setting || null
    } catch (e) {
        // return a Error message describing the reason     
        return null
    }
}

exports.getSettingBySlug = async function (slug) {
    try {
        // Find the Data 
        var _details = await Setting.findOne({ slug: slug });
        return _details;
    } catch (e) {
        // return a Error message describing the reason     
        // throw Error("Setting not available");
        return null
    }
}

exports.createSetting = async function (setting) {
    if (!fs.existsSync(publicPath + "/images/settings")) {
        fs.mkdirSync(publicPath + "/images/settings", { recursive: true });
    }

    if (setting?.value && setting?.type == "image") {
        var isImage = await ImageService.saveImage(setting.value, "/images/settings/").then((data) => { return data; })

        if (typeof isImage != "undefined" && isImage != null && isImage != "") {
            setting.value = isImage;
        }
    }

    var newSetting = new Setting({
        options: setting?.options?.length ? setting.options : null,
        group_name: setting?.group_name ? setting.group_name : "",
        name: setting?.name ? setting.name : "",
        slug: setting?.slug ? setting.slug : "",
        type: setting?.type ? setting.type : "",
        note: setting?.note ? setting.note : "",
        value: setting?.value ? setting.value : "",
        disabled: setting?.disabled ? setting.disabled : false,
        deletedAt: null
    })

    try {
        // Saving the Setting 
        var savedSetting = await newSetting.save();
        return savedSetting;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error occurred while creating Setting.")
    }
}

exports.updateSetting = async function (setting) {
    var id = setting._id;
    try {
        // Find the old Setting Object by the Id
        var oldSetting = await Setting.findById(id);
    } catch (e) {
        throw Error("Setting not found.")
    }

    // If no old Setting Object exists return false
    if (!oldSetting) { return false; }

    // Edit the Setting Object
    if (setting?.options) {
        oldSetting.options = setting.options?.length ? setting.options : null;
    }

    if (setting?.group_name) {
        oldSetting.group_name = setting.group_name;
    }

    if (setting?.name) {
        oldSetting.name = setting.name;
    }

    if (setting?.slug) {
        oldSetting.slug = setting.slug;
    }

    if (setting?.note || setting.note == "") {
        oldSetting.note = setting?.note || "";
    }

    if (setting?.value && oldSetting?.type == "image") {
        if (!fs.existsSync(publicPath + "/images/settings")) {
            fs.mkdirSync(publicPath + "/images/settings", { recursive: true });
        }

        var isImage = await ImageService.saveImage(setting.value, "/images/settings/").then((data) => { return data; })
        if (typeof isImage != "undefined" && isImage != null && isImage != "") {
            try {
                var filePath = publicPath + "/" + oldSetting.value;
                fs.unlinkSync(filePath);
            } catch (err) {
                //console.log("\n\nImage Remove Issues >>>>>>>>>>>>>>\n\n");
            }

            setting.value = isImage;
        }
    }

    if (setting?.value || setting.value == "") {
        oldSetting.value = setting?.value || "";
    }

    if (setting?.disabled || setting.disabled == false) {
        oldSetting.disabled = setting?.disabled || false;
    }

    if (setting?.deletedAt) {
        oldSetting.deletedAt = setting.deletedAt;
    }

    try {
        var savedSetting = await oldSetting.save();
        return savedSetting;
    } catch (e) {
        console.log(e)
        throw Error("Error occurred while updating the Setting.");
    }
}

exports.deleteSetting = async function (id) {
    // Delete the Setting
    try {
        var deleted = await Setting.remove({ _id: id })
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Setting Could not be deleted.")
        }
        return deleted;
    } catch (e) {
        throw Error("Error occurred while Deleting the Setting.")
    }
}

exports.softDeleteSetting = async function (id) {
    try {
        //Find the old Setting Object by the Id
        var oldSetting = await Setting.findById(id);
    } catch (e) {
        throw Error("Error occur while Finding the Setting.")
    }

    // If no old Setting Object exists return false
    if (!oldSetting) {
        return false;
    }

    oldSetting.deletedAt = new Date();

    try {
        var savedSetting = await oldSetting.save()
        return savedSetting;
    } catch (e) {
        throw Error("Error occur while Deleting the Setting.");
    }
}
