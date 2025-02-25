const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const WazuhIndexerSchema = new mongoose.Schema({
    type: String,
    date: Date,
    time: String,
    date_in_string: String,
    date_time: Date,
    low_severity_hits_count: Number,
    low_severity_hits_content: Object,
    medium_severity_hits_count: Number,
    medium_severity_hits_content: Object,
    high_severity_hits_count: Number,
    high_severity_hits_content: Object,
    critical_severity_hits_count: Number,
    critical_severity_hits_content: Object,
    status: Boolean,
    deletedAt: Date
}, { timestamps: true })

WazuhIndexerSchema.plugin(mongoosePaginate);
const WazuhIndexerStatistics = mongoose.model('wazuh_indexer_statistics', WazuhIndexerSchema);

module.exports = WazuhIndexerStatistics;
