const mongoose = require("mongoose");

var Question = require("../models/Question.model");
const Section = require("../models/Section.model");

// Saving the context of this module inside the _the variable
_this = this;

// Async function to get the Question List
exports.getQuestions = async function (query = {}, page = 1, limit = 0, sortField = "", sortType = "") {
  try {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) {
      sorts[sortField] = sortType;
    }

    // Try Catch the awaited promise to handle the error
    var questions = await Question.find(query)
      .populate({ path: "section_id", select: "name" })
      .sort(sorts)
      .skip(skips)
      .limit(limit);

    return questions;
  } catch (error) {
    throw Error("Error occurred while finding Questions");
  }
}

exports.getQuestionsCount = async function (query) {
  try {
    var count = await Question.find(query).count();

    return count;
  } catch (error) {
    throw Error("Error while Counting Questions");
  }
}

exports.getQuestionsDistinct = async function (field, query) {
  try {
    var questions = await Question.distinct(field, query);

    return questions;
  } catch (error) {
    // console.log("Error ", e);
    // return a Error message describing the reason
    throw Error("Error while Distinct Questions");
  }
}

exports.getQuestion = async function (id) {
  try {
    // Find the Data
    var _details = await Question.findOne({ _id: id })
      .populate({ path: "section_id", select: "name" })
    if (_details._id) {
      return _details;
    } else {
      throw Error("Question not available");
    }
  } catch (error) {
    // return a Error message describing the reason
    throw Error("Question not available")
  }
}

exports.getQuestionOne = async function (id) {
  try {
    // Find the Data
    var question = await Question.findOne({ _id: id })
      .populate({ path: "section_id", select: "name" })

    return question || null;
  } catch (error) {
    // return a Error message describing the reason
    return null
  }
}

exports.createQuestion = async function (question) {
  var newQuestion = new Question({
    assessment_id: question.assessment_id ? question.assessment_id : null,
    section_id: question.section_id ? question.section_id : null,
    parent_question_id: question.parent_question_id ? question.parent_question_id : null,
    question: question.question ? question.question : "",
    description: question?.description ? question?.description : "",
    option_type: question.option_type ? question.option_type : "",
    options: question.options ? question.options : null,
    value: question.value ? question.value : "",
    is_mandatory: question.is_mandatory ? question.is_mandatory : false,
    point: question.point ? question.point : 0,
    order: question.order ? question.order : 0,
    status: question.status ? question.status : 0,
    is_child: question.is_child ? question.is_child : false,
    deletedAt: null
  });

  try {
    // Saving the Question
    var savedQuestion = await newQuestion.save();
    return savedQuestion;
  } catch (error) {
    // return a Error message describing the reason
    throw Error("Error occurred while creating Question");
  }
}

exports.updateQuestion = async function (question) {
  var id = question._id;
  try {
    // Find the old Question Object by the Id
    var oldQuestion = await Question.findById(id);
  } catch (error) {
    throw Error("Question not found");
  }

  // If no old Question Object exists return false
  if (!oldQuestion) { return false; }

  // Edit the Question Object
  if (question.assessment_id) {
    oldQuestion.assessment_id = question.assessment_id;
  }

  if (question.section_id) {
    oldQuestion.section_id = question.section_id;
  }

  if (question.question) {
    oldQuestion.question = question.question;
  }

  if (question?.description || question.description == "") {
    oldQuestion.description = question?.description || "";
  }

  if (question.option_type) {
    oldQuestion.option_type = question.option_type;
  }

  if (question?.options) {
    oldQuestion.options = question.options?.length ? question.options : null;
  }

  if (question.value) {
    oldQuestion.value = question.value;
  }

  if (question?.is_mandatory || question.is_mandatory == false) {
    oldQuestion.is_mandatory = question?.is_mandatory || false;
  }

  if (question?.point || question.point == 0) {
    oldQuestion.point = question?.point || 0;
  }

  if (question?.order || question.order == 0) {
    oldQuestion.order = question?.order || 0;
  }

  if (question?.status || question.status == 0) {
    oldQuestion.status = question?.status || 0;
  }

  if (question?.deletedAt) {
    oldQuestion.deletedAt = question.deletedAt;
  }

  try {
    var savedQuestion = await oldQuestion.save();
    return savedQuestion;
  } catch (error) {
    throw Error("Error occurred while updating the Question");
  }
}

exports.deleteQuestion = async function (id) {
  // Delete the Question
  try {
    var deleted = await Question.remove({ _id: id });
    if (deleted.n === 0 && deleted.ok === 1) {
      throw Error("Question Could not be deleted");
    }

    return deleted;
  } catch (error) {
    throw Error("Error occurred while Deleting the Question");
  }
}

exports.bulkWriteOperation = async function (operations) {
  try {
    const result = await Question.bulkWrite(operations);
    return result;
  } catch (error) {
    throw Error(error?.message);
  }
}

exports.questionFilter = async function (query) {
  try {
    const questions = await Question.find(query)
      .populate({ path: "section_id", select: "name" })
      
    return questions || null;
  } catch (error) {
    console.error("questionFilter catch >>>> ", error)
    throw Error(`questionFilter catch >>>> ${error.message}`);
  }
}

exports.getGroupedQuestionsByAssessment = async function (assessmentId) {
  try {
    const sections = await Section.aggregate([{
      $match: {
        assessment_id: mongoose.Types.ObjectId(assessmentId),
        deletedAt: null
      }
    }, {
      $lookup: {
        from: "questions", // The name of the collection containing questions
        localField: "_id",
        foreignField: "section_id",
        as: "questions"
      }
    }, {
      $set: {
        questions: {
          $sortArray: { input: "$questions", sortBy: { order: 1 } } // Sorting questions
        }
      }
    }, {
      $project: {
        _id: 0,
        section_id: "$_id",
        name: 1,
        description: 1,
        order: 1,
        status: 1,
        questions: 1
      },
    }, {
      $addFields: {
        questions: {
          $map: {
            input: "$questions",
            as: "question",
            in: {
              $cond: {
                if: { $ne: ["$$question.parent_question_id", null] },
                then: "$$question",
                else: {
                  _id: "$$question._id",
                  options: "$$question.options",
                  description: "$$question.description",
                  option_type: "$$question.option_type",
                  is_mandatory: "$$question.is_mandatory",
                  point: "$$question.point",
                  order: "$$question.order",
                  question: "$$question.question",
                  status: "$$question.status",
                  parent_question_id: "$$question.parent_question_id",
                  child_questions: []
                }
              }
            }
          }
        }
      }
    }, {
      $addFields: {
        questions: {
          $map: {
            input: "$questions",
            as: "question",
            in: {
              $cond: {
                if: { $eq: ["$$question.parent_question_id", null] },
                then: {
                  $mergeObjects: ["$$question", {
                    child_questions: {
                      $filter: {
                        input: "$questions",
                        as: "sub_question",
                        cond: {
                          $eq: ["$$sub_question.parent_question_id", "$$question._id"]
                        }
                      }
                    }
                  }]
                },
                else: "$$question"
              }
            }
          }
        }
      }
    }, {
      $addFields: {
        questions: {
          $filter: {
            input: "$questions", // The questions array
            as: "question", // Variable to refer to each element
            cond: {
              $eq: ["$$question.parent_question_id", null], // Only keep questions where parent_question_id is null
            }
          }
        }
      }
    }, {
      $sort: { order: 1 }
    }, {
      $project: {
        section_id: 1,
        name: 1,
        description: 1,
        order: 1,
        status: 1,
        questions: {
          _id: 1,
          options: 1,
          description: 1,
          option_type: 1,
          is_mandatory: 1,
          point: 1,
          order: 1,
          question: 1,
          status: 1,
          child_questions: 1, // Include child questions for parent questions
          parent_question_id: 1
        }
      }
    }])

    return sections;
  } catch (error) {
    console.error("getGroupedQuestionsByAssessment catch >>>> ", error)
    throw Error(`getGroupedQuestionsByAssessment catch >>>> ${error.message}`);
  }
}

exports.getSectionsWithQuestionsAndAnswers = async function (assessmentId, assessmentReportId) {
  try {
    // Step 1: Match all sections with their questions and answers, excluding child questions from main questions
    const sections = await Section.aggregate([{
      $sort: { order: 1 }
    }, {
      $match: {
        assessment_id: mongoose.Types.ObjectId(assessmentId),
        status: 1,
        deletedAt: null
      },
    }, {
      $lookup: {
        from: "assessments",
        localField: "assessment_id",
        foreignField: "_id",
        as: "assessmentDetails"
      }
    }, {
      $unwind: "$assessmentDetails"
    }, {
      $lookup: {
        from: "questions",
        let: { sectionId: "$_id" },
        pipeline: [{
          $match: {
            $expr: {
              $and: [
                { $eq: ["$section_id", "$$sectionId"] },
                {
                  $eq: ["$assessment_id", mongoose.Types.ObjectId(assessmentId)]
                },
                { $eq: ["$status", 1] },
                { $eq: ["$deletedAt", null] },
                { $eq: ["$parent_question_id", null] }, // Exclude child questions from main questions
              ]
            }
          }
        }, {
          $lookup: {
            from: "question_answers",
            let: { questionId: "$_id" },
            pipeline: [{
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$question_id", "$$questionId"] },
                    {
                      $eq: ["$asessment_report_id", mongoose.Types.ObjectId(assessmentReportId)]
                    }
                  ]
                }
              }
            }],
            as: "answerDetails"
          }
        }, {
          $unwind: {
            path: "$answerDetails",
            preserveNullAndEmptyArrays: true
          }
        }, {
          $addFields: {
            value: { $ifNull: ["$answerDetails.value", null] }
          }
        }, {
          $sort: { order: 1 },
        }],
        as: "questions"
      }
    }, {
      $match: {
        $expr: { $gt: [{ $size: "$questions" }, 0] }
      }
    }, {
      $group: {
        _id: null,
        assessment_name: { $first: "$assessmentDetails.name" },
        assessment_description: { $first: "$assessmentDetails.description" },
        assessment_show_score_calculation: { $first: "$assessmentDetails.show_score_calculation" },
        assessment_additional_description: { $first: "$assessmentDetails.additional_description" },
        sections: {
          $push: {
            _id: "$_id",
            name: "$name",
            description: "$description",
            questions: "$questions", // Include only parent questions
            order: "$order"
          }
        }
      }
    }, {
      $sort: { "sections.order": 1 }
    }, {
      $project: {
        _id: 0,
        assessment_name: 1,
        assessment_description: 1,
        assessment_show_score_calculation: 1,
        assessment_additional_description: 1,
        sections: 1
      }
    }])

    // Step 2: Handle child questions
    const childQuestions = await Section.aggregate([{
      $match: {
        assessment_id: mongoose.Types.ObjectId(assessmentId),
        status: 1,
        deletedAt: null
      }
    }, {
      $lookup: {
        from: "questions",
        let: { sectionId: "$_id" },
        pipeline: [{
          $match: {
            $expr: {
              $and: [
                { $eq: ["$section_id", "$$sectionId"] },
                {
                  $eq: ["$assessment_id", mongoose.Types.ObjectId(assessmentId)]
                },
                { $eq: ["$status", 1] },
                { $eq: ["$deletedAt", null] },
                { $ne: ["$parent_question_id", null] }
              ]
            }
          }
        }, {
          $lookup: {
            from: "question_answers",
            let: { questionId: "$_id" },
            pipeline: [{
              $match: {
                $expr: {
                  $and: [
                    { $eq: ["$question_id", "$$questionId"] },
                    {
                      $eq: ["$asessment_report_id", mongoose.Types.ObjectId(assessmentReportId)]
                    }
                  ]
                }
              }
            }],
            as: "answerDetails"
          }
        }, {
          $unwind: {
            path: "$answerDetails",
            preserveNullAndEmptyArrays: true
          }
        }, {
          $addFields: {
            value: { $ifNull: ["$answerDetails.value", null] }
          }
        }, {
          $sort: { order: 1 }
        }],
        as: "childQuestions"
      }
    }, {
      $unwind: "$childQuestions"
    }, {
      $group: {
        _id: "$childQuestions.parent_question_id", // Group by parent_question_id
        childQuestions: { $push: "$childQuestions" }
      }
    }])

    const allSections = await Section.aggregate([{
      $match: {
        assessment_id: mongoose.Types.ObjectId(assessmentId),
        status: 1,
        deletedAt: null
      }
    }, {
      $project: {
        _id: 1,
        name: 1,
        order: 1,
        description: 1
      }
    }, {
      $sort: { order: 1 }
    }])

    // Step 3: Combine the parent and child questions
    const result = sections.length > 0 ? sections[0] : null;
    if (result) {
      result.allSections = allSections;

      // Merge child questions under their respective parent question
      if (result?.sections && result.sections?.length > 0) {
        result.sections.forEach((section) => {
          if (section?.questions) {
            section.questions.forEach((question) => {
              // Find child questions that belong to this question
              const matchingChildQuestions = childQuestions.find((child) => child._id.toString() === question._id.toString())
              if (matchingChildQuestions) {
                question.childQuestions = matchingChildQuestions.childQuestions;
              }
            })
          }
        })
      }
    }

    return result;
  } catch (error) {
    console.error("getSectionsWithQuestionsAndAnswers catch >>>> ", error)
    throw Error(`getSectionsWithQuestionsAndAnswers catch >>>> ${error.message}`);
  }
}
