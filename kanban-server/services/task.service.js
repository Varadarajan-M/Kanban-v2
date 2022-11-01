const { Task } = require('../models/task.model');
const ProjectService = require('./project.service');
const ShareService = require('./shared.service');
const { isBoardOwner } = ShareService;

const ERROR_RESPONSE = {
	ok: false,
};
exports.create = async function ({ item }, boardId, userId) {
	const boardOwner = await isBoardOwner(userId, boardId);
	if (!boardOwner) return ERROR_RESPONSE;
	try {
		const taskCount = await Task.find({
			boardId,
			userId,
		}).count();
		const newTask = await Task.create({
			item,
			boardId,
			position: taskCount > 0 ? taskCount : 0,
			userId,
		});
		return {
			ok: true,
			task: newTask,
		};
	} catch (error) {
		console.log(error);
		return ERROR_RESPONSE;
	}
};
