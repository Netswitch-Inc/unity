var QuestionAnswer = require("../models/QuestionAnswer.model");

// Saving the context of this module inside the _the variable
_this = this;

// Async function to get the QuestionAnswer List
exports.getQuestionAnswers = async function (
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
    var questionAnswers = await QuestionAnswer.find(query)
      .populate({ path: "section_id", select: "name" })
      .populate({ path: "question_id", select: "question" })
      .sort(sorts)
      .skip(skips)
      .limit(limit);

    return questionAnswers;
  } catch (e) {
    throw Error("Error occurred while finding QuestionAnswers");
  }
};

exports.getQuestionAnswersCount = async function (query) {
  try {
    var count = await QuestionAnswer.find(query).count();

    return count;
  } catch (e) {
    throw Error("Error while Counting QuestionAnswers");
  }
};

exports.getQuestionAnswersDistinct = async function (field, query) {
  try {
    var questionAnswers = await QuestionAnswer.distinct(field, query);

    return questionAnswers;
  } catch (e) {
    // console.log("Error ", e);
    // return a Error message describing the reason
    throw Error("Error while Distinct QuestionAnswers");
  }
};

exports.getQuestionAnswer = async function (id) {
  try {
    // Find the Data
    var _details = await QuestionAnswer.findOne({ _id: id })
      .populate({ path: "section_id", select: "name" })
      .populate({ path: "question_id", select: "question" });
    if (_details._id) {
      return _details;
    } else {
      throw Error("QuestionAnswer not available");
    }
  } catch (e) {
    // return a Error message describing the reason
    throw Error("QuestionAnswer not available");
  }
};

exports.getQuestionAnswerOne = async function (id) {
  try {
    // Find the Data
    var questionAnswer = await QuestionAnswer.findOne({ _id: id })
      .populate({ path: "section_id", select: "name" })
      .populate({ path: "question_id", select: "question" });

    return questionAnswer || null;
  } catch (e) {
    // return a Error message describing the reason
    return null;
  }
};

exports.createQuestionAnswer = async function (questionAnswer) {
  var newQuestionAnswer = new QuestionAnswer({
    company_id: questionAnswer.company_id ? questionAnswer.company_id : null,
    user_id: questionAnswer.user_id ? questionAnswer.user_id : null,
    section_id: questionAnswer.section_id ? questionAnswer.section_id : null,
    question_id: questionAnswer.question_id ? questionAnswer.question_id : null,
    parent_question_id: questionAnswer.parent_question_id
      ? questionAnswer.parent_question_id
      : null,
    question_data: questionAnswer.question_data
      ? questionAnswer.question_data
      : null,
    asessment_report_id: questionAnswer.asessment_report_id
      ? questionAnswer.asessment_report_id
      : null,
    value: questionAnswer.value ? questionAnswer.value : "",
    status: questionAnswer.status ? questionAnswer.status : 1,
    deletedAt: null,
  });

  try {
    // Saving the QuestionAnswer
    var savedQuestionAnswer = await newQuestionAnswer.save();
    return savedQuestionAnswer;
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Error occurred while creating QuestionAnswer");
  }
};

exports.updateQuestionAnswer = async function (questionAnswer) {
  var id = questionAnswer._id;
  try {
    // Find the old QuestionAnswer Object by the Id
    var oldQuestionAnswer = await QuestionAnswer.findById(id);
  } catch (e) {
    throw Error("QuestionAnswer not found");
  }

  // If no old QuestionAnswer Object exists return false
  if (!oldQuestionAnswer) {
    return false;
  }

  // Edit the QuestionAnswer Object
  if (questionAnswer.company_id) {
    oldQuestionAnswer.company_id = questionAnswer.company_id;
  }

  if (questionAnswer.user_id) {
    oldQuestionAnswer.user_id = questionAnswer.user_id;
  }

  if (questionAnswer.section_id) {
    oldQuestionAnswer.section_id = questionAnswer.section_id;
  }

  if (questionAnswer.question_id) {
    oldQuestionAnswer.question_id = questionAnswer.question_id;
  }

  if (questionAnswer.question_data) {
    oldQuestionAnswer.question_data = questionAnswer.question_data;
  }

  if (questionAnswer.value || questionAnswer.value === "") {
    oldQuestionAnswer.value = questionAnswer.value;
  }

  if (questionAnswer?.status || questionAnswer.status == 0) {
    oldQuestionAnswer.status = questionAnswer?.status || 0;
  }

  if (questionAnswer?.deletedAt) {
    oldQuestionAnswer.deletedAt = questionAnswer.deletedAt;
  }
  if (questionAnswer?.asessment_report_id) {
    oldQuestionAnswer.asessment_report_id = questionAnswer.asessment_report_id;
  }
  if (questionAnswer?.parent_question_id) {
    oldQuestionAnswer.parent_question_id = questionAnswer.parent_question_id;
  }

  try {
    var savedQuestionAnswer = await oldQuestionAnswer.save();
    return savedQuestionAnswer;
  } catch (e) {
    throw Error("Error occurred while updating the QuestionAnswer");
  }
};

exports.deleteQuestionAnswer = async function (id) {
  // Delete the QuestionAnswer
  try {
    var deleted = await QuestionAnswer.remove({ _id: id });
    if (deleted.n === 0 && deleted.ok === 1) {
      throw Error("QuestionAnswer Could not be deleted");
    }
    return deleted;
  } catch (e) {
    throw Error("Error occurred while Deleting the QuestionAnswer");
  }
};
