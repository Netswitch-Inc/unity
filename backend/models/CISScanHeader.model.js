var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

const CISScanHeaderSchema = new mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "companies" },
  hostname: String,
  filename: String,
  originalfile: String,
  scanned_date: Date,
  total: Number,
  pass: Number,
  fail: Number,
  error: Number,
  unknown: Number,
  man: Number,
  max: Number,
  score: Number,
  upload_date: Date,
  profile: String,
  ip: String,
  percentage: Number,
  scan_id: Number,
  is_deleted: Number
}, { timestamps: true })

CISScanHeaderSchema.plugin(mongoosePaginate);
const CISScanHeader = mongoose.model("cis_scan_headers", CISScanHeaderSchema);

module.exports = CISScanHeader;
