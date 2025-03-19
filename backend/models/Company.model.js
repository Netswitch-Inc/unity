var mongoose = require('mongoose')
var mongoosePaginate = require('mongoose-paginate')

var CompanySchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    name: String,
    email: String,
    logo: String,
    country_code: Object,
    contact_no: String,
    address: String,
    header_color: String,
    footer_color: String,
    status: Number,
    deletedAt: Date
}, { timestamps: true })

CompanySchema.plugin(mongoosePaginate)
const Company = mongoose.model('companies', CompanySchema)

module.exports = Company;
