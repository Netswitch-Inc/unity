// Gettign the Newly created Mongoose Model we just created 
var Permission = require('../models/Permission.model');

// Saving the context of this module inside the _the variable
_this = this

// Async function to get the Permission List
exports.getPermissions = async function (query) {
    // Try Catch the awaited promise to handle the error 
    try {
        var permissions = await Permission.find(query)
            .populate({ path: 'company_id', select: { '_id': 1, 'name': 1 } })
            .populate({ path: 'role_id', select: { '_id': 1, 'name': 1 } })
            .populate({ path: 'module_id', select: { '_id': 1, 'group_name': 1, 'name': 1, 'slug': 1 } });

        // Return the Permissions list that was retured by the mongoose promise
        return permissions;
    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while Paginating Permissions');
    }
}

exports.getSimplePermissions = async function (query) {
    // Try Catch the awaited promise to handle the error 
    try {
        var permissions = await Permission.find(query);

        // Return the Permissions list that was retured by the mongoose promise
        return permissions;
    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while Paginating Permissions');
    }
}

exports.getPermissionss = async function (query, page, limit) {
    // Try Catch the awaited promise to handle the error 
    try {
        var _details = await Permission.findOne(query)
            .populate({ path: 'company_id', select: { '_id': 1, 'name': 1 } })
            .populate({ path: 'role_id', select: { '_id': 1, 'name': 1 } })
            .populate({ path: 'module_id', select: { '_id': 1, 'group_name': 1, 'name': 1, 'slug': 1 } });

        // Return the Permission list that was retured by the mongoose promise
        return _details;
    } catch (e) {
        // return a Error message describing the reason 
        throw Error('Error while Paginating Permissions');
    }
}

exports.getPermission = async function (id) {
    try {
        // Find the Data 
        var _details = await Permission.findOne({ _id: id })
            .populate({ path: 'company_id', select: { '_id': 1, 'name': 1 } })
            .populate({ path: 'role_id', select: { '_id': 1, 'name': 1 } })
            .populate({ path: 'module_id', select: { '_id': 1, 'group_name': 1, 'name': 1, 'slug': 1 } });
        if (_details._id) {
            return _details;
        } else {
            throw Error("Permission not available");
        }
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Permission not available");
    }
}

exports.createPermission = async function (permission) {
    var newPermission = new Permission({
        company_id: permission.company_id ? permission.company_id : null,
        role_id: permission.role_id ? permission.role_id : null,
        module_id: permission.module_id ? permission.module_id : null,
        can_all: permission.can_all ? permission.can_all : false,
        can_read: permission.can_read ? permission.can_read : false,
        can_create: permission.can_create ? permission.can_create : false,
        can_update: permission.can_update ? permission.can_update : false,
        can_delete: permission.can_delete ? permission.can_delete : false
    })

    try {
        // Saving the Permission 
        var savedPermission = await newPermission.save();
        return savedPermission;
    } catch (e) {
        // return a Error message describing the reason     
        throw Error("Error while Creating Permission");
    }
}

exports.updatePermission = async function (permission) {
    var id = permission._id;
    try {
        //Find the old Permission Object by the Id
        var oldPermission = await Permission.findById(id);
    } catch (e) {
        throw Error("Error occured while Finding the Permission");
    }

    // If no old Permission Object exists return false
    if (!oldPermission) { return false; }

    // Edit the Permission Object
    if (permission.company_id) {
        oldPermission.company_id = permission.company_id;
    }

    if (permission.role_id) {
        oldPermission.role_id = permission.role_id;
    }

    if (permission.module_id) {
        oldPermission.module_id = permission.module_id;
    }

    if (permission?.can_all || permission.can_all == false) {
        oldPermission.can_all = permission.can_all ? true : false;
    }

    if (permission?.can_read || permission.can_read == false) {
        oldPermission.can_read = permission.can_read ? true : false;
    }

    if (permission?.can_create || permission.can_create == false) {
        oldPermission.can_create = permission.can_create ? true : false;
    }

    if (permission?.can_update || permission.can_update == false) {
        oldPermission.can_update = permission.can_update ? true : false;
    }

    if (permission?.can_delete || permission.can_delete == false) {
        oldPermission.can_delete = permission.can_delete ? true : false;
    }

    try {
        var savedPermission = await oldPermission.save();
        return savedPermission;
    } catch (e) {
        throw Error("And Error occured while updating the Permission");
    }
}

exports.deletePermission = async function (id) {
    // Delete the Permission
    try {
        var deleted = await Permission.remove({ _id: id });
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Permission Could not be deleted");
        }

        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the Permission");
    }
}

exports.deletePermissionByRole = async function (role_id) {
    // Delete the Permission
    try {
        var deleted = await Permission.remove({ role_id: role_id });
        if (deleted.n === 0 && deleted.ok === 1) {
            throw Error("Permission Could not be deleted");
        }

        return deleted;
    } catch (e) {
        throw Error("Error Occured while Deleting the Permission");
    }
}
