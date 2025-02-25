var AssessmentService = require('../services/assessment.service');
var SectionService = require('../services/section.service');
var QuestionService = require('../services/question.service');
var QuestionAnswerService = require('../services/questionAnswer.service');

// Saving the context of this assessment inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getAssessments = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    try {
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
            query['$or'] = [
                { name: { $regex: '.*' + search + '.*', $options: 'i' } },
                { description: { $regex: '.*' + search + '.*', $options: 'i' } }
            ];
        }

        var count = await AssessmentService.getAssessmentsCount(query);
        var assessments = await AssessmentService.getAssessments(query, page, limit, sortColumn, sort);
        if (!assessments || !assessments.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                assessments = await AssessmentService.getAssessments(query, page, limit, sortColumn, sort);
            }
        }

        if (assessments && assessments.length) {
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

        // Return the Assessments list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: assessments, pagination, message: "Assessments received successfully!" });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getAssessment = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var assessment = await AssessmentService.getAssessment(id);

        // Return the Assessment with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: assessment, message: "Assessment received successfully!" });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.createAssessment = async function (req, res, next) {
    try {
        // Calling the Service function with the new object from the Request Body
        var createdAssessment = await AssessmentService.createAssessment(req.body);

        return res.status(200).json({ status: 200, flag: true, data: createdAssessment, message: "Assessment created successfully!" })
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.updateAssessment = async function (req, res, next) {
    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present!" })
    }

    try {
        // Calling the Service function with the new object from the Request Body
        var updatedAssessment = await AssessmentService.updateAssessment(req.body);

        return res.status(200).json({ status: 200, flag: true, data: updatedAssessment, message: "Assessment updated successfully!" });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.removeAssessment = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present!" })
    }

    try {
        var softDelete = false;
        var sections = await SectionService.getSections({ assessment_id: id });
        if (sections?.length) {
            softDelete = true;
        } else if (!softDelete) {
            var questions = await QuestionService.getQuestions({ assessment_id: id });
            if (questions?.length) { softDelete = true; }
        } else if (!softDelete) {
            var questionAns = await QuestionAnswerService.getQuestionAnswers({ assessment_id: id });
            if (questionAns?.length) { softDelete = true; }
        }

        if (softDelete) {
            await AssessmentService.updateAssessment({ _id: id, deletedAt: new Date() });
        } else {
            var deleted = await AssessmentService.deleteAssessment(id);
        }

        return res.status(200).send({ status: 200, flag: true, message: "Successfully Deleted... " });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}
