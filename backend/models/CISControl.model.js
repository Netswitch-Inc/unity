var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var CISControlSchema = new mongoose.Schema({
    framework_id: { type: mongoose.Schema.Types.ObjectId, ref: 'frameworks' },
    control_id: { type: mongoose.Schema.Types.ObjectId, ref: 'controls' },
    reference_id: String,
    cis_control: Number,
    cis_sub_control: Number,
    control_num: String,
    asset_type: String,
    security_function: String,
    name: String,
    relationship: String,
    description: String,
    tool_icon: String,
    status: Number,
    deletedAt: Date
}, { timestamps: true })

CISControlSchema.plugin(mongoosePaginate);
const CISControl = mongoose.model('cis_controls', CISControlSchema);

module.exports = CISControl;
