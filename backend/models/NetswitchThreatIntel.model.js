const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const NetswitchThreatIntelSchema = new mongoose.Schema({
  ip_address: { type: String, default: "" },
  as_number: { type: String, default: "" },
  company: { type: String, default: "" },
  country: { type: String, default: "" },
  time: { type: String, default: "" },
  date_in_string: { type: String, default: "" },
  date: { type: Date, default: null },
  date_time: { type: Date, default: null },
  status: { type: Boolean, default: true },
  deletedAt: { type: Date, default: null }
}, { timestamps: true, versionKey: false })

NetswitchThreatIntelSchema.plugin(mongoosePaginate);
const NetswitchThreatIntel = mongoose.model("netswitch_threat_intels", NetswitchThreatIntelSchema);

module.exports = NetswitchThreatIntel;
