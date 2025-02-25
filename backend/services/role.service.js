var Role = require("../models/Role.model");

const { createUpdateEventLog } = require("../helper");

// Saving the context of this module inside the _the variable
_this = this;

// Async function to get the Role List
exports.getRoles = async function (
  query = {},
  page = 1,
  limit = 0,
  sortField = "",
  sortType = ""
) {
  var skips = limit * (page - 1);
  var sorts = {};
  if (sortField) {
    sorts[sortField] = sortType;
  }

  // Try Catch the awaited promise to handle the error
  try {
    var roles = await Role.find(query).sort(sorts).skip(skips).limit(limit);

    return roles;
  } catch (e) {
    throw Error("Error occurred while finding Roles");
  }
};

exports.getRoleCount = async function (query) {
  try {
    var count = await Role.find(query).count();

    return count;
  } catch (e) {
    throw Error(e);
  }
};

exports.getRole = async function (id) {
  try {
    // Find the Data
    var _details = await Role.findOne({ _id: id });
    if (_details._id) {
      return _details;
    } else {
      throw Error("Role not available");
    }
  } catch (e) {
    // return a Error message describing the reason
    throw Error("Role not available");
  }
};

exports.getRoleOne = async function (query) {
  try {
    // Find the Data
    var role = await Role.findOne(query);

    return role;
  } catch (e) {
    // return a Error message describing the reason
    // throw Error("Role not available");
    return null;
  }
};

const getRoleDetail = async (query) => {
  try {
    // Find the Role
    var role = await Role.findOne(query);

    return role || null;
  } catch (e) {
    // return a Error message describing the reason
    return null;
  }
};

exports.createRole = async function (role) {
  var newRole = new Role({
    company_id: role.company_id ? role.company_id : null,
    priviledge: role.priviledge ? role.priviledge : "",
    name: role.name ? role.name : "",
    group: role.group ? role.group : "",
    is_super: 0,
    is_default: 0,
    permission: role.permission ? role.permission : null,
    status: role.status ? role.status : 0, // 1||0
    deletedAt: null,
  });

  try {
    // Saving the Role
    var savedRole = await newRole.save();
    if (savedRole?._id) {
      var currentData = await getRoleDetail({ _id: savedRole._id });

      var updatedByName = role?.auth_user_name || "";
      var description = `${savedRole?.name || "Role"} created ${
        updatedByName ? `by ${updatedByName}` : ""
      }`;

      const payload = {
        reference_id: savedRole._id,
        company_id: currentData?.company_id?._id || currentData?.company_id,
        module_id: null,
        action_user_id: role?.auth_user_id,
        user_id: null,
        module_slug: "roles",
        type: "roles",
        action: "create",
        description,
        previous_data: null,
        current_data: currentData,
      };
      createUpdateEventLog(payload, "create", "roles");
    }

    return savedRole;
  } catch (e) {
    // return a Error message describing the reason
    console.log("createRole catch >>> ", e);
    throw Error("Error occurred while creating Role");
  }
};

exports.updateRole = async function (role) {
  var id = role._id;
  try {
    //Find the old Role Object by the Id
    var oldRole = await Role.findById(id);
  } catch (e) {
    throw Error("Role not found");
  }

  // If no old Role Object exists return false
  if (!oldRole) {
    return false;
  }

  var oldData = null;
  if (oldRole?._id) {
    oldData = await getRoleDetail({ _id: oldRole._id });
  }

  if (role.company_id) {
    oldRole.company_id = role.company_id;
  }

  if (role.name) {
    oldRole.name = role.name;
  }

  if (role.group) {
    oldRole.group = role.group;
  }
  if (role.priviledge) {
    oldRole.priviledge = role.priviledge;
  }
  if (role.permission) {
    oldRole.permission = role.permission;
  }

  if (role?.status || role.status == 0) {
    oldRole.status = role?.status || 0;
  }

  if (role.deletedAt) {
    oldRole.deletedAt = role.deletedAt;
  }

  try {
    var savedRole = await oldRole.save();
    if (savedRole?._id) {
      var action = "update";

      var currentData = await getRoleDetail({ _id: savedRole._id });
      var updatedByName = role?.auth_user_name || "";
      var description = `${savedRole?.name || "Role"} updated ${
        updatedByName ? `by ${updatedByName}` : ""
      }`;
      if (savedRole?.deletedAt) {
        action = "delete";
        description = `${savedRole?.name || "Role"} deleted ${
          updatedByName ? `by ${updatedByName}` : ""
        }`;
      }

      const payload = {
        reference_id: savedRole._id,
        company_id: currentData?.company_id?._id || currentData?.company_id,
        module_id: null,
        action_user_id: role?.auth_user_id,
        user_id: null,
        module_slug: "roles",
        type: "roles",
        action: action,
        description,
        previous_data: oldData,
        current_data: currentData,
      };
      createUpdateEventLog(payload, action, "roles");
    }

    return savedRole;
  } catch (e) {
    console.log(e);
    throw Error("Error occurred while updating the Role");
  }
};

exports.deleteRole = async function (id) {
  // Delete the Role
  try {
    var deleted = await Role.remove({ _id: id });
    if (deleted.n === 0 && deleted.ok === 1) {
      throw Error("Role Could not be deleted");
    }

    return deleted;
  } catch (e) {
    throw Error("Error occurred while Deleting the Role");
  }
};

exports.softDeleteRole = async function (id) {
  // Delete the Role
  try {
    // var deleted = await Role.updateOne({{_id: id},{ $set: { retryCount:1  }}})
    var deleted = await Role.updateOne(
      { _id: id },
      { $set: { deletedAt: new Date(), status: 0 } }
    );

    return deleted;
  } catch (e) {
    throw Error("Error occurred while Deleting the Role");
  }
};
