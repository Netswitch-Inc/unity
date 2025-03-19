var QuestionService = require("../services/question.service");
var QuestionAnswerService = require("../services/questionAnswer.service");
var SectionService = require("../services/section.service");

// Saving the context of this question inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getQuestions = async function (req, res, next) {
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
      query["$or"] = [
        { question: { $regex: ".*" + search + ".*", $options: "i" } },
        { option_type: { $regex: ".*" + search + ".*", $options: "i" } }
      ];
    }

    var count = await QuestionService.getQuestionsCount(query);
    var questions = await QuestionService.getQuestions(query, page, limit, sortColumn, sort)
    if (!questions || !questions.length) {
      if (Number(req.query?.page || 0) > 0) {
        page = 1;
        questions = await QuestionService.getQuestions(query, page, limit, sortColumn, sort)
      }
    }

    if (questions && questions.length) {
      pageIndex = page - 1;
      startIndex = pageIndex * limit + 1;
      endIndex = Math.min(startIndex - 1 + limit, count);
    }

    var pagination = {
      pages: Math.ceil(count / limit),
      total: count,
      pageIndex,
      startIndex,
      endIndex
    }

    // Return the Questions list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: questions,
      pagination,
      message: "Questions received successfully."
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.getQuestion = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var id = req.params.id;
  try {
    var question = await QuestionService.getQuestion(id);

    // Return the Question with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: question,
      message: "Question received successfully."
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.createQuestion = async function (req, res, next) {
  try {
    // Calling the Service function with the new object from the Request Body
    var createdQuestion = await QuestionService.createQuestion(req.body);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: createdQuestion,
      message: "Question created successfully."
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.updateQuestion = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body?._id) {
    return res.status(200).json({ status: 200, flag: false, message: "Id must be present." })
  }

  try {
    // Calling the Service function with the new object from the Request Body
    var updatedQuestion = await QuestionService.updateQuestion(req.body);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedQuestion,
      message: "Question updated successfully."
    })
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.removeQuestion = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res.status(200).json({ status: 200, flag: true, message: "Id must be present." });
  }

  try {
    var softDelete = false;
    var questionAns = await QuestionAnswerService.getQuestionAnswers({ question_id: id });
    if (questionAns?.length) {
      softDelete = true;
    }

    if (softDelete) {
      await QuestionService.updateQuestion({ _id: id, deletedAt: new Date() });
    } else {
      var deleted = await QuestionService.deleteQuestion(id);
    }

    return res.status(200).send({ status: 200, flag: true, message: "Successfully Deleted... " });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message })
  }
}

exports.updateOrderMultipleListing = async function (req, res, next) {
  try {
    const { bulkItems } = req.body;
    const { questionOrder } = req.body
    const { sectionOrder } = req.body

    // Check if updates array exists
    if (!bulkItems || !Array.isArray(bulkItems) || bulkItems.length === 0) {
      return res.status(200).json({ status: 200, flag: false, message: "No updates provided." });
    }
    // Create bulk operations for MongoDB
    const bulkOperations = bulkItems.map((item) => ({
      updateOne: {
        filter: { _id: item._id },
        update: { $set: { order: item.order } }
      }
    }));

    if (questionOrder) {
      const updateBulkItems = QuestionService.bulkWriteOperation(bulkOperations);
      return res.status(200).json({
        status: 200,
        flag: true,
        data: updateBulkItems,
        message: "Orders updated successfully."
      })
    }
    
    if (sectionOrder) {
      const updateBulkItems = SectionService.bulkWriteOperation(bulkOperations);
      return res.status(200).json({
        status: 200,
        flag: true,
        data: updateBulkItems,
        message: "Orders updated successfully."
      })
    }
  } catch (error) {
    // Handle errors
    console.error("Error updating orders:", error);
    return res.status(201).json({ status: 200, flag: false, message: error.message });
  }
}

exports.getQuestionFilter = async function (req, res, next) {
  try {
    const { assessment_id } = req.query;
    const query = { assessment_id: assessment_id };
    if (!assessment_id) {
      return res.status(200).json({
        status: 200,
        flag: false,
        message: "assessment id is required."
      })
    }

    const questions = await QuestionService.getGroupedQuestionsByAssessment(assessment_id)
    if (questions.length > 0) {
      return res.status(200).json({
        status: 200,
        flag: true,
        data: questions,
        message: "Questions received successfully!"
      })
    }

    return res.status(200).json({
      status: 200,
      flag: false,
      message: "Questions not found."
    });
  } catch (error) {
    return res.status(200).json({
      status: 200,
      flag: false,
      message: error.message
    })
  }
}

exports.getQuestionByAssessmentId = async function (req, res, next) {
  try {
    const { assessment_id, asessment_report_id } = req.query;
    if (!assessment_id || !asessment_report_id) {
      return res.status(200).json({
        status: 200,
        flag: false,
        message: "assessment id and assessment_report_id are required."
      });
    }

    const questionAsessmentId = await QuestionService.getSectionsWithQuestionsAndAnswers(assessment_id, asessment_report_id)
    return res.status(200).json({
      status: 200,
      flag: true,
      data: questionAsessmentId,
      message: "Questions received successfully."
    })
  } catch (error) {
    return res.status(200).json({
      status: 200,
      flag: false,
      message: error.message
    })
  }
}
