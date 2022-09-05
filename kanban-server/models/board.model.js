const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
		position: {
			type: Number,
		},
		projectId: {
			type: mongoose.Types.ObjectId,
			ref: 'Project',
		},
	},
	{ timestamps: true },
);

const Board = mongoose.model('Boards', BoardSchema);

module.exports = Board;
