var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

var AssessmentReportSchema = new mongoose.Schema({
  assessment_id: { type: mongoose.Schema.Types.ObjectId, ref: "assessments" },
  assessment_data: Object,
  group_data: Array,
  name: String,
  first_name: String,
  last_name: String,
  company_name: String,
  email: String,
  mobile: String,
  email_code: { type: String, select: false },
  mobile_code: { type: String, select: false },
  business_type: String,
  team_size: Number,
  operation_description: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  country: String,
  zipcode: String,
  total: Number,
  pass: Number,
  fail: Number,
  invalid: Number,
  score: Number,
  pdf_path: String,
  email_verified: Boolean,
  mobile_verified: Boolean,
  status: Number,
  deletedAt: Date
}, { timestamps: true })

AssessmentReportSchema.plugin(mongoosePaginate);
const AssessmentReport = mongoose.model("assessment_reports", AssessmentReportSchema);

module.exports = AssessmentReport;
