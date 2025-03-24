var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var CronSchedulerErrorSchema = new mongoose.Schema({
    connection_id: { type: mongoose.Schema.Types.ObjectId, ref: 'connections' },
    cron_scheduler_id: { type: mongoose.Schema.Types.ObjectId, ref: 'cron_schedulers' },
    tool_slug: String,
    date: Date,
    slug: String,
    cron_style: String, /* input or editor value */
    cron_style_disabled: Boolean, /* disable cron style input or editor */
    description: String,
    error_logs: Object,
    status: Boolean,
    deletedAt: Date
}, { timestamps: true })

CronSchedulerErrorSchema.plugin(mongoosePaginate)
const CronSchedulerError = mongoose.model('cron_scheduler_errors', CronSchedulerErrorSchema)

module.exports = CronSchedulerError;
