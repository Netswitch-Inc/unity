var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var SettingSchema = new mongoose.Schema({
  group_name: String,
  name: String,
  slug: { type: String, required: true, unique: true },
  type: String,
  value: String,
  options: { type: Array, default: null },
  deletedAt: Date
}, { timestamps: true })

SettingSchema.plugin(mongoosePaginate);
const Setting = mongoose.model('settings', SettingSchema);

module.exports = Setting;
