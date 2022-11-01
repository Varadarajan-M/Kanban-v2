const mongoose = require('mongoose');

const SharedProjectUsers = mongoose.model(
	'SharedProjectUsers',
	new mongoose.Schema({
		projectId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Project',
			unique: true,
		},
		users: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
			},
		],
	}),
);

module.exports = SharedProjectUsers;
