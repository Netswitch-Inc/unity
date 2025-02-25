var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

var ProjectSchema = new mongoose.Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: "companies" },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    framework_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "frameworks" }],
    involved_parties: [{ type: mongoose.Schema.Types.ObjectId, ref: "users" }],
    submitted_by: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    name: String,
    description: String,
    cost_of_risk: Number,
    fix_cost_risk_ratio: Number,
    affected_scope: String,
    priority: String,
    fix_projected_cost: Number,
    likelyhood: Number,
    impact_assessment: Number,
    affected_risk: Number,
    status: String,
    deletedAt: Date
  }, { timestamps: true })

ProjectSchema.plugin(mongoosePaginate);
const Project = mongoose.model("projects", ProjectSchema);

module.exports = Project;
