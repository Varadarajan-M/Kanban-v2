const { isFalsy, sortBy } = require('../helper');
const Board = require('../models/board.model');
const Project = require('../models/project.model');
const { Task } = require('../models/task.model');
const { isBoardOwner } = require('./shared.service');

const mongoose = require('mongoose');

const ERROR_RESPONSE = {
	ok: false,
};

const isProjectOwner = async (projectId, userId) => !isFalsy(await Project.exists({ _id: projectId, userId }));

const formatProject = (data) => {
	let projectDetails = {};
	Object.keys(data).forEach((key) => {
		if (key !== 'boardInfo' && key !== 'taskInfo') projectDetails[key] = data[key];
	});
	const boards = Object.fromEntries(
		data.boardInfo.map((board) => {
			board.tasks = sortBy(
				data.taskInfo.filter((task) => task.boardId?.toString() === board._id?.toString()),
				'position',
			);
			return [board.position, board];
		}),
	);
	return { ...projectDetails, boards };
};

exports.isProjectOwnerService = isProjectOwner;

exports.get = async function (userId) {
	try {
		return {
			ok: true,
			projects: await Project.find({ userId }).lean(),
		};
	} catch (e) {
		console.log(e);
		return ERROR_RESPONSE;
	}
};

exports.getOne = async function (projectId, userId) {
	const projectOwner = await isProjectOwner(projectId, userId);
	if (!projectOwner) return ERROR_RESPONSE;

	try {
		const projectDetails = await Project.aggregate([
			{ $match: { userId: mongoose.Types.ObjectId(userId), _id: mongoose.Types.ObjectId(projectId) } },
			{ $lookup: { from: 'boards', localField: '_id', foreignField: 'projectId', as: 'boardInfo' } },
			{ $lookup: { from: 'tasks', localField: 'boardInfo._id', foreignField: 'boardId', as: 'taskInfo' } },
		]);
		return { ok: true, data: formatProject(projectDetails[0]) };
	} catch (error) {
		console.log(error);
		return ERROR_RESPONSE;
	}
};

exports.create = async function (projectDets, userId) {
	try {
		const newProject = await Project.create({
			...projectDets,
			userId,
		});
		return {
			ok: true,
			project: newProject,
		};
	} catch (e) {
		console.log(e);
		return ERROR_RESPONSE;
	}
};
exports.update = async function (projectId, { name }, userId) {
	const projectOwner = await isProjectOwner(projectId, userId);

	if (!projectOwner) return ERROR_RESPONSE;
	try {
		const updatedData = await Project.updateOne({ _id: projectId, userId }, { name, userId });
		if (updatedData.modifiedCount > 0) {
			return { ok: true, message: 'Updated successfully' };
		}
	} catch (e) {
		console.log(e);
		return ERROR_RESPONSE;
	}
};
exports.delete = async function (projectId, userId) {
	const projectOwner = await isProjectOwner(projectId, userId);
	if (!projectOwner) return ERROR_RESPONSE;

	try {
		const boards = (await Board.find({ projectId, userId }, { _id: 1 }).lean()).map((b) => b._id);
		await Promise.all([
			Board.deleteMany({ projectId, userId }),
			Task.deleteMany({ boardId: { $in: boards }, userId }),
			Project.deleteOne({ _id: projectId, userId }),
		]);
		return {
			ok: true,
			message: 'Project deleted successfully.',
		};
	} catch (e) {
		console.log(e);
		return ERROR_RESPONSE;
	}
};

exports.saveChanges = async function (updatedTasks, deletedStack, userId, projectId) {
	const projectOwner = await isProjectOwner(projectId, userId);
	if (!projectOwner) return ERROR_RESPONSE;

	// TODO - Look through this for anything missing

	try {
		await Promise.all(
			updatedTasks?.map(async (task) => {
				if (await isBoardOwner(userId, task?.boardId)) {
					return Task.updateOne({ _id: task._id, userId, projectId }, task);
				}
			}),
		);
		if (deletedStack.hasOwnProperty('boards') && deletedStack?.boards.length > 0) {
			await Promise.all(
				deletedStack.boards.map(async (board, i) => {
					i === 0 && (await Task.deleteMany({ boardId: board._id }));
					return Board.deleteOne({ _id: board._id, userId });
				}),
			);
		}
		if (deletedStack.hasOwnProperty('tasks') && deletedStack?.tasks.length > 0) {
			await Promise.all(
				deletedStack?.tasks?.map((task) => {
					return Task.deleteOne({ _id: task._id, userId });
				}),
			);
		}
		return { ok: true, message: 'Saved changes successfully' };
	} catch (e) {
		console.log('Error: ' + e.message);
		return ERROR_RESPONSE;
	}
};
