var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var ConnectionSchema = new mongoose.Schema({
    tool_slug: String,
    name: String,
    type: { type: String, unique: true },
    description: String,
    ip_address: String,
    port: String,
    username: String,
    password: String,
    is_connected: Boolean,
    is_default: Boolean,
    status: Boolean,
    deletedAt: Date
}, { timestamps: true })

ConnectionSchema.plugin(mongoosePaginate)
const Connection = mongoose.model('connections', ConnectionSchema)

module.exports = Connection;
