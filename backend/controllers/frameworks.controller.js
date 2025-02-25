var FrameworkService = require('../services/framework.service');

// Saving the context of this module inside the _the variable
_this = this;

exports.getFrameworks = async function (req, res, next) {
    try {
        var sort = req.query?.sort == "asc" ? 1 : -1;
        var sortColumn = req.query.sortColumn ? req.query.sortColumn : '_id';
        var page = Number(req.query?.page || 1);
        var limit = Number(req.query?.limit || 100);
        var search = req.query?.search || "";
        var pageIndex = 0;
        var startIndex = 0;
        var endIndex = 0;

        var query = { deletedAt: null };

        if (search) {
            search = search.trim();
            query["$or"] = [
                { label: { $regex: search, $options: 'i' } },
                { value: { $regex: search, $options: 'i' } }
            ];
        }

        var count = await FrameworkService.getFrameworkCount(query);
        var frameworks = await FrameworkService.getFrameworks(query, page, limit, sortColumn, sort);
        if (!frameworks || !frameworks.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                frameworks = await FrameworkService.getFrameworks(query, page, limit, sortColumn, sort);
            }
        }

        if (frameworks && frameworks.length) {
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

        // Return the Frameworks with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: frameworks, pagination, message: "Frameworks received successfully" });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getDropdownFrameworks = async function (req, res, next) {
    try {
        var query = { status: 1, deletedAt: null };

        var frameworks = await FrameworkService.getFrameworks(query);

        // Return the Frameworks with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: frameworks, message: "Frameworks received successfully" });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getFrameworksWithIds = async function (req, res) {
    try {
        var framework = await FrameworkService.getFrameworksWithIds();
        return res.status(200).json({ status: 200, flag: true, data: framework, message: "Framework received successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getFramework = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var framework = await FrameworkService.getFramework(id);

        // Return the Framework with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: framework, message: "Framework received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.createFramework = async function (req, res, next) {
    try {
        // Calling the Service function with the new object from the Request Body
        var createdFramework = await FrameworkService.createFramework(req.body);
        return res.status(200).json({ status: 200, flag: true, data: createdFramework, message: "Framework created successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.updateFramework = async function (req, res, next) {
    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present" });
    }

    try {
        var updatedFramework = await FrameworkService.updateFramework(req.body);
        return res.status(200).json({ status: 200, flag: true, data: updatedFramework, message: "Framework updated successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.removeFramework = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present" });
    }

    try {
        var deleted = await FrameworkService.softDeleteFramework(id);
        return res.status(200).send({ status: 200, flag: true, message: "Framework deleted successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}
