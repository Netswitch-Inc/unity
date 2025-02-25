var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

var CommentsSchema = new mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "companies" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  description: String,
  status: Number,
  date: Date,
  deletedAt: Date
}, { timestamps: true })

CommentsSchema.plugin(mongoosePaginate);
const Comment = mongoose.model("comments", CommentsSchema);

module.exports = Comment;
