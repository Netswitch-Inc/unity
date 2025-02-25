var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

var ProjectHistorySchema = new mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "companies" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  description: String,
  type: String,
  status: Number,
  date: Date,
  deletedAt: Date
}, { timestamps: true })

ProjectHistorySchema.plugin(mongoosePaginate);
const ProjectHistory = mongoose.model("project_histories", ProjectHistorySchema);

module.exports = ProjectHistory;
