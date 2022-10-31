const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		hash: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
	},
	{ timeStamps: true },
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
