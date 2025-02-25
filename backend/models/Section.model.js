var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var SectionSchema = new mongoose.Schema({
    assessment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'assessments' },
    name: String,
    description: String,
    order: Number,
    status: Number,
    deletedAt: Date
}, { timestamps: true })

SectionSchema.plugin(mongoosePaginate);
const Section = mongoose.model('sections', SectionSchema);

module.exports = Section;
