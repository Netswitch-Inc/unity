// Getting the Newly created Mongoose Model we just created 
var CompliancePriority = require("../models/CompliancePriority.model");

// Saving the context of this module inside the _the variable
_this = this;

exports.getCompliancePriorities = async function (query = {}, page = 1, limit = 0, sortField = "", sortType = "") {
    var skips = limit * (page - 1)
    var sorts = {};
    if (sortField) { sorts[sortField] = sortType; }

    // Try Catch the awaited promise to handle the error 
    try {
        var compliancePriorities = await CompliancePriority.find(query)
            .populate({ path: 'company_id' })
            .populate({ path: 'user_id' })
            .skip(skips)
            .limit(limit)
            .sort(sorts);

        return compliancePriorities;
    } catch (error) {
        throw Error(error.message);
    }
}

exports.getCompliancePriorityCount = async function (query) {
    try {
        var count = await CompliancePriority.find(query).count();

        return count;
    } catch (error) {
        throw Error(error.message);
    }
}

exports.getCompliancePriority = async function (id) {
    try {
        // Find the Data 
        var _details = await CompliancePriority.findOne({ _id: id })
            .populate({ path: 'company_id' })
            .populate({ path: 'user_id' });
        if (_details?._id) {
            return _details;
        } else {
            throw Error("Compliance Priority not available");
        }
    } catch (error) {
        // return a Error message describing the reason     
        throw Error(error.message);
    }
}

exports.getCompliancePriorityOne = async function (query = {}, sortField = "", sortType = "") {
    try {
        var sorts = {};
        if (sortField) { sorts[sortField] = sortType; }

        var compliancePriority = await CompliancePriority.findOne(query)
            .populate({ path: 'company_id' })
            .populate({ path: 'user_id' })
            .sort(sorts);

        return compliancePriority || null;
    } catch (error) {
        // return a Error message describing the reason     
        return null;
    }
}

exports.createCompliancePriority = async function (compliancePriority) {
    var newCompliancePriority = new CompliancePriority({
        company_id: compliancePriority.company_id ? compliancePriority.company_id : null,
        user_id: compliancePriority.user_id ? compliancePriority.user_id : null,
        name: compliancePriority.name ? compliancePriority.name : "",
        description: compliancePriority.description ? compliancePriority.description : "",
        status: compliancePriority.status ? compliancePriority.status : false,
        deletedAt: null
    })

    try {
        // Saving the CompliancePriority 
        var savedCompliancePriority = await newCompliancePriority.save();
        return savedCompliancePriority;
    } catch (error) {
        // return a Error message describing the reason     
        throw Error(error.message);
    }
}

exports.updateCompliancePriority = async function (compliancePriority) {
    var id = compliancePriority._id;
    try {
        // Find the old CompliancePriority Object by the Id
        var oldCompliancePriority = await CompliancePriority.findById(id);
    } catch (e) {
        throw Error("Compliance Priority not found.");
    }

    if (!oldCompliancePriority) { return false; }

    if (compliancePriority.company_id) {
        oldCompliancePriority.company_id = compliancePriority.company_id;
    }

    if (compliancePriority.user_id) {
        oldCompliancePriority.user_id = compliancePriority.user_id;
    }

    if (compliancePriority.name) {
        oldCompliancePriority.name = compliancePriority.name;
    }

    if (compliancePriority?.description || compliancePriority.description == "") {
        oldCompliancePriority.description = compliancePriority.description;
    }

    if (compliancePriority?.status || compliancePriority.status == false) {
        oldCompliancePriority.status = compliancePriority.status;
    }

    if (compliancePriority.deletedAt) {
        oldCompliancePriority.deletedAt = compliancePriority.deletedAt;
    }

    try {
        var savedCompliancePriority = await oldCompliancePriority.save()
        return savedCompliancePriority;
    } catch (error) {
        throw Error(error.message);
    }
}

exports.deleteCompliancePriority = async function (id) {
    // Delete the Permission
    try {
        var deleted = await CompliancePriority.remove({ _id: id });
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Compliance Priority could not be deleted.");
        }

        return deleted;
    } catch (error) {
        throw Error("Error Occured while Deleting the Compliance Priority");
    }
}

exports.softDeleteCompliancePriority = async function (id) {
    try {
        var deleted = await CompliancePriority.updateOne({ _id: id }, {
            $set: { deletedAt: new Date() }
        })

        return deleted;
    } catch (e) {
        throw Error(e.message)
    }
}

exports.deleteCompliancePriorityOne = async function (query) {
    // Delete the Permission
    try {
        var deleted = await CompliancePriority.remove(query);
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("CompliancePriority could not be deleted");
        }

        return deleted;
    } catch (error) {
        throw Error("Error Occured while Deleting the Compliance Priority");
    }
}
