// Gettign the Newly created Mongoose Model we just created
var ProjectHistoryModel = require("../models/Projecthistory.model");
// Saving the context of this module inside the _the variable
_this = this;

// Async function to get the Project List

exports.getSimpleProjectHistories = async function (query) {
  // Try Catch the awaited promise to handle the error
  try {
    var ProjectHistories = await ProjectHistoryModel.find(query);

    // Return the ProjectHistories list that was retured by the mongoose promise
    return ProjectHistories;
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Error while Paginating ProjectHistories");
  }
};

exports.getProjectHistories = async function (
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
    var ProjectHistory = await ProjectHistoryModel.find(query)
      .populate({ path: "company_id" })
      .populate({ path: "user_id" })
      .populate({ path: "project_id" })
      .sort(sorts)
      .skip(skips)
      .limit(limit);

    return ProjectHistory;
  } catch (e) {
    throw Error("Error occurred while finding ProjectHistories");
  }
};

exports.getProjectHistory = async function (id) {
  try {
    // Find the Data
    var _details = await ProjectHistoryModel.findOne({ _id: id })
      .populate({ path: "company_id" })
      .populate({ path: "user_id" })
      .populate({ path: "project_id" });
    if (_details._id) {
      return _details;
    } else {
      throw Error("ProjectHistory not available");
    }
  } catch (e) {
    // return a Error message describing the reason
    throw Error("ProjectHistory not available");
  }
};

exports.createProjectHistory = async function (ProjectHistory) {
  var newProjectHistory = new ProjectHistoryModel({
    company_id: ProjectHistory.company_id ? ProjectHistory.company_id : null,
    user_id: ProjectHistory.user_id ? ProjectHistory.user_id : null,
    project_id: ProjectHistory.project_id ? ProjectHistory.project_id : null,
    description: ProjectHistory.description ? ProjectHistory.description : '',
    date: new Date(),
    type: ProjectHistory.type ? ProjectHistory.type : "",
    status: ProjectHistory.status ? ProjectHistory.status : 1,
    deletedAt: null
  });

  try {
    // Saving the Project
    var savedProjectHistory = await newProjectHistory.save();
    return savedProjectHistory;
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Error while Creating ProjectHistory");
  }
};

exports.updateProjectHistory = async function (ProjectHistory) {
  var id = ProjectHistory._id;
  try {
    var oldProjectHistory = await ProjectHistoryModel.findById(id);
  } catch (e) {
    throw Error("ProjectHistory not found");
  }

  if (!oldProjectHistory) {
    return false;
  }

  // Edit the Question Object
  if (ProjectHistory.company_id) {
    oldProjectHistory.company_id = ProjectHistory.company_id;
  }
  if (ProjectHistory.user_id) {
    oldProjectHistory.user_id = ProjectHistory.user_id;
  }
  if (ProjectHistory.project_id) {
    oldProjectHistory.project_id = ProjectHistory.project_id;
  }

  if (ProjectHistory.description) {
    oldProjectHistory.description = ProjectHistory.description;
  }

  if (ProjectHistory.date) {
    oldProjectHistory.date = ProjectHistory.date;
  }

  if (ProjectHistory.status === 1 || ProjectHistory.status === 0) {
    oldProjectHistory.status = ProjectHistory.status;
  }

  try {
    var savedProjectHistory = await oldProjectHistory.save();
    return savedProjectHistory;
  } catch (e) {
    throw Error("Error occurred while updating the ProjectHistory");
  }
};

exports.softDeleteProjectHistory = async function (id) {
  try {
    var deleted = await ProjectHistoryModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date() } }
    );
    return deleted;
  } catch (e) {
    throw Error(e.message);
  }
};

exports.getProjectHistoriesCount = async function (query) {
  try {
    var count = await ProjectHistoryModel.find(query).count();

    return count;
  } catch (e) {
    throw Error("Error while Counting ProjectHistories");
  }
};
