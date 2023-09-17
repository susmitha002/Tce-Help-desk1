const mongoose = require('mongoose')

const FeedbackSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true ,unique: true},
        phone: { type : String, required:true},
        msg: {type :String, required:true}
	},
	{ collection: 'feedback' }
)

const model1 = mongoose.model('FeedbackSchema', FeedbackSchema)

module.exports = model1
