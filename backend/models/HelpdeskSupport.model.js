const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const HelpdeskSupportSchema = new mongoose.Schema({
    type: String,
    date: { type: Date, default: null },
    time: String,
    date_in_string: String,
    date_time: { type: Date, default: null },
    closed_request_content: { type: Object, default: null },
    open_request_content: { type: Object, default: null },
    received_request_content: { type: Object, default: null },
    request_summary_content: { type: Object, default: null },
    sla_violated_request_content: { type: Object, default: null },
    status: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

HelpdeskSupportSchema.plugin(mongoosePaginate);

const HelpdeskSupport = mongoose.model('helpdesk_supports', HelpdeskSupportSchema);

module.exports = HelpdeskSupport;
