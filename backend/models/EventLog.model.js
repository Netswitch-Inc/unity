var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var EventLogSchema = new mongoose.Schema({
    company_id: { type: mongoose.Schema.Types.ObjectId, ref: 'companies' },
    module_id: { type: mongoose.Schema.Types.ObjectId, ref: 'modules' },
    action_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    reference_id: { type: mongoose.Schema.Types.ObjectId },
    date_in_string: String,
    module_slug: String,
    type: String,
    action: String,
    description: String,
    previous_data: Object,
    current_data: Object,
    deletedAt: Date
}, { timestamps: true })

EventLogSchema.plugin(mongoosePaginate);
const EventLog = mongoose.model('event_logs', EventLogSchema);

module.exports = EventLog;
