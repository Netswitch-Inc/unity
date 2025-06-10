var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var AssessmentSchema = new mongoose.Schema({
    name: String,
    description: String,
    order: Number,
    show_score_calculation: Boolean,
    additional_description: String,
    status: Number,
    deletedAt: Date
}, { timestamps: true })

AssessmentSchema.plugin(mongoosePaginate);
const Assessment = mongoose.model('assessments', AssessmentSchema);

module.exports = Assessment;
