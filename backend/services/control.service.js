// Getting the Newly created Mongoose Model we just created 
var Control = require("../models/Control.model");

// Saving the context of this module inside the _the variable
_this = this;

exports.getControls = async function (query = {}, page = 1, limit = 0, sortField = "", sortType = "") {
    var skips = limit * (page - 1)
    var sorts = {};
    if (sortField) { sorts[sortField] = sortType; }

    // Try Catch the awaited promise to handle the error 
    try {
        var controls = await Control.find(query)
            .populate({ path: 'cis_control_id' })
            .skip(skips)
            .limit(limit)
            .sort(sorts);

        return controls;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getControlCount = async function (query) {
    try {
        var count = await Control.find(query).count();

        return count;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getControl = async function (id) {
    try {
        // Find the Data 
        var _details = await Control.findOne({ _id: id })
            .populate({ path: 'cis_control_id' });
        if (_details?._id) {
            return _details;
        } else {
            throw Error("Control not available");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.message);
    }
}

exports.createControl = async function (control) {
    var newControl = new Control({
        framework_id: control.framework_id ? control.framework_id : null,
        cis_control_id: control.cis_control_id?.length ? control.cis_control_id : null,
        reference_id: control.reference_id ? control.reference_id : null,
        identifier: control.identifier ? control.identifier : "",
        name: control.name ? control.name : "",
        impact: control.impact ? control.impact : "",
        priority: control.priority ? control.priority : "",
        description: control.description ? control.description : "",
        ai_description: control.ai_description ? control.ai_description : "",
        icon: control.icon ? control.icon : "",
        relation: control.relation ? control.relation : "",
        status: control.status ? control.status : 0,
        deletedAt: null
    })

    try {
        // Saving the Control 
        var savedControl = await newControl.save();
        return savedControl;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.message);
    }
}

exports.updateControl = async function (control) {
    var id = control._id;
    try {
        // Find the old Control Object by the Id
        var oldControl = await Control.findById(id);
    } catch (e) {
        throw Error("Control not found");
    }

    if (!oldControl) { return false; }

    if (control.framework_id) {
        oldControl.framework_id = control.framework_id;
    }

    if (control.cis_control_id?.length) {
        oldControl.cis_control_id = control.cis_control_id;
    }

    if (control.reference_id) {
        oldControl.reference_id = control.reference_id;
    }

    if (control.identifier) {
        oldControl.identifier = control.identifier;
    }

    if (control.name) {
        oldControl.name = control.name;
    }

    if (control.impact) {
        oldControl.impact = control.impact;
    }

    if (control.priority) {
        oldControl.priority = control.priority;
    }

    if (control.description) {
        oldControl.description = control.description;
    }

    if (control.ai_description) {
        oldControl.ai_description = control.ai_description;
    }

    if (control.icon) {
        oldControl.icon = control.icon;
    }

    if (control.relation) {
        oldControl.relation = control.relation;
    }

    if (control?.status || control.status == 0) {
        oldControl.status = control?.status || 0;
    }

    if (control?.deletedAt) {
        oldControl.deletedAt = control?.deletedAt || null;
    }

    try {
        var savedControl = await oldControl.save()
        return savedControl;
    } catch (e) {
        console.log(e)
        throw Error(e.message);
    }
}

exports.softDeleteControl = async function (id) {
    try {
        var deleted = await Control.updateOne({ _id: id }, { $set: { deletedAt: new Date(), status: 0 } });
        return deleted;
    } catch (e) {
        throw Error(e.message)
    }
}

exports.getControlsByFrameworkIds = async function (query) {
    try {
        var controls = await Control.find(query)
            .populate({ path: 'framework_id', select: { '_id': 1, 'label': 1, 'value': 1 } })
            .populate({ path: 'cis_control_id' })

        return controls;
    } catch (e) {
        throw Error(e.message);
    }
}


exports.findControlByName = async function (name) {
    try {
        var control = await Control.findOne({ name: name });
        return control;
    } catch (e) {
        throw Error(e.message);
    }

}

exports.updateArrayField = async (documentId, newValues) => {
    try {
        // Initialize `cis_control_id` as an array if it doesn't exist or is null
        await Control.updateOne(
            { _id: documentId, $or: [{ cis_control_id: { $exists: false } }, { cis_control_id: null }] },
            { $set: { cis_control_id: [] } }
        );

        // Now safely apply $addToSet
        const result = await Control.updateOne(
            { _id: documentId },
            { $addToSet: { cis_control_id: { $each: newValues } } }
        );

        console.log("Update Result:", result);
        return result;
    } catch (error) {
        console.error("Error updating array field:", error);
        throw error;
    }
};