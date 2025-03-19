// Gettign the Newly created Mongoose Model we just created 
var EventLog = require('../models/EventLog.model');

const { isObjEmpty } = require('../helper')

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the EventLog List
exports.getEventLogs = async function (query = {}, page = 1, limit = 0, sortField = "", sortType = "") {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) { sorts[sortField] = sortType; }

    // Try Catch the awaited promise to handle the error 
    try {
        var eventLogs = await EventLog.find(query)
            .populate({ path: 'company_id', select: "name" })
            .populate({ path: 'module_id', select: "group_name name slug" })
            .populate({ path: 'action_user_id', select: "name" })
            .populate({ path: 'user_id', select: "name" })
            .sort(sorts)
            .skip(skips)
            .limit(limit);

        // Return the EventLogs list that was retured by the mongoose promise
        return eventLogs;
    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while Paginating Event Logs');
    }
}

exports.getEventLogCount = async function (query) {
    try {
        var count = await EventLog.find(query).count();

        return count;
    } catch (e) {
        throw Error('Error while Counting Event Log');
    }
}

exports.getSimpleEventLogs = async function (query) {
    // Try Catch the awaited promise to handle the error 
    try {
        var eventLogs = await EventLog.find(query);

        // Return the EventLogs list that was retured by the mongoose promise
        return eventLogs;
    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while Paginating Event Logs');
    }
}

exports.getEventLog = async function (id) {
    try {
        // Find the Data 
        var _details = await EventLog.findOne({ _id: id })
            .populate({ path: 'company_id', select: "name" })
            .populate({ path: 'module_id', select: "group_name name slug" })
            .populate({ path: 'action_user_id', select: "name" })
            .populate({ path: 'user_id', select: "name" });

        if (_details._id) {
            return _details;
        } else {
            throw Error("Event Log not available");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Event Log not available");
    }
}

exports.getEventLogOne = async function (query) {
    try {
        // Find the Data 
        var eventLog = await EventLog.findOne(query)
            .populate({ path: 'company_id', select: "name" })
            .populate({ path: 'module_id', select: "group_name name slug" })
            .populate({ path: 'action_user_id', select: "name" })
            .populate({ path: 'user_id', select: "name" });

        return eventLog || null;
    } catch (e) {
        // return a Error message describing the reason     
        return null;
    }
}

exports.createEventLog = async function (eventLog) {
    var newEventLog = new EventLog({
        company_id: eventLog.company_id ? eventLog.company_id : null,
        module_id: eventLog.module_id ? eventLog.module_id : null,
        action_user_id: eventLog.action_user_id ? eventLog.action_user_id : null,
        user_id: eventLog.user_id ? eventLog.user_id : null,
        reference_id: eventLog.reference_id ? eventLog.reference_id : null,
        date_in_string: eventLog.date_in_string ? eventLog.date_in_string : "",
        module_slug: eventLog.module_slug ? eventLog.module_slug : "",
        type: eventLog.type ? eventLog.type : "",
        action: eventLog.action ? eventLog.action : "",
        description: eventLog.description ? eventLog.description : "",
        previous_data: eventLog.previous_data ? eventLog.previous_data : null,
        current_data: eventLog.current_data ? eventLog.current_data : null,
        deletedAt: null
    })

    try {
        // Saving the EventLog 
        var savedEventLog = await newEventLog.save();
        return savedEventLog;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error while Creating Event Log");
    }
}

exports.updateEventLog = async function (eventLog) {
    var id = eventLog._id;
    try {
        // Find the old EventLog Object by the Id
        var oldEventLog = await EventLog.findById(id);
    } catch (e) {
        throw Error("Error occured while Finding the Event Log");
    }

    // If no old EventLog Object exists return false
    if (!oldEventLog) { return false; }

    // Edit the EventLog Object
    if (eventLog.company_id) {
        oldEventLog.company_id = eventLog.company_id;
    }

    if (eventLog.module_id) {
        oldEventLog.module_id = eventLog.module_id;
    }

    if (eventLog.action_user_id) {
        oldEventLog.action_user_id = eventLog.action_user_id;
    }

    if (eventLog.user_id) {
        oldEventLog.user_id = eventLog.user_id;
    }

    if (eventLog.reference_id) {
        oldEventLog.reference_id = eventLog.reference_id;
    }

    if (eventLog.date_in_string) {
        oldEventLog.date_in_string = eventLog.date_in_string;
    }

    if (eventLog.module_slug) {
        oldEventLog.module_slug = eventLog.module_slug;
    }

    if (eventLog.type) {
        oldEventLog.type = eventLog.type;
    }

    if (eventLog.action) {
        oldEventLog.action = eventLog.action;
    }

    if (eventLog.description) {
        oldEventLog.description = eventLog.description;
    }

    if (eventLog.previous) {
        oldEventLog.previous_data = oldEventLog?.current_data || null;
    }

    if (eventLog.previous_data) {
        oldEventLog.previous_data = !isObjEmpty(eventLog.previous_data) ? eventLog.previous_data : null;
    }

    if (eventLog.current_data) {
        oldEventLog.current_data = !isObjEmpty(eventLog.current_data) ? eventLog.current_data : null;
    }

    if (eventLog.deletedAt) {
        oldEventLog.deletedAt = eventLog.deletedAt;
    }

    try {
        var savedEventLog = await oldEventLog.save();
        return savedEventLog;
    } catch (e) {
        throw Error("And Error occured while updating the Event Log");
    }
}

exports.deleteEventLog = async function (id) {
    // Delete the EventLog
    try {
        var deleted = await EventLog.remove({ _id: id });
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Event Log Could not be deleted");
        }

        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the Event Log");
    }
}
