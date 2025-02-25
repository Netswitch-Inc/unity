const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ConfigurationAssessmentSchema = new mongoose.Schema({
    agent_ref_id: String,
    policy_id: String,
    name: String,
    references: String,
    invalid: Number,
    description: String,
    hash_file: String,
    total_checks: Number,
    pass: Number,
    fail: Number,
    score: Number,
    date_in_string: String,
    start_scan: Date,
    end_scan: Date,
    deletedAt: Date
}, { timestamps: true });

ConfigurationAssessmentSchema.plugin(mongoosePaginate);

const ConfigurationAssessment = mongoose.model('configuration_assessments', ConfigurationAssessmentSchema);

module.exports = ConfigurationAssessment;
