var Connection = require("../models/Connection.model");

exports.getConnections = async function (query = {}, page = 1, limit = 0, sortField = "", sortType) {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) { sorts[sortField] = sortType; }

    // Try Catch the awaited promise to handle the error 
    try {
        var connectiones = await Connection.find(query)
            .skip(skips)
            .limit(limit)
            .sort(sorts);

        return connectiones;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getConnectionCount = async function (query) {
    try {
        var count = await Connection.find(query).count();

        return count;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getConnection = async function (id) {
    try {
        // Find the Data
        var _details = await Connection.findOne({ _id: id, deletedAt: null });
        if (_details?._id) {
            return _details;
        } else {
            throw Error("Connection not available");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.message);
    }
}

exports.getConnectionOne = async function (query = {}) {
    try {
        var connection = await Connection.findOne(query);

        return connection || null;
    } catch (e) {
        // return a Error message describing the reason
        return null;
    }
}

exports.createConnection = async function (connection) {
    var newConnection = new Connection({
        tool_slug: connection.tool_slug ? connection.tool_slug : "",
        name: connection.name ? connection.name : "",
        type: connection.type ? connection.type : "",
        description: connection.description ? connection.description : "",
        ip_address: connection.ip_address ? connection.ip_address : "",
        port: connection.port ? connection.port : "",
        username: connection.username ? connection.username : "",
        password: connection.password ? connection.password : "",
        is_connected: connection.is_connected ? connection.is_connected : false,
        is_default: false,
        status: true,
        deletedAt: null
    })

    try {
        // Saving the Role 
        var savedConnection = await newConnection.save();
        return savedConnection;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.message);
    }
}

exports.updateConnection = async function (connection) {
    var id = connection._id;
    try {
        // Find the old Connection Object by the Id
        var oldConnection = await Connection.findById(id);
    } catch (e) {
        throw Error("Connection not found");
    }

    if (!oldConnection) { return false; }

    if (connection.tool_slug) {
        oldConnection.tool_slug = connection.tool_slug;
    }

    if (connection.name) {
        oldConnection.name = connection.name;
    }

    if (connection.type) {
        oldConnection.type = connection.type;
    }

    if (connection?.description || connection.description == "") {
        oldConnection.description = connection?.description || "";
    }

    if (connection.ip_address) {
        oldConnection.ip_address = connection.ip_address;
    }

    if (connection.port) {
        oldConnection.port = connection.port;
    }

    if (connection.username) {
        oldConnection.username = connection.username;
    }

    if (connection.password) {
        oldConnection.password = connection.password;
    }

    if (connection?.is_connected || connection.is_connected == false) {
        oldConnection.is_connected = connection?.is_connected || false;
    }

    if (connection?.status || connection.status == false) {
        oldConnection.status = connection?.status || false;
    }

    if (connection?.deletedAt || connection.deletedAt == "") {
        oldConnection.deletedAt = connection?.deletedAt || null;
    }

    try {
        var savedConnection = await oldConnection.save();
        return savedConnection;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.updateManyConnection = async function (query, payload) {
    try {
        var connections = await Connection.updateMany(query, payload);
        return connections;
    } catch (error) {
        console.log("updateManyConnection catch >>> ", error);
        throw Error("Error occurred while updating the cron schedulers");
    }
}

exports.softDeleteConnection = async function (id) {
    try {
        var deleted = await Connection.updateOne({
            _id: id
        }, {
            $set: { deletedAt: new Date() }
        });

        return deleted;
    } catch (e) {
        throw Error(e.message)
    }
}
