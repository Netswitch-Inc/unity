var QuestionAnswerService = require('../services/questionAnswer.service');

// Saving the context of this questionAnswer inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getQuestionAnswers = async function (req, res, next) {
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
                { value: { $regex: '.*' + search + '.*', $options: 'i' } }
            ];
        }

        var count = await QuestionAnswerService.getQuestionAnswersCount(query);
        var questionAnswers = await QuestionAnswerService.getQuestionAnswers(query, page, limit, sortColumn, sort);
        if (!questionAnswers || !questionAnswers.length) {
            if (Number(req.query?.page || 0) > 0) {
                page = 1;
                questionAnswers = await QuestionAnswerService.getQuestionAnswers(query, page, limit, sortColumn, sort);
            }
        }

        if (questionAnswers && questionAnswers.length) {
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

        // Return the QuestionAnswers list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: questionAnswers, pagination, message: "Question Answers received successfully!" });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getQuestionAnswer = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var questionAnswer = await QuestionAnswerService.getQuestionAnswer(id);

        // Return the QuestionAnswer with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: questionAnswer, message: "Question Answer received successfully!" });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.createQuestionAnswer = async function (req, res, next) {
    try {
        // Calling the Service function with the new object from the Request Body
        var createdQuestionAnswer = await QuestionAnswerService.createQuestionAnswer(req.body);

        return res.status(200).json({ status: 200, flag: true, data: createdQuestionAnswer, message: "Question Answer created successfully!" })
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.updateQuestionAnswer = async function (req, res, next) {
    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present!" })
    }

    try {
        // Calling the Service function with the new object from the Request Body
        var updatedQuestionAnswer = await QuestionAnswerService.updateQuestionAnswer(req.body);

        return res.status(200).json({ status: 200, flag: true, data: updatedQuestionAnswer, message: "Question Answer updated successfully!" });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.removeQuestionAnswer = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present!" })
    }
    try {
        var deleted = await QuestionAnswerService.deleteQuestionAnswer(id);

        return res.status(200).send({ status: 200, flag: true, message: "Successfully Deleted... " });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}
