var RoleService = require("../services/role.service");
var UserService = require("../services/user.service");

// Saving the context of this module inside the _the variable
_this = this;

var superAdminRole = process.env?.SUPER_ADMIN_ROLE || "";
var companyAdminRole = process.env?.COMPANY_ADMIN_ROLE || "";

// Async Controller function to get the To do List
exports.getRoles = async function (req, res, next) {
  try {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = Number(req.query?.page || 1);
    var limit = Number(req.query?.limit || 100);
    var sort = req.query?.sort == "asc" ? 1 : -1;
    var sortColumn = req.query.sortColumn ? req.query.sortColumn : "_id";
    var search = req.query?.search || "";
    var pageIndex = 0;
    var startIndex = 0;
    var endIndex = 0;
    var roleId = req?.roleId || "";

    var query = { is_super: 0, status: 1, deletedAt: null };
    if (roleId) {
      query._id = { $ne: roleId };
    }

    if (roleId != superAdminRole && roleId != companyAdminRole) {
      var roleIds = [roleId];
      if (superAdminRole) {
        roleIds.push(superAdminRole);
      }
      if (companyAdminRole) {
        roleIds.push(companyAdminRole);
      }

      query._id = { $nin: roleIds };
      query.is_default = 0;
    }

    if (req.query?.company_id) {
      query["$or"] = [
        { company_id: null },
        { company_id: req.query?.company_id },
      ];
    }

    if (search) {
      query["$or"] = [{ name: { $regex: search, $options: "i" } }];
    }

    var count = await RoleService.getRoleCount(query);
    var roles = await RoleService.getRoles(
      query,
      page,
      limit,
      sortColumn,
      sort
    );
    if (!roles || !roles.length) {
      if (Number(req.query?.page || 0) > 0) {
        page = 1;
        roles = await RoleService.getRoles(
          query,
          page,
          limit,
          sortColumn,
          sort
        );
      }
    }

    if (roles && roles.length) {
      pageIndex = page - 1;
      startIndex = pageIndex * limit + 1;
      endIndex = Math.min(startIndex - 1 + limit, count);
    }

    var pagination = {
      pages: Math.ceil(count / limit),
      total: count,
      pageIndex,
      startIndex,
      endIndex,
    };

    // Return the Roles list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: roles,
      pagination,
      message: "Roles received successfully.",
    });
  } catch (e) {
    // Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.getRole = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  var id = req.params.id;
  try {
    var Role = await RoleService.getRole(id);
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: Role,
      message: "Role received successfully.",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.getAuthUserRole = async function (req, res, next) {
  // Check the existence of the query parameters, If doesn't exists assign a default value
  try {
    if (!req?.roleId) {
      return res
        .status(200)
        .json({ status: 200, flag: false, message: "User not authorized." });
    }

    var id = req.roleId;
    var role = await RoleService.getRole(id);
    // Return the Users list with the appropriate HTTP password Code and Message.
    return res.status(200).json({
      status: 200,
      flag: true,
      data: role,
      message: "Role received successfully.",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.createRole = async function (req, res, next) {
  try {
    var companyId = req.companyId;
    if (!req.body?.company_id) {
      req.body.company_id = companyId;
    }

    req.body.auth_user_name = req?.userName || "";
    req.body.auth_user_id = req?.userId || "";

    // Calling the Service function with the new object from the Request Body
    var createdRole = await RoleService.createRole(req.body);
    return res.status(200).json({
      status: 200,
      flag: true,
      data: createdRole,
      message: "Role created successfully.",
    });
  } catch (e) {
    //Return an Error Response Message with Code and the Error Message.
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.updateRole = async function (req, res, next) {
  // Id is necessary for the update
  if (!req.body._id) {
    return res
      .status(200)
      .json({ status: 200, flag: false, message: "Id must be present" });
  }

  try {
    req.body.auth_user_name = req?.userName || "";
    req.body.auth_user_id = req?.userId || "";

    var updatedRole = await RoleService.updateRole(req.body);
    return res.status(200).json({
      status: 200,
      flag: true,
      data: updatedRole,
      message: "Role updated successfully.",
    });
  } catch (e) {
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};

exports.removeRole = async function (req, res, next) {
  var id = req.params.id;
  if (!id) {
    return res
      .status(200)
      .json({ status: 200, flag: true, message: "Id must be present" });
  }

  try {
    var payload = { _id: id, deletedAt: new Date(), status: 0 };
    if (req?.userName) {
      payload.auth_user_name = req.userName;
    }
    if (req?.userId) {
      payload.auth_user_id = req.userId;
    }

    var deleted = await RoleService.updateRole(payload);
    if (deleted?._id && deleted?.deletedAt) {
      if (deleted._id != superAdminRole) {
        await UserService.updateManyUsers(
          {
            role_id: deleted._id,
            status: 1,
            deletedAt: null,
          },
          {
            status: 0,
            deletedAt: new Date(),
          }
        );
      }
    }

    return res
      .status(200)
      .send({ status: 200, flag: true, message: "Role deleted successfully." });
  } catch (e) {
    return res
      .status(200)
      .json({ status: 200, flag: false, message: e.message });
  }
};
