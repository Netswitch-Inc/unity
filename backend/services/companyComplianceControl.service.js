// Getting the Newly created Mongoose Model we just created 
var CompanyComplianceControl = require("../models/CompanyComplianceControl.model");

// Saving the context of this module inside the _the variable
_this = this;

exports.getCompanyComplianceControls = async function (query = {}, page = 1, limit = 0, sortField = "", sortType = "") {
    var skips = limit * (page - 1)
    var sorts = {};
    if (sortField) { sorts[sortField] = sortType; }

    // Try Catch the awaited promise to handle the error 
    try {
        var companyComplianceControls = await CompanyComplianceControl.find(query)
            .populate({ path: 'framework_id' })
            .populate({
                path: 'control_id',
                populate: {
                    path: "framework_id cis_control_id"
                }
            })
            .skip(skips)
            .limit(limit)
            .sort(sorts);

        return companyComplianceControls;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getCompanyComplianceControlCount = async function (query) {
    try {
        var count = await CompanyComplianceControl.find(query).count();

        return count;
    } catch (e) {
        throw Error(e.message);
    }
}

exports.getCompanyComplianceControl = async function (id) {
    try {
        // Find the Data 
        var _details = await CompanyComplianceControl.findOne({ _id: id })
            .populate({ path: 'framework_id' })
            .populate({ path: 'control_id' });
        if (_details?._id) {
            return _details;
        } else {
            throw Error("CompanyComplianceControl not available");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.message);
    }
}

exports.createCompanyComplianceControl = async function (companyComplianceControl) {
    var newCompanyComplianceControl = new CompanyComplianceControl({
        company_id: companyComplianceControl.company_id ? companyComplianceControl.company_id : null,
        framework_id: companyComplianceControl.framework_id ? companyComplianceControl.framework_id : null,
        control_id: companyComplianceControl.control_id ? companyComplianceControl.control_id : null
    })

    try {
        // Saving the CompanyComplianceControl 
        var savedCompanyComplianceControl = await newCompanyComplianceControl.save();
        return savedCompanyComplianceControl;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error(e.message);
    }
}

exports.updateCompanyComplianceControl = async function (companyComplianceControl) {
    var id = companyComplianceControl._id;
    try {
        // Find the old CompanyComplianceControl Object by the Id
        var oldCompanyComplianceControl = await CompanyComplianceControl.findById(id);
    } catch (e) {
        throw Error("Compliance Control not found");
    }

    if (!oldCompanyComplianceControl) { return false; }

    if (companyComplianceControl.company_id) {
        oldCompanyComplianceControl.company_id = companyComplianceControl.company_id;
    }

    if (companyComplianceControl.framework_id) {
        oldCompanyComplianceControl.framework_id = companyComplianceControl.framework_id;
    }

    if (companyComplianceControl.control_id) {
        oldCompanyComplianceControl.control_id = companyComplianceControl.control_id;
    }

    try {
        var savedCompanyComplianceControl = await oldCompanyComplianceControl.save()
        return savedCompanyComplianceControl;
    } catch (e) {
        // console.log(e);
        throw Error(e.message);
    }
}

exports.deleteCompanyComplianceControl = async function (id) {
    // Delete the Permission
    try {
        var deleted = await CompanyComplianceControl.remove({ _id: id });
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("CompanyComplianceControl Could not be deleted");
        }

        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the CompanyComplianceControl");
    }
}

exports.getCompanyComplianceControlsDistinct = async function (field, query) {
    try {
        var companyComplianceControls = await CompanyComplianceControl.distinct(field, query);

        return companyComplianceControls;
    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while distinct CompanyComplianceControl');
    }
}

exports.deleteCompanyComplianceControlOne = async function (query) {
    // Delete the Permission
    try {
        var deleted = await CompanyComplianceControl.remove(query);
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("CompanyComplianceControl Could not be deleted");
        }

        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the CompanyComplianceControl");
    }
}

exports.getCompanyComplianceControlsByFrameworkIds = async function (query) {
    try {
        var companyComplianceControles = await CompanyComplianceControl.find(query)
            .populate({ path: 'framework_id' })
            .populate({ path: 'control_id' });

        return companyComplianceControles;
    } catch (e) {
        throw Error(e.message);
    }
}
