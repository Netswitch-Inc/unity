var SettingService = require('../services/setting.service');

var fs = require("fs");
var publicPath = require("path").resolve("public");

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getSettings = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = Number(req.query?.page || 1);
    var limit = Number(req.query?.limit || 1000);
    var query = { deletedAt: null };

    try {
        var settingData = [];
        var groups = await SettingService.getSettingDistinct('group_name', query);

        if (groups && groups.length) {
            for (var i = 0; i < groups.length; i++) {
                var settings = await SettingService.getSettings({ group_name: groups[i], deletedAt: null });
                var index = settingData.findIndex(x => x.group_name === groups[i]);
                if (index === -1) {
                    settingData.push({ group_name: groups[i], settings: settings });
                }
            }
        }

        // Return the Settings list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: settingData, message: "Settings received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getSetting = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var setting = await SettingService.getSetting(id);

        // Return the Settings list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: setting, message: "Setting received successfully." });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getSettingSlug = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var slug = req.params.slug;
    try {
        var setting = await SettingService.getSettingBySlug(slug);

        // Return the Settings list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: setting, message: "Setting received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.createSetting = async function (req, res, next) {
    try {
        // Calling the Service function with the new object from the Request Body
        var createdSetting = await SettingService.createSetting(req.body);
        return res.status(200).json({ status: 200, flag: true, data: createdSetting, message: "Setting created successfully." })
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.updateSetting = async function (req, res, next) {
    try {
        var data = req.body?.data || [];
        if (!data?.length && !req.body?._id) {
            return res.status(200).json({ status: 200, flag: false, message: "Id must be present." })
        }

        if (data?.length) {
            for (var i = 0; i < data.length; i++) {
                if (data[i] && data[i]._id) {
                    var updatePayload = {
                        _id: data[i]._id,
                        slug: data[i].slug
                    }

                    if (data[i]?.value || data[i].value == "") {
                        updatePayload.value = data[i].value;
                    }

                    if (data[i]?.options?.length) {
                        updatePayload.options = data[i].options;
                    }

                    var updatedSetting = await SettingService.updateSetting(updatePayload);
                }
            }
        } else {
            var updatedSetting = await SettingService.updateSetting(req.body);
        }

        return res.status(200).json({
            status: 200,
            flag: true,
            data: updatedSetting,
            message: "Setting updated successfully."
        });
    } catch (error) {
        return res.status(200).json({ status: 200, flag: false, message: error.message })
    }
}

exports.removeSetting = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present." })
    }
    try {
        // var deleted = await SettingService.deleteSetting(id);
        var deleted = await SettingService.softDeleteSetting(id);
        return res.status(200).send({ status: 200, flag: true, message: "Setting deleted successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.getAppSettings = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    try {
        var appName = await SettingService.getSettingBySlug("app_setting_name") || null;
        var appURL = await SettingService.getSettingBySlug("app_setting_url") || null;
        var appFavicon = await SettingService.getSettingBySlug("app_setting_favicon") || null;
        var appLogo = await SettingService.getSettingBySlug("app_setting_logo") || null;
        var aiInteService = await SettingService.getSettingBySlug("ai_integration_service") || null;
        var aiInteApiKey = null;
        if (aiInteService?.value) {
            var aiServiceAPISlug = `${aiInteService?.type}_${aiInteService?.value}_api_key`;
            aiInteApiKey = await SettingService.getSettingBySlug(aiServiceAPISlug) || null;
        }

        appName = appName?.value || "";
        appURL = appURL?.value || "";
        appFavicon = appFavicon?.value || "";
        appLogo = appLogo?.value || "";
        aiInteService = aiInteService?.value || "";
        aiInteApiKey = aiInteApiKey?.value || "";

        if (appFavicon && !fs.existsSync(`${publicPath}/${appFavicon}`)) { appFavicon = ""; }
        if (appLogo && !fs.existsSync(`${publicPath}/${appLogo}`)) { appLogo = ""; }

        let appSettingItems = {
            name: appName,
            url: appURL,
            favicon: appFavicon,
            logo: appLogo
        }

        if (aiInteService && aiInteApiKey) {
            appSettingItems.ai_service_enabled = true;
        }

        // Return the Settings list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: appSettingItems, message: "App Settings received successfully." });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}