var ConnetionService = require('../services/connection.service');

const { getToolsPermissions } = require('../helper');

// Saving the context of this module inside the _the variable
_this = this;

exports.getConnectiones = async function (req, res, next) {
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
                { type: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } },
                { ip_address: { $regex: search, $options: 'i' } },
                { username: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ]
        }

        var count = await ConnetionService.getConnectionCount(query);
        var connections = await ConnetionService.getConnections(query, page, limit, sortColumn, sort);
        if (!connections || !connections.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                connections = await ConnetionService.getConnections(query, page, limit, sortColumn, sort);
            }
        }

        if (connections && connections.length) {
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
        return res.status(200).json({ status: 200, flag: true, data: connections, pagination, message: "Connection received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getConnection = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var connection = await ConnetionService.getConnection(id);
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: connection, message: "Connection received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.createConnection = async function (req, res, next) {
    try {
        const { ip_address, type } = req.body
        // if (!username || !password || !ip_address || !port || !type) {
        if (!ip_address || !type) {
            return res.status(200).json({ status: 200, flag: false, message: "ip_address, type fields are required." });
        }

        var createdConnection = await ConnetionService.createConnection(req.body);
        return res.status(200).json({ status: 200, flag: true, data: createdConnection, message: "Connection created successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.updateConnection = async function (req, res, next) {
    if (!req.body._id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present" })
    }

    try {
        var updatedConnection = await ConnetionService.updateConnection(req.body);
        return res.status(200).json({ status: 200, flag: true, data: updatedConnection, message: "Connection updated successfully." })
    } catch (e) {
        console.log('e', e.message);
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.softDeleteConnection = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present" })
    }

    try {
        var deleted = await ConnetionService.softDeleteConnection(id);
        res.status(200).send({ status: 200, flag: true, message: "Connection deleted successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}
