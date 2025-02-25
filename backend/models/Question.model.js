var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var QuestionSchema = new mongoose.Schema({
    assessment_id: { type: mongoose.Schema.Types.ObjectId, ref: 'assessments' },
    section_id: { type: mongoose.Schema.Types.ObjectId, ref: 'sections' },
    parent_question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'questions' },
    is_child: Boolean,
    question: String,
    description: String,
    option_type: String,
    options: Array,
    value: String,
    is_mandatory: Boolean,
    point: Number,
    order: Number,
    status: Number,
    deletedAt: Date
}, { timestamps: true })

QuestionSchema.plugin(mongoosePaginate);
const Question = mongoose.model('questions', QuestionSchema);

module.exports = Question;
