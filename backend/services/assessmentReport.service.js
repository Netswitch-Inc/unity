var AssessmentReport = require("../models/AssessmentReport.model");

// Saving the context of this module inside the _the variable
_this = this;

// Async function to get the AssessmentReport List
exports.getAssessmentReports = async function (
    query = {},
    page = 1,
    limit = 0,
    sortField = "",
    sortType = ""
) {
    try {
        var skips = limit * (page - 1);
        var sorts = {};
        if (sortField) {
            sorts[sortField] = sortType;
        }

        // Try Catch the awaited promise to handle the error
        var assessmentReports = await AssessmentReport.find(query)
            .sort(sorts)
            .skip(skips)
            .limit(limit);

        return assessmentReports;
    } catch (e) {
        throw Error("Error occurred while finding Assessment Reports");
    }
};

exports.getAssessmentReportsCount = async function (query) {
    try {
        var count = await AssessmentReport.find(query).count();

        return count;
    } catch (e) {
        throw Error("Error while Counting Assessment Reports");
    }
};

exports.getAssessmentReportsDistinct = async function (field, query) {
    try {
        var assessmentReports = await AssessmentReport.distinct(field, query);

        return assessmentReports;
    } catch (e) {
        // console.log("Error ", e);
        // return a Error message describing the reason
        throw Error("Error while Distinct Assessment Reports");
    }
};

exports.getAssessmentReport = async function (id) {
    try {
        // Find the Data
        var _details = await AssessmentReport.findOne({ _id: id });
        if (_details._id) {
            return _details;
        } else {
            throw Error("Assessment Report not available");
        }
    } catch (e) {
        // return a Error message describing the reason
        throw Error(e.message);
    }
};

exports.getAssessmentReportOne = async function (id) {
    try {
        // Find the Data
        var assessmentReport = await AssessmentReport.findOne({ _id: id });

        return assessmentReport || null;
    } catch (e) {
        // return a Error message describing the reason
        return null;
    }
};

exports.createAssessmentReport = async function (assessmentReport) {
    var newAssessmentReport = new AssessmentReport({
        assessment_id: assessmentReport.assessment_id ? assessmentReport.assessment_id : null,
        assessment_data: assessmentReport.assessment_data ? assessmentReport.assessment_data : null,
        group_data: assessmentReport.group_data ? assessmentReport.group_data : null,
        name: assessmentReport.name ? assessmentReport.name : "",
        first_name: assessmentReport.first_name ? assessmentReport.first_name : "",
        last_name: assessmentReport.last_name ? assessmentReport.last_name : "",
        company_name: assessmentReport.company_name ? assessmentReport.company_name : "",
        email: assessmentReport.email ? assessmentReport.email : "",
        mobile: assessmentReport.mobile ? assessmentReport.mobile : "",
        email_code: assessmentReport.email_code ? assessmentReport.email_code : "",
        mobile_code: assessmentReport.mobile_code ? assessmentReport.mobile_code : "",
        business_type: assessmentReport.business_type ? assessmentReport.business_type : "",
        team_size: assessmentReport.team_size ? assessmentReport.team_size : 0,
        operation_description: assessmentReport.operation_description ? assessmentReport.operation_description : "",
        address1: assessmentReport.address1 ? assessmentReport.address1 : "",
        address2: assessmentReport.address2 ? assessmentReport.address2 : "",
        city: assessmentReport.city ? assessmentReport.city : "",
        state: assessmentReport.state ? assessmentReport.state : "",
        country: assessmentReport.country ? assessmentReport.country : "",
        zipcode: assessmentReport.zipcode ? assessmentReport.zipcode : "",
        total: assessmentReport.total ? assessmentReport.total : 0,
        pass: assessmentReport.pass ? assessmentReport.pass : 0,
        fail: assessmentReport.fail ? assessmentReport.fail : 0,
        invalid: assessmentReport.invalid ? assessmentReport.invalid : 0,
        pdf_path: assessmentReport.pdf_path ? assessmentReport.pdf_path : "",
        score: assessmentReport.score ? assessmentReport.score : 0,
        email_verified: assessmentReport.email_verified ? assessmentReport.email_verified : false,
        mobile_verified: assessmentReport.mobile_verified ? assessmentReport.mobile_verified : false,
        status: assessmentReport.status ? assessmentReport.status : 1,
        deletedAt: null,
    });

    try {
        // Saving the AssessmentReport
        var savedAssessmentReport = await newAssessmentReport.save();
        return savedAssessmentReport;
    } catch (e) {
        // return an Error message describing the reason
        throw Error("Error occurred while creating Assessment Report");
    }
};

exports.updateAssessmentReport = async function (assessmentReport) {
    console.log(assessmentReport, "assessmentReport");
    var id = assessmentReport._id;
    try {
        // Find the old AssessmentReport Object by the Id
        var oldAssessmentReport = await AssessmentReport.findById(id);
    } catch (e) {
        throw Error("Assessment Report not found");
    }

    // If no old AssessmentReport Object exists return false
    if (!oldAssessmentReport) return false;

    // Edit the AssessmentReport Object
    if (assessmentReport.assessment_id) {
        oldAssessmentReport.assessment_id = assessmentReport.assessment_id;
    }

    if (assessmentReport.assessment_data) {
        oldAssessmentReport.assessment_data = assessmentReport.assessment_data;
    }

    if (assessmentReport.group_data?.length) {
        oldAssessmentReport.group_data = assessmentReport.group_data;
    }

    if (assessmentReport.name) {
        oldAssessmentReport.name = assessmentReport.name;
    }
    
    if (assessmentReport.first_name) {
        oldAssessmentReport.first_name = assessmentReport.first_name;
    }
    
    if (assessmentReport.last_name) {
        oldAssessmentReport.last_name = assessmentReport.last_name;
    }

    if (assessmentReport.company_name) {
        oldAssessmentReport.company_name = assessmentReport.company_name;
    }

    if (assessmentReport.email) {
        oldAssessmentReport.email = assessmentReport.email;
    }

    if (assessmentReport.mobile) {
        oldAssessmentReport.mobile = assessmentReport.mobile;
    }

    if (assessmentReport.email_code) {
        oldAssessmentReport.email_code = assessmentReport.email_code;
    }

    if (assessmentReport.mobile_code) {
        oldAssessmentReport.mobile_code = assessmentReport.mobile_code;
    }

    if (assessmentReport.business_type) {
        oldAssessmentReport.business_type = assessmentReport.business_type;
    }

    if (assessmentReport?.team_size || assessmentReport.team_size == 0) {
        oldAssessmentReport.team_size = assessmentReport?.team_size || 0;
    }

    if (assessmentReport.operation_description) {
        oldAssessmentReport.operation_description = assessmentReport.operation_description;
    }

    if (assessmentReport.address1) {
        oldAssessmentReport.address1 = assessmentReport.address1;
    }

    if (assessmentReport.address2) {
        oldAssessmentReport.address2 = assessmentReport.address2;
    }

    if (assessmentReport.city) {
        oldAssessmentReport.city = assessmentReport.city;
    }

    if (assessmentReport.state) {
        oldAssessmentReport.state = assessmentReport.state;
    }

    if (assessmentReport.country) {
        oldAssessmentReport.country = assessmentReport.country;
    }

    if (assessmentReport.zipcode) {
        oldAssessmentReport.zipcode = assessmentReport.zipcode;
    }

    if (assessmentReport?.total || assessmentReport.total == 0) {
        oldAssessmentReport.total = assessmentReport?.total || 0;
    }

    if (assessmentReport?.pass || assessmentReport.pass == 0) {
        oldAssessmentReport.pass = assessmentReport?.pass || 0;
    }

    if (assessmentReport?.fail || assessmentReport.fail == 0) {
        oldAssessmentReport.fail = assessmentReport?.fail || 0;
    }

    if (assessmentReport?.invalid || assessmentReport.invalid == 0) {
        oldAssessmentReport.invalid = assessmentReport?.invalid || 0;
    }

    if (assessmentReport?.score || assessmentReport.score == 0) {
        oldAssessmentReport.score = assessmentReport?.score || 0;
    }

    if (assessmentReport?.email_verified || assessmentReport.email_verified == false) {
        oldAssessmentReport.email_verified = assessmentReport?.email_verified || false;
    }

    if (assessmentReport?.mobile_verified || assessmentReport.mobile_verified == false) {
        oldAssessmentReport.mobile_verified = assessmentReport?.mobile_verified || false;
    }

    if (assessmentReport?.status || assessmentReport.status == 0) {
        oldAssessmentReport.status = assessmentReport?.status || 0;
    }

    if (assessmentReport?.deletedAt) {
        oldAssessmentReport.deletedAt = assessmentReport.deletedAt;
    }
    
    if (assessmentReport?.pdf_path) {
        oldAssessmentReport.pdf_path = assessmentReport.pdf_path;
    }

    try {
        var savedAssessmentReport = await oldAssessmentReport.save();
        return savedAssessmentReport;
    } catch (e) {
        throw Error("Error occurred while updating the Assessment Report");
    }
};

exports.deleteAssessmentReport = async function (id) {
    // Delete the AssessmentReport
    try {
        var deleted = await AssessmentReport.remove({ _id: id });
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Assessment Report Could not be deleted");
        }

        return deleted;
    } catch (e) {
        throw Error("Error occurred while Deleting the Assessment Report");
    }
};

exports.getDataOfReport = async function (query) {
    try {
        const assessmentReport = await AssessmentReport.findOne(query);
        if (assessmentReport) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        throw Error(error.message);
    }
};
