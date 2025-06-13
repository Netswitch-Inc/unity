var Assessment = require("../models/Assessment.model");

// Saving the context of this module inside the _the variable
_this = this;

// Async function to get the Assessment List
exports.getAssessments = async function (query = {}, page = 1, limit = 0, sortField = "", sortType = "") {
  try {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) {
      sorts[sortField] = sortType;
    }

    // Try Catch the awaited promise to handle the error
    var assessments = await Assessment.find(query)
      .skip(skips)
      .limit(limit)
      .sort(sorts);

    return assessments;
  } catch (e) {
    throw Error("Error occurred while finding Assessments");
  }
}

exports.getAssessmentsCount = async function (query) {
  try {
    var count = await Assessment.find(query).count();

    return count;
  } catch (e) {
    throw Error("Error while Counting Assessments");
  }
}

exports.getAssessmentsDistinct = async function (field, query) {
  try {
    var assessments = await Assessment.distinct(field, query);

    return assessments
  } catch (e) {
    // console.log("Error ", e);
    // return a Error message describing the reason
    throw Error("Error while Distinct Assessments");
  }
}

exports.getAssessment = async function (id) {
  try {
    // Find the Data
    var _details = await Assessment.findOne({ _id: id });
    if (_details._id) {
      return _details
    } else {
      throw Error("Assessment not available");
    }
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Assessment not available");
  }
}

exports.getAssessmentOne = async function (id) {
  try {
    // Find the Data
    var assessment = await Assessment.findOne({ _id: id });

    return assessment || null
  } catch (e) {
    // return a Error message describing the reason
    return null
  }
}

exports.createAssessment = async function (assessment) {
  var newAssessment = new Assessment({
    name: assessment.name ? assessment.name : "",
    description: assessment.description ? assessment.description : "",
    order: assessment.order ? assessment.order : 0,
    show_score_calculation: assessment.show_score_calculation ? assessment.show_score_calculation : false,
    additional_description: assessment.additional_description ? assessment.additional_description : "",
    status: assessment.status ? assessment.status : 0,
    deletedAt: null
  })

  try {
    // Saving the Assessment
    var savedAssessment = await newAssessment.save();
    return savedAssessment
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Error occurred while creating Assessment");
  }
}

exports.updateAssessment = async function (assessment) {
  var id = assessment._id;
  try {
    // Find the old Assessment Object by the Id
    var oldAssessment = await Assessment.findById(id);
  } catch (e) {
    throw Error("Assessment not found");
  }

  // If no old Assessment Object exists return false
  if (!oldAssessment) { return false; }

  // Edit the Assessment Object
  if (assessment.name) {
    oldAssessment.name = assessment.name;
  }

  if (assessment?.description || assessment.description == "") {
    oldAssessment.description = assessment.description;
  }

  if (assessment?.order || assessment.order == 0) {
    oldAssessment.order = assessment?.order || 0;
  }

  if (assessment?.show_score_calculation == true || assessment?.show_score_calculation == false) {
    oldAssessment.show_score_calculation = assessment?.show_score_calculation || false;
  }

  if (assessment?.status || assessment.status == 0) {
    oldAssessment.status = assessment?.status || 0;
  }

  if (assessment?.additional_description || assessment.additional_description == "") {
    oldAssessment.additional_description = assessment.additional_description;
  }

  if (assessment?.deletedAt) {
    oldAssessment.deletedAt = assessment.deletedAt;
  }

  try {
    var savedAssessment = await oldAssessment.save();
    return savedAssessment
  } catch (e) {
    throw Error("Error occurred while updating the Assessment");
  }
}

exports.deleteAssessment = async function (id) {
  // Delete the Assessment
  try {
    var deleted = await Assessment.remove({ _id: id });
    if (deleted.n === 0 && deleted.ok === 1) {
      throw Error("Assessment Could not be deleted");
    }

    return deleted
  } catch (e) {
    throw Error("Error occurred while Deleting the Assessment");
  }
}
