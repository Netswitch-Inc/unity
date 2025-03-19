var mongoose = require("mongoose");
var mongoosePaginate = require("mongoose-paginate");

var UserSchema = new mongoose.Schema({
  company_id: { type: mongoose.Schema.Types.ObjectId, ref: "companies" },
  role_id: { type: mongoose.Schema.Types.ObjectId, ref: "roles" },
  priviledges: Array,
  first_name: String,
  last_name: String,
  name: String,
  user_name: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, select: false },
  country_code: Object,
  phone: String,
  image: String,
  retry_count: Number,
  weightIndex: Number,
  status: Number,
  deletedAt: Date
}, { timestamps: true })

UserSchema.plugin(mongoosePaginate);
const User = mongoose.model("users", UserSchema);

module.exports = User;
