const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const NetswitchThreatIntelStatsSchema = new mongoose.Schema({
  stats_data: Array,
  date_in_string: { type: String, default: "" },
  date: { type: Date, default: null },
  date_time: { type: Date, default: null },
  status: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false })

NetswitchThreatIntelStatsSchema.plugin(mongoosePaginate);
const NetswitchThreatIntelStats = mongoose.model("netswitch_threat_intel_statistics", NetswitchThreatIntelStatsSchema);

module.exports = NetswitchThreatIntelStats;
