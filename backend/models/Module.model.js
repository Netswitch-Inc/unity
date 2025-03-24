var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var ModuleSchema = new mongoose.Schema({
    group_name: String,
    tool_slug: String,
    name: String,
    slug: String,
    is_super: Number,
    status: Number
}, { timestamps: true })

ModuleSchema.plugin(mongoosePaginate);
const Module = mongoose.model('modules', ModuleSchema);

module.exports = Module;
