const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const OpenVASScanReportSchema = new mongoose.Schema({
  ip: { type: String, default: "" },
  hostname: { type: String, default: "" },
  port: { type: String, default: "" },
  port_protocol: { type: String, default: "" },
  cvss: { type: Number, default: 0 },
  severity: { type: String, default: "" },
  qod: { type: Number, default: "" }, // Value in %
  solution_type: { type: String, default: "" },
  nvt_name: { type: String, default: "" },
  summary: { type: String, default: "" },
  specific_result: { type: String, default: "" },
  nvt_oid: { type: String, default: "" },
  cves: { type: String, default: "" },
  task_id: { type: String, default: "" },
  task_name: { type: String, default: "" },
  timestamp: { type: Date, default: "" },
  result_id: { type: String, default: "" },
  impact: { type: String, default: "" },
  solution: { type: String, default: "" },
  affected_software_os: { type: String, default: "" },
  vulnerability_insight: { type: String, default: "" },
  vulnerability_detection_method: { type: String, default: "" },
  product_detection_result: { type: String, default: "" },
  bids: { type: String, default: "" },
  certs: { type: String, default: "" },
  other_references: { type: String, default: "" },
  deletedAt: Date,
}, { timestamps: true, versionKey: false })

OpenVASScanReportSchema.plugin(mongoosePaginate);
const OpenVASScanReport = mongoose.model("openvas_scan_reports", OpenVASScanReportSchema);

module.exports = OpenVASScanReport;
