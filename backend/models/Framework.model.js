var mongoose = require('mongoose');
var mongoosePaginate = require('mongoose-paginate');

var FrameworkSchema = new mongoose.Schema({
    reference_id: String,
    value: Number,
    label: String,
    slug: String,
    child_framework: String,
    status: Number,
    deletedAt: Date
}, { timestamps: true })

FrameworkSchema.plugin(mongoosePaginate);
const Framework = mongoose.model('frameworks', FrameworkSchema);

module.exports = Framework;
