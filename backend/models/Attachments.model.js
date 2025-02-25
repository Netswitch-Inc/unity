var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

var AttachmentSchema = new mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "companies" },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
  project_id: { type: mongoose.Schema.Types.ObjectId, ref: "projects" },
  name: String,
  file_name: String,
  extension: String,
  file_size: Number,
  file_path: String,
  status: Number,
  deletedAt: Date
}, { timestamps: true })

AttachmentSchema.plugin(mongoosePaginate);
const Attachment = mongoose.model("attachments", AttachmentSchema);

module.exports = Attachment;
