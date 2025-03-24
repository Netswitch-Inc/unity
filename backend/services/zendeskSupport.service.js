const ZendeskSupport = require("../models/ZendeskSupport.model");

exports.getZendeskSupports = async function (query = {}, page = 1, limit = 0, sortField = "", sortType) {
    const skips = limit * (page - 1);
    const sorts = {};
    if (sortField) sorts[sortField] = sortType;

    try {
        const zendesks = await ZendeskSupport.find(query).skip(skips).limit(limit).sort(sorts);
        return zendesks;
    } catch (e) {
        throw Error(e.message);
    }
};

exports.getZendeskSupportCount = async function (query) {
    try {
        const count = await ZendeskSupport.find(query).countDocuments();
        return count;
    } catch (e) {
        throw Error(e.message);
    }
};

exports.getZendeskSupportOne = async function (query = {}) {
    try {
        var zendesk = await ZendeskSupport.findOne(query);

        return zendesk;
    } catch (e) {
        // return a Error message describing the reason 
        return null
    }
}

exports.getZendeskSupport = async function (id) {
    try {
        const zendesk = await ZendeskSupport.findOne({ _id: id, deletedAt: null });
        if (zendesk?._id) {
            return zendesk;
        } else {
            throw Error("Zendesk Support not found");
        }
    } catch (e) {
        throw Error(e.message);
    }
};

exports.createZendeskSupport = async function (zendeskSupport) {
    const newZendesk = new ZendeskSupport({
        type: zendeskSupport.type ? zendeskSupport.type : "",
        date: zendeskSupport.date ? zendeskSupport.date : null,
        time: zendeskSupport.time ? zendeskSupport.time : "",
        date_in_string: zendeskSupport.date_in_string ? zendeskSupport.date_in_string : "",
        date_time: zendeskSupport.date_time ? zendeskSupport.date_time : null,
        closed_request_content: zendeskSupport.closed_request_content ? zendeskSupport.closed_request_content : null,
        open_request_content: zendeskSupport.open_request_content ? zendeskSupport.open_request_content : null,
        received_request_content: zendeskSupport.received_request_content ? zendeskSupport.received_request_content : null,
        status: zendeskSupport.status !== undefined ? zendeskSupport.status : true,
        deletedAt: null
    });

    try {
        const savedZendesk = await newZendesk.save();
        return savedZendesk;
    } catch (e) {
        throw Error(e.message);
    }
};

exports.updateZendeskSupport = async function (zendeskSupport) {
    const id = zendeskSupport._id;
    try {
        // Find the existing ZendeskSupport  document by ID
        const oldZendesk = await ZendeskSupport.findById(id);
        if (!oldZendesk) {
            throw Error("Zendesk Support not found");
        }

        // Update fields only if they exist in the input ZendeskSupport 
        if (zendeskSupport.type) {
            oldZendesk.type = zendeskSupport.type;
        }

        if (zendeskSupport.date || zendeskSupport.date === null) {
            oldZendesk.date = zendeskSupport.date || null;
        }

        if (zendeskSupport.time) {
            oldZendesk.time = zendeskSupport.time;
        }

        if (zendeskSupport.date_in_string) {
            oldZendesk.date_in_string = zendeskSupport.date_in_string;
        }

        if (zendeskSupport.date_time || zendeskSupport.date_time === null) {
            oldZendesk.date_time = zendeskSupport.date_time || null;
        }

        if (zendeskSupport.closed_request_content || zendeskSupport.closed_request_content === null) {
            oldZendesk.closed_request_content = zendeskSupport.closed_request_content || null;
        }

        if (zendeskSupport.open_request_content || zendeskSupport.open_request_content === null) {
            oldZendesk.open_request_content = zendeskSupport.open_request_content || null;
        }

        if (zendeskSupport.received_request_content || zendeskSupport.received_request_content === null) {
            oldZendesk.received_request_content = zendeskSupport.received_request_content || null;
        }

        if (zendeskSupport.status || zendeskSupport.status === false) {
            oldZendesk.status = zendeskSupport.status;
        }

        if (zendeskSupport.deletedAt || zendeskSupport.deletedAt === null) {
            oldZendesk.deletedAt = zendeskSupport.deletedAt || null;
        }

        // Save the updated document
        const updatedZendesk = await oldZendesk.save();
        return updatedZendesk;

    } catch (e) {
        // Handle errors and rethrow them
        throw Error(e.message);
    }
};

exports.softDeleteZendeskSupport = async function (id) {
    try {
        var deleted = await ZendeskSupport.updateOne({
            _id: id
        }, {
            $set: { deletedAt: new Date() }
        });

        return deleted;
    } catch (e) {
        throw Error(e.message)
    }
}

//  Utility function to format a timestamp to DD/MM/YYYY
const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return `${date.getUTCDate().toString().padStart(2, "0")}/${(date.getUTCMonth() + 1)
        .toString()
        .padStart(2, "0")}/${date.getUTCFullYear()}`;
};
    
const processClosedRequests = (docs) => {
    const closedGraphMap = {};

    docs.forEach((doc) => {
        const closedRequests = doc.closed_request_content?.results || [];
        closedRequests.forEach((ticket) => {
            if (!ticket.created_at) return;

            const createdDate = new Date(ticket.created_at);
            if (isNaN(createdDate.getTime())) return;

            const dateStr = formatDate(createdDate);
            if (dateStr === "Invalid Date") return;

            if (!closedGraphMap[dateStr]) {
                closedGraphMap[dateStr] = { count: 0 };
            }

            if (closedGraphMap[dateStr].count === 0) {
                closedGraphMap[dateStr].count = 1;
            }
        });
    });

    return Object.entries(closedGraphMap)
        .sort(([a], [b]) => {
            // Convert "DD/MM/YYYY" to "YYYY-MM-DD" for correct sorting
            const dateA = a.split("/").reverse().join("-");
            const dateB = b.split("/").reverse().join("-");
            return new Date(dateA) - new Date(dateB);
        })
        .map(([date, data]) => ({ date, ...data }));
};

const processOpenRequests = (docs) => {
    const openGraphMap = {};

    docs.forEach((doc) => {
        const openRequests = doc.open_request_content?.results || [];
        openRequests.forEach((ticket) => {
            if (!ticket.created_at) return;

            const createdDate = new Date(ticket.created_at);
            if (isNaN(createdDate.getTime())) return;

            const dateStr = formatDate(createdDate);
            if (dateStr === "Invalid Date") return;

            if (!openGraphMap[dateStr]) {
                openGraphMap[dateStr] = { count: 0 };
            }

            if (openGraphMap[dateStr].count === 0) {
                openGraphMap[dateStr].count = 1;
            }
        });
    });

    return Object.entries(openGraphMap)
        .sort(([a], [b]) => {
            // Convert "DD/MM/YYYY" to "YYYY-MM-DD" for correct sorting
            const dateA = a.split("/").reverse().join("-");
            const dateB = b.split("/").reverse().join("-");
            return new Date(dateA) - new Date(dateB);
        })
        .map(([date, data]) => ({ date, ...data }));
};

const processUnassignedGauge = (docs) => {
    let totalOpen = 0;
    let unassignedCount = 0;

    docs.forEach((doc) => {
        const openTickets = [
            ...(doc.received_request_content?.results || []),
            ...(doc.open_request_content?.results || []),
        ];

        openTickets.forEach((ticket) => {
            if (ticket.status === "open") {
                totalOpen++;
                if (!ticket.assignee_id) unassignedCount++;
            }
        });
    });

    return {
        totalOpen,
        unassignedCount,
        percentage: totalOpen ? (unassignedCount / totalOpen) * 100 : 0,
    };
};

exports.getZendeskSupportGraphData = async function (fromDate) {
    const docs = await ZendeskSupport.find(
        { date: { $gte: fromDate } },
        { closed_request_content: 1, open_request_content: 1, received_request_content: 1, date: 1 }
    );

    return {
        closedGraphData: processClosedRequests(docs),
        openGraphData: processOpenRequests(docs),
        unassignedGauge: processUnassignedGauge(docs),
    };
};
