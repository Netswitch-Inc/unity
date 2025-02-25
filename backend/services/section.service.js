var Section = require("../models/Section.model");

// Saving the context of this module inside the _the variable
_this = this;

// Async function to get the Section List
exports.getSections = async function (
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
    var sections = await Section.find(query).skip(skips).limit(limit);

    return sections;
  } catch (e) {
    throw Error("Error occurred while finding Sections");
  }
};

exports.getSectionsCount = async function (query) {
  try {
    var count = await Section.find(query).count();

    return count;
  } catch (e) {
    throw Error("Error while Counting Sections");
  }
};

exports.getSectionsDistinct = async function (field, query) {
  try {
    var sections = await Section.distinct(field, query);

    return sections;
  } catch (e) {
    // console.log("Error ", e);
    // return a Error message describing the reason
    throw Error("Error while Distinct Sections");
  }
};

exports.getSection = async function (id) {
  try {
    // Find the Data
    var _details = await Section.findOne({ _id: id });
    if (_details._id) {
      return _details;
    } else {
      throw Error("Section not available");
    }
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Section not available");
  }
};

exports.getSectionOne = async function (id) {
  try {
    // Find the Data
    var section = await Section.findOne({ _id: id });

    return section || null;
  } catch (e) {
    // return a Error message describing the reason
    return null;
  }
};

exports.createSection = async function (section) {
  var newSection = new Section({
    assessment_id: section.assessment_id ? section.assessment_id : null,
    name: section.name ? section.name : "",
    description: section.description ? section.description : "",
    order: section.order ? section.order : 0,
    status: section.status ? section.status : 0,
    deletedAt: null,
  });

  try {
    // Saving the Section
    var savedSection = await newSection.save();
    return savedSection;
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Error occurred while creating Section");
  }
};

exports.updateSection = async function (section) {
  var id = section._id;
  try {
    // Find the old Section Object by the Id
    var oldSection = await Section.findById(id);
  } catch (e) {
    throw Error("Section not found");
  }

  // If no old Section Object exists return false
  if (!oldSection) {
    return false;
  }

  // Edit the Section Object
  if (section.assessment_id) {
    oldSection.assessment_id = section.assessment_id;
  }

  if (section.name) {
    oldSection.name = section.name;
  }

  if (section.description) {
    oldSection.description = section.description;
  }

  if (section?.order || section.order == 0) {
    oldSection.order = section?.order || 0;
  }
  if (section?.status || section.status == 0) {
    oldSection.status = section?.status || 0;
  }

  if (section?.deletedAt) {
    oldSection.deletedAt = section.deletedAt;
  }

  try {
    var savedSection = await oldSection.save();
    return savedSection;
  } catch (e) {
    throw Error("Error occurred while updating the Section");
  }
};

exports.deleteSection = async function (id) {
  // Delete the Section
  try {
    var deleted = await Section.remove({ _id: id });
    if (deleted.n === 0 && deleted.ok === 1) {
      throw Error("Section Could not be deleted");
    }
    return deleted;
  } catch (e) {
    throw Error("Error occurred while Deleting the Section");
  }
};

exports.getFilteredSections = async function (query) {
  try {
    const sections = await Section.find(query).select("name description"); // Use .select for projection
    return sections;
  } catch (e) {
    throw new Error(`Error occurred while finding Sections: ${e.message}`); // Include error details
  }
};

exports.getSectionsByAssessmentId = async function (query) {
  try {
    const sections = await Section.find(query);
    return sections;
  } catch (e) {
    throw new Error(
      `Error occurred while finding Sections for assessment: ${e.message}`
    ); // Include error details
  }
};

exports.bulkWriteOperation = async function (operations) {
  try {
    const result = await Section.bulkWrite(operations);
    return result;
  } catch (error) {
    throw Error(error?.message);
  }
};
