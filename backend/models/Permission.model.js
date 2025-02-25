var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var PermissionSchema = new mongoose.Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' },
    module_id: { type: mongoose.Schema.Types.ObjectId, ref: 'modules' },
    role_id: { type: mongoose.Schema.Types.ObjectId, ref: 'roles' },
    can_all: Boolean,
    can_read: Boolean,
    can_create: Boolean,
    can_update: Boolean,
    can_delete: Boolean
}, { timestamps: true })

PermissionSchema.plugin(mongoosePaginate);
const Permission = mongoose.model('permissions', PermissionSchema);

module.exports = Permission;
