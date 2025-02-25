var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var CompanyComplianceControlSchema = new mongoose.Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' },
    framework_id: { type: mongoose.Schema.Types.ObjectId, ref: 'frameworks' },
    control_id: { type: mongoose.Schema.Types.ObjectId, ref: 'controls' }
}, { timestamps: true })

CompanyComplianceControlSchema.plugin(mongoosePaginate);
const CompanyComplianceControl = mongoose.model('company_compliance_controls', CompanyComplianceControlSchema);

module.exports = CompanyComplianceControl;
