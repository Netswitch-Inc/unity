const Agent = require("../models/Agent.model");

exports.getAgents = async function (query = {}, page = 1, limit = 0, sortField = "", sortType) {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) sorts[sortField] = sortType;

    try {
        var agents = await Agent.find(query)
            .skip(skips)
            .limit(limit)
            .sort(sorts);

        return agents;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getAgentCount = async function (query) {
    try {
        var count = await Agent.find(query)
            .countDocuments();
            
        return count;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getAgent = async function (id) {
    try {
        var agent = await Agent.findOne({ _id: id });
        if (agent?._id) {
            return agent;
        } else {
            throw Error("Agent not found");
        }
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getAgentOne = async function (query) {
    try {
        var agent = await Agent.findOne(query);

        return agent || null;
    } catch (e) {
        return null
    }
}

exports.createAgent = async function (agentData) {
    var newAgent = new Agent({
        ref_id: agentData.ref_id ? agentData.ref_id : "",
        os: agentData.os || null,
        group: agentData.group || null,
        name: agentData.name ? agentData.name : "",
        ip: agentData.ip ? agentData.ip : "",
        registerIP: agentData.registerIP ? agentData.registerIP : "",
        version: agentData.version ? agentData.version : "",
        node_name: agentData.node_name ? agentData.node_name : "",
        manager: agentData.manager ? agentData.manager : "",
        mergedSum: agentData.mergedSum ? agentData.mergedSum : "",
        configSum: agentData.configSum ? agentData.configSum : "",
        dateAdd: agentData.dateAdd ? agentData.dateAdd : "",
        lastKeepAlive: agentData.lastKeepAlive ? agentData.lastKeepAlive : "",
        disconnection_time: agentData.disconnection_time ? agentData.disconnection_time : "",
        group_config_status: agentData.group_config_status ? agentData.group_config_status : "",
        status: agentData.status ? agentData.status : "",
        status_code: agentData.status_code || 0,
        deletedAt: agentData.deletedAt || null
    });

    try {
        var savedAgent = await newAgent.save();
        return savedAgent;
    } catch (e) {
        throw Error(e.message);
    }
}


exports.updateAgent = async function (agentData) {
    var id = agentData._id;

    try {
        // Find the old Agent object by its ID
        var oldAgent = await Agent.findById(id);
        if (!oldAgent) {
            throw Error("Agent not found");
        }

        // Update fields explicitly if they are provided in agentData
        if (agentData.ref_id) {
            oldAgent.ref_id = agentData.ref_id;
        }

        if (agentData.os || agentData.os === null) {
            oldAgent.os = agentData.os || null;
        }

        if (agentData.group || agentData.group === null) {
            oldAgent.group = agentData.group || null;
        }

        if (agentData.name) {
            oldAgent.name = agentData.name;
        }

        if (agentData.ip) {
            oldAgent.ip = agentData.ip;
        }

        if (agentData.registerIP) {
            oldAgent.registerIP = agentData.registerIP;
        }

        if (agentData.version) {
            oldAgent.version = agentData.version;
        }

        if (agentData.node_name) {
            oldAgent.node_name = agentData.node_name;
        }

        if (agentData.manager) {
            oldAgent.manager = agentData.manager;
        }

        if (agentData.mergedSum) {
            oldAgent.mergedSum = agentData.mergedSum;
        }

        if (agentData.configSum) {
            oldAgent.configSum = agentData.configSum;
        }

        if (agentData.dateAdd) {
            oldAgent.dateAdd = agentData.dateAdd;
        }

        if (agentData.lastKeepAlive) {
            oldAgent.lastKeepAlive = agentData.lastKeepAlive;
        }

        if (agentData.disconnection_time) {
            oldAgent.disconnection_time = agentData.disconnection_time;
        }

        if (agentData.group_config_status) {
            oldAgent.group_config_status = agentData.group_config_status;
        }

        if (agentData.status) {
            oldAgent.status = agentData.status;
        }

        if (agentData.status_code || agentData.status_code === 0) {
            oldAgent.status_code = agentData.status_code || 0;
        }

        if (agentData.deletedAt || agentData.deletedAt === null) {
            oldAgent.deletedAt = agentData.deletedAt || null;
        }

        // Save the updated Agent object
        var updatedAgent = await oldAgent.save();
        return updatedAgent;
    } catch (error) {
        console.log("updateAgent catch >>> ", error)
        throw Error(e.message);
    }
}

exports.getActiveAndInactiveAgentsCount = async function () {
    try {
        // Aggregate to count active and inactive agents
        const counts = await Agent.aggregate([
            {
                $match: { deletedAt: null } // Exclude deleted records
            },
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Convert the aggregation result into a friendly structure
        const result = {
            active: counts.find(c => c._id === "active")?.count || 0,
            disconnected: counts.find(c => c._id === "disconnected")?.count || 0,
        };

        return result;
    } catch (e) {
        throw Error(e.message);
    }
};


exports.softDeleteAgent = async function (id) {
    try {
        var deleted = await Agent.updateOne({
            _id: id
        }, {
            $set: { deletedAt: new Date() }
        });

        return deleted;
    } catch (e) {
        throw Error(e.message)
    }
}
