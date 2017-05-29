const mongoose = require('mongoose')

const InquirySchema = new mongoose.Schema({
	name:{type:String, default: ''},
	email:{type:String, default: ''},
	phone:{type:String, default: ''},
	message:{type:String, default: ''},
	service:{type:String, default: ''},
	timestamp:{type:String, default:Date.now}
})

module.exports = mongoose.model('InquirySchema', InquirySchema)
