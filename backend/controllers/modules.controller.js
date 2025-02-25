var ModuleService = require('../services/module.service');
var RoleService = require('../services/role.service');

// Saving the context of this module inside the _the variable
_this = this;

// Async Controller function to get the To do List
exports.getModules = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    try {
        var page = req.query.page ? req.query.page : 1
        var limit = req.query.limit ? req.query.limit : 100;

        var modules = await ModuleService.getModules({}, page, limit)
        // Return the Modules list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: modules, message: "Modules received successfully!" });
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

// Async Controller function to get the To do List
exports.getGroupByModules = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    try {
        var modulesData = [];
        var modules = await ModuleService.getModulesDistinct('group_name', { group_name: { $ne: 'System' } });

        if (modules && modules.length) {
            for (var i = 0; i < modules.length; i++) {
                var ModuleData = await ModuleService.getModules({ group_name: { $in: Modules[i] } });
                var data = { group: modules[i], modules: ModuleData };
                modulesData.push(data);
            }
        }

        // Return the Modules list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: modulesData, message: "Modules received successfully!" });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getModule = async function (req, res, next) {
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var id = req.params.id;
    try {
        var module = await ModuleService.getModule(id)
        // Return the Users list with the appropriate HTTP password Code and Message.
        return res.status(200).json({ status: 200, flag: true, data: module, message: "Module received successfully!" });
    } catch (e) {
        //Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.getModulePermission = async function (req, res, next) {
    var roleId = req.roleId;
    // Check the existence of the query parameters, If doesn't exists assign a default value
    var slug = req.body.slug;
    try {
        var module = await ModuleService.getModuleBySlug(slug);
        if (module && module._id) {
            var Role = await RoleService.getRole(roleId);
            if (Role._id && Role.permission.length > 0) {
                var modData = Role.permission.filter(function (mode) {
                    return mode.module_id == module._id;
                });
                return res.status(200).json({ status: 200, flag: true, data: modData[0], message: "Module received successfully!" });
            }
        }

        return res.status(200).json({ status: 200, flag: false, message: "Module not found!" });
        // Return the Users list with the appropriate HTTP password Code and Message.
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message });
    }
}

exports.createModule = async function (req, res, next) {
    // console.log('req body',req.body)
    try {
        // Calling the Service function with the new object from the Request Body
        var createdModule = await ModuleService.createModule(req.body);
        return res.status(200).json({ status: 200, flag: true, data: createdModule, message: "Module created successfully!" })
    } catch (e) {
        // Return an Error Response Message with Code and the Error Message.
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.updateModule = async function (req, res, next) {
    // Id is necessary for the update
    if (!req.body._id) {
        return res.status(200).json({ status: 200, flag: false, message: "Id must be present!" })
    }

    try {
        var updatedModule = await ModuleService.updateModule(req.body)
        return res.status(200).json({ status: 200, flag: true, data: updatedModule, message: "Module updated successfully!" })
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}

exports.removeModule = async function (req, res, next) {
    var id = req.params.id;
    if (!id) {
        return res.status(200).json({ status: 200, flag: true, message: "Id must be present!" })
    }
    try {
        var deleted = await ModuleService.deleteModule(id);
        res.status(200).send({ status: 200, flag: true, message: "Successfully Deleted... " });
    } catch (e) {
        return res.status(200).json({ status: 200, flag: false, message: e.message })
    }
}
