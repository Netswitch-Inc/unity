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
                populate: { path: "framework_id cis_control_id" }
            })
            .populate({ path: 'project_id' })
            .skip(skips)
            .limit(limit)
            .sort(sorts);

        return companyComplianceControls;
    } catch (error) {
        throw Error(error.message);
    }
}

exports.getCompanyComplianceControlCount = async function (query) {
    try {
        var count = await CompanyComplianceControl.find(query).count();

        return count;
    } catch (error) {
        throw Error(error.message);
    }
}

exports.getCompanyComplianceControl = async function (id) {
    try {
        // Find the Data 
        var _details = await CompanyComplianceControl.findOne({ _id: id })
            .populate({ path: 'framework_id' })
            .populate({
                path: 'control_id',
                populate: { path: "framework_id cis_control_id" }
            })
            .populate({ path: 'project_id' });
        if (_details?._id) {
            return _details;
        } else {
            throw Error("CompanyComplianceControl not available");
        }
    } catch (error) {
        // return a Error message describing the reason     
        throw Error(error.message);
    }
}

exports.createManyCompanyComplianceControl = async function (controls) {
    try {
        if (controls?.length && Array.isArray(controls)) {
            controls = controls.map((item) => {
                item.company_id = item.company_id ? item.company_id : null
                item.compliance_priority_id = item.compliance_priority_id ? item.compliance_priority_id : null
                item.framework_id = item.framework_id ? item.framework_id : null
                item.control_id = item.control_id ? item.control_id : null
                item.project_id = item.project_id ? item.project_id : null
                item.tool_icons = item.tool_icons ? item.tool_icons : ""
                item.control_description = item.control_description ? item.control_description : ""
                item.cis_control_descriptions = item.cis_control_descriptions?.length ? item.cis_control_descriptions : null

                item.status = true
                item.deletedAt = null
                return item;
            })
        }

        var companyComplianceControls = await CompanyComplianceControl.insertMany(controls)

        return companyComplianceControls;
    } catch (error) {
        // return a Error message describing the reason     
        throw Error(error.message);
    }
}

exports.createCompanyComplianceControl = async function (companyComplianceControl) {
    var newCompanyComplianceControl = new CompanyComplianceControl({
        company_id: companyComplianceControl.company_id ? companyComplianceControl.company_id : null,
        compliance_priority_id: companyComplianceControl.compliance_priority_id ? companyComplianceControl.compliance_priority_id : null,
        framework_id: companyComplianceControl.framework_id ? companyComplianceControl.framework_id : null,
        control_id: companyComplianceControl.control_id ? companyComplianceControl.control_id : null,
        project_id: companyComplianceControl.project_id ? companyComplianceControl.project_id : null,
        tool_icons: companyComplianceControl.tool_icons ? companyComplianceControl.tool_icons : "",
        control_description: companyComplianceControl.control_description ? companyComplianceControl.control_description : "",
        cis_control_descriptions: companyComplianceControl.cis_control_descriptions?.length ? companyComplianceControl.cis_control_descriptions : null,
        status: true,
        builder_status: "",
        deletedAt: null
    })

    try {
        // Saving the CompanyComplianceControl 
        var savedCompanyComplianceControl = await newCompanyComplianceControl.save();
        return savedCompanyComplianceControl;
    } catch (error) {
        // return a Error message describing the reason     
        throw Error(error.message);
    }
}

exports.updateCompanyComplianceControl = async function (companyComplianceControl) {
    var id = companyComplianceControl._id;
    try {
        // Find the old CompanyComplianceControl Object by the Id
        var oldCompanyComplianceControl = await CompanyComplianceControl.findById(id);
    } catch (error) {
        throw Error("Compliance Control not found");
    }

    if (!oldCompanyComplianceControl) { return false; }

    if (companyComplianceControl.company_id) {
        oldCompanyComplianceControl.company_id = companyComplianceControl.company_id;
    }

    if (companyComplianceControl.compliance_priority_id) {
        oldCompanyComplianceControl.compliance_priority_id = companyComplianceControl.compliance_priority_id;
    }

    if (companyComplianceControl.framework_id) {
        oldCompanyComplianceControl.framework_id = companyComplianceControl.framework_id;
    }

    if (companyComplianceControl.control_id) {
        oldCompanyComplianceControl.control_id = companyComplianceControl.control_id;
    }

    if (companyComplianceControl.project_id) {
        oldCompanyComplianceControl.project_id = companyComplianceControl.project_id;
    }

    if (companyComplianceControl.tool_icons) {
        oldCompanyComplianceControl.tool_icons = companyComplianceControl.tool_icons;
    }

    if (companyComplianceControl.control_description) {
        oldCompanyComplianceControl.control_description = companyComplianceControl.control_description;
    }

    if (companyComplianceControl?.cis_control_descriptions) {
        oldCompanyComplianceControl.cis_control_descriptions = companyComplianceControl.cis_control_descriptions?.length ? companyComplianceControl.cis_control_descriptions : null;
    }

    if (companyComplianceControl?.builder_status || companyComplianceControl.builder_status == "") {
        oldCompanyComplianceControl.builder_status = companyComplianceControl.builder_status;
    }

    try {
        var savedCompanyComplianceControl = await oldCompanyComplianceControl.save();
        return savedCompanyComplianceControl;
    } catch (error) {
        throw Error(error.message);
    }
}

exports.updateManyCompanyComplianceControl = async function (query, payload) {
    try {
        var companyComplianceControls = await CompanyComplianceControl.updateMany(query, payload);
        return companyComplianceControls;
    } catch (error) {
        console.log("updateManyCompanyComplianceControl catch >>> ", error);
        throw Error("Getting error while multiple updating the company compliance control");
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
    } catch (error) {
        throw Error("Error Occured while Deleting the CompanyComplianceControl");
    }
}

exports.getCompanyComplianceControlsDistinct = async function (field, query) {
    try {
        var companyComplianceControls = await CompanyComplianceControl.distinct(field, query);

        return companyComplianceControls;
    } catch (error) {
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
    } catch (error) {
        throw Error("Error Occured while Deleting the CompanyComplianceControl");
    }
}

exports.getCompanyComplianceControlsByFrameworkIds = async function (query) {
    try {
        var companyComplianceControles = await CompanyComplianceControl.find(query)
            .populate({ path: 'framework_id' })
            .populate({ path: 'control_id' });

        return companyComplianceControles;
    } catch (error) {
        throw Error(e.message);
    }
}
