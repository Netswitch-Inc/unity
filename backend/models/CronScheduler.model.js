var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var CronSchedulerSchema = new mongoose.Schema({
    tool_slug: String,
    name: String,
    type: String,
    slug: { type: String, unique: true },
    cron_style: String, /* input or editor value */
    cron_style_disabled: Boolean, /* disable cron style input or editor */
    description: String,
    is_default: Boolean,
    status: Boolean,
    deletedAt: Date
}, { timestamps: true })

CronSchedulerSchema.plugin(mongoosePaginate)
const CronScheduler = mongoose.model('cron_schedulers', CronSchedulerSchema)

module.exports = CronScheduler;
