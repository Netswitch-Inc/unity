var QuestionService = require("../services/question.service");
var QuestionAnswerService = require("../services/questionAnswer.service");
var SectionService = require("../services/section.service");

// Saving the context of this section inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getSections = async function (req, res, next) {
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
        { name: { $regex: ".*" + search + ".*", $options: "i" } },
        { description: { $regex: ".*" + search + ".*", $options: "i" } },
      ];
    }

    var count = await SectionService.getSectionsCount(query);
    var sections = await SectionService.getSections(query, page, limit, sortColumn, sort)
    if (!sections || !sections.length) {
      if (Number(req.query?.page || 0) > 0) {
        page = 1;
        sections = await SectionService.getSections(query, page, limit, sortColumn, sort)
      }
    }

    if (sections && sections.length) {
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

    // Return the Sections list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: sections,
      pagination,
      message: "Sections received successfully."
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message })
  }
}

exports.getSection = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var id = req.params.id;
  try {
    var section = await SectionService.getSection(id);

    // Return the Section with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: section,
      message: "Section received successfully."
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.createSection = async function (req, res, next) {
  try {
    // Calling the Service function with the new object from the Request Body
    var createdSection = await SectionService.createSection(req.body);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: createdSection,
      message: "Section created successfully."
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.updateSection = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body?._id) {
    return res.status(200).json({ status: 200, flag: false, message: "Id must be present." })
  }

  try {
    // Calling the Service function with the new object from the Request Body
    var updatedSection = await SectionService.updateSection(req.body);

    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedSection,
      message: "Section updated successfully."
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.removeSection = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res.status(200).json({ status: 200, flag: true, message: "Id must be present." });
  }

  try {
    var softDelete = false;
    var questions = await QuestionService.getQuestions({ section_id: id });
    if (questions?.length) {
      softDelete = true;
    } else if (!softDelete) {
      var questionAns = await QuestionAnswerService.getQuestionAnswers({ section_id: id });
      if (questionAns?.length) {
        softDelete = true;
      }
    }

    if (softDelete) {
      await SectionService.updateSection({ _id: id, deletedAt: new Date() });
    } else {
      var deleted = await SectionService.deleteSection(id);
    }

    return res.status(200).json({ status: 200, flag: true, message: "Successfully Deleted... " });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res.status(200).json({ status: 200, flag: false, message: e.message });
  }
}

exports.getSectionByAssessment = async function (req, res) {
  try {
    const queryData = { assessment_id: req.query.assessment_id }
    const sections = await SectionService.getFilteredSections(queryData);
    if (sections) {
      return res.status(200).json({
        status: 200,
        flag: true,
        data: sections,
        message: "Section received successfully."
      })
    }

    return res.status(200).json({ status: 200, flag: false, message: "No sections found." });
  } catch (error) {
    return res.status(200).json({ status: 200, flag: false, message: error.message });
  }
}
