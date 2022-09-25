const Board = require('../models/board.model');
const ProjectService = require('./project.service');
const ERROR_RESPONSE = {
	ok: false,
};

exports.create = async function (projectId, { name }, userId) {
	const projectOwner = await ProjectService.isProjectOwnerService(projectId, userId);
	if (!projectOwner) return ERROR_RESPONSE;

	try {
		// TODO: To be refactored with position schema
		const boardCount = await Board.find({
			userId,
			projectId,
		}).count();
		const newBoard = await Board.create({
			name,
			projectId,
			position: boardCount > 0 ? boardCount + 1 : 1,
			userId,
		});
		return {
			ok: true,
			board: newBoard,
		};
	} catch (err) {
		console.log(err);
		return ERROR_RESPONSE;
	}
};

exports.update = async function (id, { name }, userId) {
	try {
		const updatedData = await Board.updateOne({ _id: id, userId }, { name, userId });
		if (updatedData.modifiedCount > 0) {
			return { ok: true, message: 'Updated successfully' };
		}
		return ERROR_RESPONSE;
	} catch (err) {
		return ERROR_RESPONSE;
	}
};
