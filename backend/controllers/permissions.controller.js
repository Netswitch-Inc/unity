var PermissionService = require('../services/permission.service');
var ModuleService = require('../services/module.service');
var RoleService = require('../services/role.service');

const { getToolsPermissions } = require('../helper');

// Saving the context of this module inside the _the variable
_this = this;

var superAdminRole = process.env?.SUPER_ADMIN_ROLE || "";
var companyAdminRole = process.env?.COMPANY_ADMIN_ROLE || "";

// Async Controller function to get the To do List
exports.getPermissions = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var page = Number(req.query?.page || 1);
    var limit = Number(req.query?.limit || 100);
    try {
        var Permissions = await PermissionService.getPermissions({}, page, limit)
        // Return the Permissions list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: Permissions, message: "Permissions received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.checkPermissions = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var slug = req.params.slug ? req.params.slug : ""
    var roleId = req.roleId;
    // console.log("slug >>>>>>>>. ",slug);
    try {
        var Module = await ModuleService.getModuleBySlug(slug);
        if (Module && Module._id) {
            var Permissions = await PermissionService.getPermissionss({ module_id: Module._id, role_id: req.roleId })
            return res.status(200).json({ status: 200, flag: true, data: Permissions, message: "Permissions received successfully." });
        } else {
            return res.status(200).json({ status: 200, flag: false, message: "Permission not found." });
        }
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getGroupModulePermissions = async function (req, res, next) {
    if (!req.query?.role_id) {
        return res.status(200).json({ status: 200, flag: false, message: "Role Id must be present." })
    }

    try {
        var roleId = req.roleId;
        var companyId = req?.companyId;
        var role_id = req.query.role_id;
        var groupPermission = null;
        var toolsPermission = await getToolsPermissions();
        var requestRole = await RoleService.getRole(role_id);
        var groups = await ModuleService.getModulesDistinct("group_name", { tool_slug: [...toolsPermission, ""], is_super: 0, status: 1 });
        if (groups && groups?.length) {
            groupPermission = {};
            for (let i = 0; i < groups.length; i++) {
                let group = groups[i];
                var modules = await ModuleService.getModules({ group_name: group, tool_slug: [...toolsPermission, ""], is_super: 0, status: 1 });
                var modulePermission = [];
                if (modules && modules?.length) {
                    for (let j = 0; j < modules.length; j++) {
                        let module = modules[j];
                        if (module?._id && module?.slug) {
                            var query = { role_id: role_id, module_id: module._id }
                            if (role_id == superAdminRole) {
                                query.company_id = null;
                            } else if (role_id == companyAdminRole) {
                                query.company_id = null;
                            } else {
                                if (requestRole?.company_id) {
                                    query.company_id = requestRole.company_id?._id || requestRole.company_id;
                                }
                            }

                            var permission = await PermissionService.getPermissionss(query);
                            if (permission && permission._id) {
                                modulePermission.push({
                                    _id: permission._id,
                                    company_id: permission?.company_id?._id || permission?.company_id || null,
                                    role_id: permission?.role_id?._id || permission?.role_id || null,
                                    module_id: { _id: module._id, name: module.name, slug: module.slug },
                                    slug: module.slug,
                                    can_all: permission?.can_all || false,
                                    can_read: permission?.can_read || false,
                                    can_create: permission?.can_create || false,
                                    can_update: permission?.can_update || false,
                                    can_delete: permission?.can_delete || false
                                });
                            } else {
                                modulePermission.push({
                                    _id: "",
                                    company_id: requestRole?.company_id?._id || requestRole?.company_id || null,
                                    role_id: role_id,
                                    module_id: { _id: module._id, name: module.name, slug: module.slug },
                                    slug: module.slug,
                                    can_all: false,
                                    can_read: false,
                                    can_create: false,
                                    can_update: false,
                                    can_delete: false
                                });
                            }
                        }
                    }
                }

                if (modulePermission && modulePermission?.length) {
                    groupPermission[group] = modulePermission
                }
            }
        }

        return res.status(200).json({
            status: 200,
            flag: true,
            data: groupPermission,
            role: requestRole || null,
            message: "Permissions received successfully."
        });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getAllPermissions = async function (req, res, next) {
    try {
        var roleId = req.roleId;
        var companyId = req?.companyId;
        var toolsPermission = await getToolsPermissions();
        var groups = await ModuleService.getModulesDistinct("group_name", { tool_slug: [...toolsPermission, ""], status: 1 });
        if (groups && groups.length) {
            var role = await RoleService.getRole(roleId);
            var groupPermission = {};
            for (let i = 0; i < groups.length; i++) {
                let group = groups[i];
                var modules = await ModuleService.getModules({ group_name: group, tool_slug: [...toolsPermission, ""], status: 1 });
                var permissions = [];
                if (superAdminRole != roleId) {
                    var moduleIds = modules.map((t) => t._id);
                    var query = { module_id: { $in: moduleIds }, role_id: roleId };
                    if (role?.company_id) {
                        query.company_id = role.company_id?._id || role.company_id;
                    }

                    if (roleId == companyAdminRole) { query.company_id = null; }

                    permissions = await PermissionService.getSimplePermissions(query);
                }

                var modulePermission = [];
                if (modules && modules?.length) {
                    for (let j = 0; j < modules.length; j++) {
                        let module = modules[j];
                        if (module?._id && module?.slug) {
                            if (superAdminRole != roleId) {
                                var permission = permissions.find((x) => x?.module_id?.toString() == module._id?.toString());
                                if (permission?._id) {
                                    modulePermission.push({
                                        _id: permission._id,
                                        company_id: permission?.company_id || null,
                                        role_id: permission?.role_id || null,
                                        module_id: { _id: module._id, name: module.name, slug: module.slug },
                                        slug: module.slug,
                                        can_all: permission?.can_all || false,
                                        can_read: permission?.can_read || false,
                                        can_create: permission?.can_create || false,
                                        can_update: permission?.can_update || false,
                                        can_delete: permission?.can_delete || false
                                    });
                                }
                            } else if (superAdminRole == roleId) {
                                modulePermission.push({
                                    _id: "true",
                                    company_id: null,
                                    role_id: roleId,
                                    module_id: { _id: module._id, name: module.name, slug: module.slug },
                                    slug: module.slug,
                                    can_all: true,
                                    can_read: true,
                                    can_create: true,
                                    can_update: true,
                                    can_delete: true
                                });
                            }
                        }
                    }
                }

                if (modulePermission && modulePermission?.length) {
                    groupPermission[group] = modulePermission
                }
            }

            if (groupPermission) {
                groupPermission.toolsPermission = toolsPermission;
            }

            return res.status(200).json({
                status: 200,
                flag: true,
                role,
                data: groupPermission,
                message: "Permissions received successfully."
            });
        } else {
            return res.status(200).json({ status: 200, flag: false, message: "Permissions not found." })
        }
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getPermission = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var Permission = await PermissionService.getPermission(id)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: Permission, message: "Permission received successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.createPermission = async function (req, res, next) {
    try {
        var roleId = req.body?.role_id || "";
        if (roleId) {
            if (roleId == superAdminRole || roleId == companyAdminRole) {
                req.body.company_id = null;
            } else {
                var role = await RoleService.getRoleOne({ _id: roleId });
                if (role?.company_id) {
                    req.body.company_id = role.company_id?._id || role.company_id;
                }
            }
        }

        var createdPermission = await PermissionService.createPermission(req.body);
        return res.status(200).json({ status: 200, flag: true, data: createdPermission, message: "Permission created successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.updatePermission = async function (req, res, next) {
    try {
        var roleId = req.body?.role_id || "";
        if (roleId) {
            if (roleId == superAdminRole || roleId == companyAdminRole) {
                req.body.company_id = null;
            } else {
                var role = await RoleService.getRoleOne({ _id: roleId });
                if (role?.company_id) {
                    req.body.company_id = role.company_id?._id || role.company_id;
                }
            }
        }

        var updatedPermission = await PermissionService.updatePermission(req.body);
        return res.status(200).json({ status: 200, flag: true, data: updatedPermission, message: "Permission updated successfully." });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.removePermission = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present." });
    }
    try {
        var deleted = await PermissionService.deletePermission(id);
        return res.status(200).send({ status: 200, flag: true, message: "Successfully Deleted... " });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}
