const ProjectHistorieservice = require("../services/projecthistories.service");
exports.getProjectHistories = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    try {
        var page = Number(req.query?.page || 1);
        var limit = Number(req.query?.limit || 100);
        var sort = req.query?.sort == "asc" ? 1 : -1;
        var sortColumn = req.query.sortColumn ? req.query.sortColumn : "_id";
        var search = req.query?.search || "";
        var pageIndex = 0;
        var startIndex = 0;
        var endIndex = 0;

        var query = { deletedAt: null };
        // if (search) {
        //   query["$or"] = [
        //     { name: { $regex: ".*" + search + ".*", $options: "i" } },
        //   ];
        // }
        if (req.query?.project_id) {
            query.project_id = req.query.project_id;
        }

        var count = await ProjectHistorieservice.getProjectHistoriesCount(query);
        var ProjectHistories = await ProjectHistorieservice.getProjectHistories(
            query,
            page,
            limit,
            sortColumn,
            sort
        );
        if (!ProjectHistories || !ProjectHistories.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                ProjectHistories = await ProjectHistorieservice.getProjectHistories(
                    query,
                    page,
                    limit,
                    sortColumn,
                    sort
                );
            }
        }

        if (ProjectHistories && ProjectHistories.length) {
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

        // Return the ProjectHistories list with the appropriate HTTP password Code and Message.
        return res.status(200).json({
            status: 200,
            flag: true,
            data: ProjectHistories,
            pagination,
            message: "ProjectHistories received successfully!",
        });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res
            .status(200)
            .json({ status: 200, flag: false, message: e.message });
    }
};

exports.getProjectHistory = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var ProjectHistory = await ProjectHistorieservice.getProjectHistory(id);

        // Return the ProjectHistories with the appropriate HTTP password Code and Message.
        return res.status(200).json({
            status: 200,
            flag: true,
            data: ProjectHistory,
            message: "ProjectHistories received successfully!",
        });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res
            .status(200)
            .json({ status: 200, flag: false, message: e.message });
    }
};

exports.createProjectHistory = async function (req, res, next) {
    try {
        // Calling the Service function with the new object from the Request Body
        var createdProjectHistory = await ProjectHistorieservice.createProjectHistory(req.body);

        return res.status(200).json({
            status: 200,
            flag: true,
            data: createdProjectHistory,
            message: "ProjectHistory created successfully!",
        });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res
            .status(200)
            .json({ status: 200, flag: false, message: e.message });
    }
};

exports.updateProjectHistory = async function (req, res, next) {
    // Id is necessary for the update
    if (!req.body._id) {
        return res
            .status(200)
            .json({ status: 200, flag: false, message: "Id must be present!" });
    }

    try {
        // Calling the Service function with the new object from the Request Body
        var updatedProjectHistory = await ProjectHistorieservice.updateProjectHistory(req.body);

        return res.status(200).json({
            status: 200,
            flag: true,
            data: updatedProjectHistory,
            message: "ProjectHistory updated successfully!",
        });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res
            .status(200)
            .json({ status: 200, flag: false, message: e.message });
    }
};

exports.removeProjectHistory = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res
            .status(200)
            .json({ status: 200, flag: true, message: "Id must be present" });
    }

    try {
        var deleted = await ProjectHistorieservice.softDeleteProjectHistory(id);
        return res.status(200).send({
            status: 200,
            flag: true,
            message: "ProjectHistory deleted successfully.",
        });
    } catch (e) {
        return res
            .status(200)
            .json({ status: 200, flag: false, message: e.message });
    }
};
