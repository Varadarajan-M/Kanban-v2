const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			default: 'Untitled project',
		},
		userId: {
			type: mongoose.Types.ObjectId,
			required: true,
			ref: 'User',
		},
	},
	{ timestamps: true },
);

const Project = mongoose.model('Project', ProjectSchema);

module.exports = Project;
