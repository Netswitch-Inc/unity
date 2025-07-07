var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var SettingSchema = new mongoose.Schema({
  options: { type: Array, default: null },
  group_name: String,
  name: String,
  slug: { type: String, required: true, unique: true },
  type: String,
  note: String,
  value: String,
  disabled: { type: Boolean },
  deletedAt: Date
}, { timestamps: true, versionKey: false })

SettingSchema.plugin(mongoosePaginate);
const Setting = mongoose.model('settings', SettingSchema);

module.exports = Setting;
