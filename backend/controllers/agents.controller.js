var AgentService = require("../services/agent.service");

exports.getAgents = async function (req, res, next) {
    try {
        var page = Number(req.query?.page || 1);
        var limit = Number(req.query?.limit || 10);
        var sort = req.query?.sort === "asc" ? 1 : -1;
        var sortColumn = req.query.sortColumn || "_id";
        var search = req.query?.search?.trim() || "";
        var pageIndex = 0;
        var startIndex = 0;
        var endIndex = 0;

        // Add default query for non-deleted records
        var query = { deletedAt: null };
        if (req?.query?.status) {
            query.status = req.query.status;
        }

        if (req.query.search && req.query.search != "undefined") {
            search = search.trim();
            query["$or"] = [
                { name: { $regex: search, $options: 'i' } },
                { ip: { $regex: search, $options: 'i' } },
                { version: { $regex: search, $options: 'i' } },
                { node_name: { $regex: search, $options: 'i' } },
                { manager: { $regex: search, $options: 'i' } },
                { group_config_status: { $regex: search, $options: 'i' } },
                { registerIP: { $regex: search, $options: 'i' } },
                { ref_id: { $regex: search, $options: 'i' } },
                { mergedSum: { $regex: search, $options: 'i' } },
                { configSum: { $regex: search, $options: 'i' } },
            ];
        }

        // Fetch total count and data based on query
        var count = await AgentService.getAgentCount(query);
        let agents = await AgentService.getAgents(query, page, limit, sortColumn, sort);
        if (!agents || !agents.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                agents = await AgentService.getAgents(query, page, limit, sortColumn, sort);
            }
        }

        if (agents && agents.length) {
            pageIndex = page - 1;
            startIndex = (pageIndex * limit) + 1;
            endIndex = Math.min(startIndex - 1 + limit, count);
        }


        // Pagination details
        var pagination = {
            pages: Math.ceil(count / limit),
            total: count,
            pageIndex,
            startIndex,
            endIndex
        }

        // Success response
        return res.status(200).json({
            status: 200,
            flag: true,
            data: agents,
            pagination,
            message: "Agents retrieved successfully"
        });
    } catch (e) {
        // Error response
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getAgent = async function (req, res) {
    try {
        const agent = await AgentService.getAgent(req.params.id);
        return res.status(200).json({ status: 200, flag: true, data: agent, message: "Agent retrieved successfully" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
};

exports.createAgent = async function (req, res) {
    try {
        const newAgent = await AgentService.createAgent(req.body);
        return res.status(200).json({ status: 200, flag: true, data: newAgent, message: "Agent created successfully" });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
};

exports.updateAgent = async function (req, res, next) {
  if (!req.body?._id) {
    return res.status(200).json({ status: 200, flag: false, message: "Id must be present" });
  }

  try {
    const updatedAgent = await AgentService.updateAgent(req.body)
    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedAgent,
      message: "Agent updated successfully.",
    });
  } catch (e) {
    return res.status(200).json({
      status: 200,
      flag: false,
      message: e.message,
    });
  }
};

exports.getActiveAndInactiveAgentsCount = async function (req, res, next) {
    try {
        const counts = await AgentService.getActiveAndInactiveAgentsCount();

        return res.status(200).json({ status: 200, flag: true, data: counts, message: "Active and inactive agents count retrieved successfully"});
    } catch (e) {
        return res.status(500).json({status: 500, flag: false, message: e.message });
    }
};


exports.softDeleteAgent = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present" })
    }

    try {
        var deleted = await AgentService.softDeleteAgent(id);
        res.status(200).send({ status: 200, flag: true, message: "Agent deleted successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getActiveAgentsCount = async function (req, res, next) {
    try {
        // Fetch the total count of active agents

        const query = { status: "active", deletedAt: null };
        const totalActiveAgents = await AgentService.getActiveAgentsCount(query);
        return res.status(200).json({
            status: 200,
            flag: true,
            data: { agents_count: totalActiveAgents },
            message: "Active agents count retrieved successfully",
        });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
};
