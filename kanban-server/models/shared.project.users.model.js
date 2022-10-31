const mongoose = require('mongoose');
const User = require('./user.model');
const Project = require('./project.model');

const SharedProjectUsers = mongoose.model(
	'SharedProjectUsers',
	new mongoose.Schema({
		name: String,
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
