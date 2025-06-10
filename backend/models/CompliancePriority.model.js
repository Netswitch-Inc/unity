var mongoose = require('mongoose');
const { Schema } = mongoose;

var CompliancePrioritySchema = new Schema({
    company_id: { type: Schema.Types.ObjectId, ref: "companies", default: null },
    user_id: { type: Schema.Types.ObjectId, ref: "users", default: null },
    name: { type: String, default: "" },
    description: { type: String, default: "" },
    status: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false })

const CompliancePriority = mongoose.model('compliance_priorities', CompliancePrioritySchema);

module.exports = CompliancePriority;
