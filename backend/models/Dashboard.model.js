var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

var DashboardSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
  name: String,
  order: Number,
  show: Boolean,
  status: Number,
  deletedAt: Date
}, { timestamps: true })

DashboardSchema.plugin(mongoosePaginate);
const Dashboard = mongoose.model("dashboards", DashboardSchema);

module.exports = Dashboard;
