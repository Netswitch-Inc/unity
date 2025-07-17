var mongoose = require('mongoose');
const { Schema } = mongoose;

var CompanyComplianceControlSchema = new Schema({
    company_id: { type: Schema.Types.ObjectId, ref: "companies", default: null },
    user_id: { type: Schema.Types.ObjectId, ref: "users", default: null },
    compliance_priority_id: { type: Schema.Types.ObjectId, ref: "compliance_priorities", default: null },
    framework_id: { type: Schema.Types.ObjectId, ref: "frameworks", default: null },
    control_id: { type: Schema.Types.ObjectId, ref: "controls", default: null },
    project_id: { type: Schema.Types.ObjectId, ref: "projects", default: null },
    tool_icons: { type: String, default: "" },
    control_description: { type: String, default: "" },
    cis_control_descriptions: { type: Array },
    status: { type: Boolean, default: true },
    builder_status: { type: String, default: "" }, // reset
    deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false })

const CompanyComplianceControl = mongoose.model('company_compliance_controls', CompanyComplianceControlSchema);

module.exports = CompanyComplianceControl;
