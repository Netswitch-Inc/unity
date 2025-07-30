var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var ControlSchema = new mongoose.Schema({
    framework_id: { type: mongoose.Schema.Types.ObjectId, ref: 'frameworks' },
    cis_control_id: [{ type: mongoose.Schema.Types.ObjectId, ref: 'cis_controls' }],
    reference_id: String,
    identifier: String,
    name: String,
    impact: String,
    priority: String,
    description: String,
    ai_description: String,
    icon: String,
    relation: String,
    status: Number,
    deletedAt: Date
}, { timestamps: true })

ControlSchema.plugin(mongoosePaginate);
const Control = mongoose.model('controls', ControlSchema);

module.exports = Control;
