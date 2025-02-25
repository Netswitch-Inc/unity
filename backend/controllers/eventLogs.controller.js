var EventLogService = require('../services/eventLog.service');

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getEventLogs = async function (req, res, next) {
    try {
        // Check the existence of the query parameters, If doesn't exists assign a default value
        var page = Number(req.query?.page || 1);
        var limit = Number(req.query?.limit || 100);
        var sort = req.query?.sort == "asc" ? 1 : -1;
        var sortColumn = req.query.sortColumn ? req.query.sortColumn : "_id";
        var search = req.query?.search || "";
        var pageIndex = 0;
        var startIndex = 0;
        var endIndex = 0;

        var query = { deletedAt: null };

        if (search) {
            query["$or"] = [
                { action: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { type: { $regex: search, $options: 'i' } },
                { module_slug: { $regex: search, $options: 'i' } }
            ];
        }

        var count = await EventLogService.getEventLogCount(query);
        var eventLogs = await EventLogService.getEventLogs(query, page, limit, sortColumn, sort);
        if (!eventLogs || !eventLogs.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                eventLogs = await EventLogService.getEventLogs(query, page, limit, sortColumn, sort);
            }
        }

        if (eventLogs && eventLogs.length) {
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

        // Return the EventLogs list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: eventLogs, pagination, message: "Event Logs received successfully." });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getEventLog = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var EventLog = await EventLogService.getEventLog(id);
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: EventLog, message: "Event Log received successfully." });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.createEventLog = async function (req, res, next) {
    try {
        // Calling the Service function with the new object from the Request Body
        var createdEventLog = await EventLogService.createEventLog(req.body);
        return res.status(200).json({ status: 200, flag: true, data: createdEventLog, message: "Event Log created successfully." })
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.updateEventLog = async function (req, res, next) {
    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present" })
    }

    try {
        var updatedEventLog = await EventLogService.updateEventLog(req.body);
        return res.status(200).json({ status: 200, flag: true, data: updatedEventLog, message: "Event Log updated successfully." })
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.removeEventLog = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present" })
    }

    try {
        var deleted = await EventLogService.updateEventLog({ _id: id, deletedAt: new Date() });
        return res.status(200).send({ status: 200, flag: true, message: "Event Log deleted successfully." });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}
