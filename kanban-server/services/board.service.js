const Board = require('../models/board.model');
const ProjectService = require('./project.service');
const ERROR_RESPONSE = {
	ok: false,
};

exports.create = async function ({ name, projectId }, userId) {
	const projectOwner = await ProjectService.isProjectOwnerService(projectId, userId);
	if (!projectOwner) return ERROR_RESPONSE;

	try {
		// TODO implement board position logic here
		// const boardCount = await Board.find({
		// 	userId,
		// 	projectId,
		// }).count();
		const newBoard = await Board.create({
			name,
			projectId,
			// board_position: boardCount > 0 ? boardCount + 1 : 1,
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
