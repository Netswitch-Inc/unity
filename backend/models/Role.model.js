var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var RoleSchema = new mongoose.Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' },
    name: String,
    group: String,
    priviledge: String,// super|admin|executive|governor|technologist
    is_super: Number,
    is_default: Number,
    permission: Object,
    status: Number, // 1|0
    deletedAt: Date
}, { timestamps: true })

RoleSchema.plugin(mongoosePaginate)
const Role = mongoose.model('roles', RoleSchema);

module.exports = Role;
