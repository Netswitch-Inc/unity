// Gettign the Newly created Mongoose Model we just created
var ProjectModel = require("../models/Projects.model");

const { createUpdateEventLog } = require('../helper');

// Saving the context of this module inside the _the variable
_this = this;

// Async function to get the Project List
exports.getSimpleProjects = async function (query) {
  // Try Catch the awaited promise to handle the error
  try {
    var Projects = await ProjectModel.find(query);

    // Return the Projects list that was retured by the mongoose promise
    return Projects;
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Error while getting Projects");
  }
}

exports.getProjects = async function (query = {}, page = 1, limit = 0, sortField = "", sortType = "") {
  try {
    var skips = limit * (page - 1);
    var sorts = {};
    if (sortField) {
      sorts[sortField] = sortType;
    }

    // Try Catch the awaited promise to handle the error
    var Project = await ProjectModel.find(query)
      .populate({ path: "company_id" })
      .populate({ path: "user_id" })
      .populate({ path: "framework_id" })
      .populate({ path: "involved_parties" })
      .populate({ path: "submitted_by" })
      .populate({ path: "company_compliance_control_id" })
      .populate({ path: "users_ai_description.user_id" })
      .sort(sorts)
      .skip(skips)
      .limit(limit);

    return Project;
  } catch (error) {
    throw Error("Error while Paginating Projects");
  }
}

exports.getProjectsCount = async function (query) {
  try {
    var count = await ProjectModel.find(query).count();

    return count;
  } catch (error) {
    throw Error(error.message);
  }
}

exports.getProject = async function (id) {
  try {
    // Find the Data
    var _details = await ProjectModel.findOne({ _id: id })
      .populate({ path: "company_id" })
      .populate({ path: "user_id" })
      .populate({ path: "framework_id" })
      .populate({ path: "involved_parties" })
      .populate({ path: "submitted_by" })
      .populate({ path: "company_compliance_control_id" })
      .populate({ path: "users_ai_description.user_id" });
    if (_details._id) {
      return _details;
    } else {
      throw Error("Project not available");
    }
  } catch (error) {
    // return a Error message describing the reason
    throw Error("Project not available");
  }
}

const getProjectDetail = async (query) => {
  try {
    // Find the Project
    var project = await ProjectModel.findOne(query)
      .populate({ path: "company_id" })
      .populate({ path: "user_id" })
      .populate({ path: "framework_id" })
      .populate({ path: "involved_parties" })
      .populate({ path: "submitted_by" })
      .populate({ path: "company_compliance_control_id" })
      .populate({ path: "users_ai_description.user_id" });

    return project || null;
  } catch (error) {
    // return a Error message describing the reason
    return null;
  }
}

exports.createProject = async function (Project) {
  var newProject = new ProjectModel({
    company_id: Project.company_id ? Project.company_id : null,
    user_id: Project.user_id ? Project.user_id : null,
    framework_id: Project.framework_id?.length ? Project.framework_id : null,
    involved_parties: Project.involved_parties?.length ? Project.involved_parties : null,
    submitted_by: Project.submitted_by ? Project.submitted_by : null,
    company_compliance_control_id: Project.company_compliance_control_id ? Project.company_compliance_control_id : null,
    cis_control_id: Project.cis_control_id ? Project.cis_control_id : null,
    users_ai_description: Project.users_ai_description?.length ? Project.users_ai_description : null,
    name: Project.name ? Project.name : "",
    description: Project.description ? Project.description : "",
    ai_description: Project.ai_description ? Project.ai_description : "",
    cost_of_risk: Project.cost_of_risk ? Project.cost_of_risk : 0,
    fix_cost_risk_ratio: Project.fix_cost_risk_ratio ? Project.fix_cost_risk_ratio : 0,
    affected_scope: Project.affected_scope ? Project.affected_scope : "",
    priority: Project.priority ? Project.priority : "",
    fix_projected_cost: Project.fix_projected_cost ? Project.fix_projected_cost : 0,
    likelyhood: Project.likelyhood ? Project.likelyhood : 0,
    impact_assessment: Project.impact_assessment ? Project.impact_assessment : 0,
    affected_risk: Project.affected_risk ? Project.affected_risk : 0,
    status: Project.status ? Project.status : "created",
    deletedAt: null
  });

  try {
    // Saving the Project
    var savedProject = await newProject.save();
    if (savedProject?._id) {
      var currentData = await getProjectDetail({ _id: savedProject._id });

      var updatedByName = Project?.auth_user_name || "";
      var description = `${savedProject?.name || "Project"} created ${updatedByName ? `by ${updatedByName}` : ""}`;

      const payload = {
        reference_id: savedProject._id,
        company_id: currentData?.company_id?._id || currentData?.company_id,
        module_id: null,
        action_user_id: Project?.auth_user_id,
        user_id: currentData?.user_id?._id || currentData?.user_id,
        module_slug: "projects",
        type: "projects",
        action: "create",
        description,
        previous_data: null,
        current_data: currentData
      }

      createUpdateEventLog(payload, "create", "projects");
    }

    return savedProject;
  } catch (error) {
    // return a Error message describing the reason
    throw Error("Error while Creating Project");
  }
}

exports.updateProject = async function (projectData) {
  var id = projectData._id;
  try {
    var oldProject = await ProjectModel.findById(id);
  } catch (e) {
    throw Error("Project not found");
  }

  if (!oldProject) { return false; }

  var oldData = null;
  if (oldProject?._id) {
    oldData = await getProjectDetail({ _id: oldProject._id });
  }

  // Edit the Project Object
  if (projectData.company_id) {
    oldProject.company_id = projectData.company_id;
  }

  if (projectData.user_id) {
    oldProject.user_id = projectData.user_id;
  }

  if (projectData.framework_id) {
    oldProject.framework_id = projectData.framework_id;
  }

  if (projectData.involved_parties) {
    oldProject.involved_parties = projectData.involved_parties;
  }

  if (projectData.submitted_by) {
    oldProject.submitted_by = projectData.submitted_by;
  }

  if (projectData.company_compliance_control_id) {
    oldProject.company_compliance_control_id = projectData.company_compliance_control_id;
  }

  if (projectData.cis_control_id) {
    oldProject.cis_control_id = projectData.cis_control_id;
  }

  if (projectData.users_ai_description?.length) {
    oldProject.users_ai_description = projectData.users_ai_description;
  }

  if (projectData.name) {
    oldProject.name = projectData.name;
  }

  if (projectData.description) {
    oldProject.description = projectData.description;
  }

  if (projectData.ai_description) {
    oldProject.ai_description = projectData.ai_description;
  }

  if (projectData.cost_of_risk) {
    oldProject.cost_of_risk = projectData.cost_of_risk;
  }

  if (projectData.fix_cost_risk_ratio) {
    oldProject.fix_cost_risk_ratio = projectData.fix_cost_risk_ratio;
  }

  if (projectData.affected_scope) {
    oldProject.affected_scope = projectData.affected_scope;
  }

  if (projectData.priority) {
    oldProject.priority = projectData.priority;
  }

  if (projectData.fix_projected_cost) {
    oldProject.fix_projected_cost = projectData.fix_projected_cost;
  }

  if (projectData.likelyhood) {
    oldProject.likelyhood = projectData.likelyhood;
  }

  if (projectData.impact_assessment) {
    oldProject.impact_assessment = projectData.impact_assessment;
  }

  if (projectData.affected_risk) {
    oldProject.affected_risk = projectData.affected_risk;
  }

  if (projectData.status) {
    oldProject.status = projectData.status;
  }

  if (projectData.deletedAt) {
    oldProject.deletedAt = projectData.deletedAt;
  }

  try {
    var savedProject = await oldProject.save();
    if (savedProject?._id) {
      var action = "update";

      var currentData = await getProjectDetail({ _id: savedProject._id });
      var updatedByName = projectData?.auth_user_name || currentData?.user_id?.user_name || "";
      var description = `${savedProject?.name || "Project"} updated ${updatedByName ? `by ${updatedByName}` : ""}`;
      if (savedProject?.deletedAt) {
        action = "delete";
        description = `${savedProject?.name || "Project"} deleted ${updatedByName ? `by ${updatedByName}` : ""}`;
      }

      const payload = {
        reference_id: savedProject._id,
        company_id: currentData?.company_id?._id || currentData?.company_id,
        module_id: null,
        action_user_id: projectData?.auth_user_id || currentData?.user_id?._id,
        user_id: currentData?.user_id?._id || currentData?.user_id,
        module_slug: "projects",
        type: "projects",
        action: action,
        description,
        previous_data: oldData,
        current_data: currentData,
      };
      createUpdateEventLog(payload, action, "projects");
    }

    return savedProject;
  } catch (error) {
    throw Error("Error occurred while updating the Project");
  }
}

exports.deleteProject = async function (id) {
  // Delete the Project
  try {
    var deleted = await ProjectModel.remove({ _id: id });
    if (deleted.n === 0 && deleted.ok === 1) {
      throw Error("Project Could not be deleted");
    }

    return deleted;
  } catch (error) {
    throw Error("Error Occured while Deleting the Project");
  }
}

exports.softDeleteProject = async function (id) {
  try {
    var deleted = await ProjectModel.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date() } }
    );
    return deleted;
  } catch (error) {
    throw Error(error.message);
  }
}
