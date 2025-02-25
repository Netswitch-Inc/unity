const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const AgentSchema = new mongoose.Schema({
    ref_id: String,
    os: { type: Object, default: null },
    group: { type: Array, default: null },
    name: String,
    ip: String,
    registerIP: String,
    version: String,
    node_name: String,
    manager: String,
    mergedSum: String,
    configSum: String,
    dateAdd: String,
    lastKeepAlive: String,
    disconnection_time: String,
    group_config_status: String,
    status: String,
    status_code: { type: Number, default: 0 },
    deletedAt: Date
}, { timestamps: true });

AgentSchema.plugin(mongoosePaginate);

const Agent = mongoose.model('agents', AgentSchema);

module.exports = Agent;
