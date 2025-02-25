var ConfigurationAssessmentService = require("../services/configurationAssessment.service");

const { wazuhToolAgentsConfigurationAssessmentData } = require("./crons.controller");

exports.getConfigurationAssessments = async function (req, res, next) {
    try {
        var page = Number(req.query?.page || 1);
        var limit = Number(req.query?.limit || 10);
        var sort = req.query?.sort == "asc" ? 1 : -1;
        var sortColumn = req.query.sortColumn ? req.query.sortColumn : '_id';
        var search = req.query?.search || "";
        var pageIndex = 0;
        var startIndex = 0;
        var endIndex = 0;
        var refreshType = req.query?.refresh_type || "";
        if (refreshType === "configuration") {
            await wazuhToolAgentsConfigurationAssessmentData();
        }

        var query = { deletedAt: null };
        if (req?.query?.agent_ref_id) {
            query.agent_ref_id = req.query.agent_ref_id;
        }

        if (search) {
            search = search.trim();
            query["$or"] = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        var count = await ConfigurationAssessmentService.getConfigurationAssessmentCount(query);
        var configurationAssessments = await ConfigurationAssessmentService.getConfigurationAssessments(query, page, limit, sortColumn, sort);
        if (!configurationAssessments || !configurationAssessments.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                configurationAssessments = await ConfigurationAssessmentService.getConfigurationAssessments(query, page, limit, sortColumn, sort);
            }
        }

        if (configurationAssessments && configurationAssessments.length) {
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
        return res.status(200).json({ status: 200, flag: true, data: configurationAssessments, pagination, message: "configurationAssessments received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getConfigurationAssessment = async function (req, res) {
    try {
        var configurationAssessment = await ConfigurationAssessmentService.getConfigurationAssessment(req.params.id);
        return res.status(200).json({ status: 200, flag: true, data: configurationAssessment, message: "Configuration Assessment retrieved successfully" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.createConfigurationAssessment = async function (req, res) {
    try {
        var configurationAssessment = await ConfigurationAssessmentService.createConfigurationAssessment(req.body);
        return res.status(200).json({ status: 200, flag: true, data: configurationAssessment, message: "Configuration Assessment created successfully" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.updateConfigurationAssessment = async function (req, res) {
    if (!req.body?._id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present" });
    }

    try {
        // Call the service to update the configuration assessment
        var updatedConfigurationAssessment = await ConfigurationAssessmentService.updateConfigurationAssessment(req.body);

        // Respond with success
        return res.status(200).json({
            status: 200,
            flag: true,
            data: updatedConfigurationAssessment,
            message: "Configuration Assessment updated successfully."
        });
    } catch (e) {
        console.log("Error:", e.message);
        // Respond with error
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}


exports.softDeleteConfigurationAssessment = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present" })
    }

    try {
        var deleted = await ConfigurationAssessmentService.softDeleteConfigurationAssessment(id);
        return res.status(200).send({ status: 200, flag: true, message: "Configuration Assessment deleted successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}
