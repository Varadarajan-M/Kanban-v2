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
			type:  mongoose.Schema.Types.ObjectId,
			ref: 'Project',
		},
	},
	{ timestamps: true },
);

const Board = mongoose.model('Board', BoardSchema);

module.exports = Board;
