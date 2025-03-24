const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const ZendeskSupportSchema = new mongoose.Schema({
    type: String,
    date: { type: Date, default: null },
    time: String,
    date_in_string: String,
    date_time: { type: Date, default: null },
    closed_request_content: { type: Object, default: null },
    open_request_content: { type: Object, default: null },
    received_request_content: { type: Object, default: null },
    status: { type: Boolean, default: true },
    deletedAt: { type: Date, default: null },
}, { timestamps: true });

ZendeskSupportSchema.plugin(mongoosePaginate);

const ZendeskSupport = mongoose.model('zendesk_supports', ZendeskSupportSchema);

module.exports = ZendeskSupport;
