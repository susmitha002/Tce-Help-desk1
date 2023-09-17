const mongoose = require('mongoose')

const deletedUserSchema = new mongoose.Schema(
	{
		username: { type: String },
	},
	{ collection: 'deletedusers' }
)

const model = mongoose.model('deletedUserSchema', deletedUserSchema)

module.exports = model
