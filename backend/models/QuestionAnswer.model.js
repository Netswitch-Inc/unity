var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var QuestionAnswerSchema = new mongoose.Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' },
    asessment_report_id: { type: mongoose.Schema.Types.ObjectId, ref: 'assessment_reports' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    section_id: { type: mongoose.Schema.Types.ObjectId, ref: 'sections' },
    question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'questions' },
    parent_question_id: { type: mongoose.Schema.Types.ObjectId, ref: 'questions' },
    question_data: Object,
    value: String,
    status: Number,
    deletedAt: Date
}, { timestamps: true })

QuestionAnswerSchema.plugin(mongoosePaginate);
const QuestionAnswer = mongoose.model('question_answers', QuestionAnswerSchema);

module.exports = QuestionAnswer;
