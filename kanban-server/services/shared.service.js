const { isFalsy } = require('../helper');
const SharedProjectUsers = require('../models/shared.project.users.model');
const ERROR_RESPONSE = {
	ok: false,
};
const mongoose = require('mongoose');
const Board = require('../models/board.model');
const ProjectService = require('./project.service');
const Project = require('../models/project.model');
const { Task } = require('../models/task.model');

exports.isBoardOwner = async (userId, boardId) =>
	!isFalsy(await Board.exists({ _id: boardId, userId }));

exports.fetchSharedProjects = async (userId) => {
	try {
		const projects = await SharedProjectUsers.aggregate([
			{ $match: { users: { $in: [mongoose.Types.ObjectId(userId)] } } },
			{
				$project: { users: 0 },
			},
			{
				$lookup: {
					from: 'projects',
					localField: 'projectId',
					foreignField: '_id',
					as: 'project',
				},
			},
		]);

		return { ok: true, projects: projects.map((p) => p.project[0]) };
	} catch (e) {
		console.log(e);
		return ERROR_RESPONSE;
	}
};

exports.updateProjectWithSharedUsers = async (userId, projectId, users) => {
	try {
		const projectOwner = await ProjectService.isProjectOwnerService(
			projectId,
			userId,
		);
		if (!projectOwner) return ERROR_RESPONSE;

		const res = await SharedProjectUsers.updateOne(
			{ projectId },
			{ projectId, users },
			{ upsert: true },
		);
		return { ok: true, message: 'Shared Project Successfully' };
	} catch (e) {
		console.log(e);
		return ERROR_RESPONSE;
	}
};
exports.deleteProjectWithSharedUsers = async (userId, projectId) => {
	try {
		const projectOwner = await ProjectService.isProjectOwnerService(
			projectId,
			userId,
		);
		if (!projectOwner) return ERROR_RESPONSE;

		const res = await SharedProjectUsers.deleteMany({ projectId });
		return { ok: true, stauts: 201, res };
	} catch (e) {
		console.log(e);
		return ERROR_RESPONSE;
	}
};

exports.cloneProject = async (userId, projectId) => {
	try {
		const sharedUser = await SharedProjectUsers.exists({
			projectId,
			users: { $in: [mongoose.Types.ObjectId(userId)] },
		});

		if (!sharedUser) return ERROR_RESPONSE;

		const res = await ProjectService.getOne(projectId, userId);

		const projectDetails = res.ok && res.data;

		const clone = await ProjectService.create(
			{ name: `${projectDetails.name}_cloned` },
			userId,
		);

		const boards = Object.values(projectDetails.boards);

		const newBoards = boards.map((board) => ({
			name: board.name,
			projectId: clone.project._id,
			position: board.position ?? 0,
			userId,
		}));

		const insertedBoards = await Board.insertMany(newBoards);

		for (const [index, board] of insertedBoards.entries()) {
			const newTasks = boards[index].tasks?.map((task) => ({
				item: task.item,
				boardId: board._id,
				userId,
				position: task.position,
			}));

			!!newTasks.length && (await Task.insertMany(newTasks));
		}
		return { ok: true, message: 'Cloned successfully' };
	} catch (e) {
		console.log(e);
		return ERROR_RESPONSE;
	}
};

exports.removeProject = async (userId, projectId) => {
	try {
		const sharedUser = await SharedProjectUsers.exists({
			projectId,
			users: { $in: [mongoose.Types.ObjectId(userId)] },
		});

		if (!sharedUser) return ERROR_RESPONSE;

		const res = await SharedProjectUsers.updateOne(
			{ projectId },
			{ $pull: { users: mongoose.Types.ObjectId(userId) } },
		);

		return res?.modifiedCount > 0
			? { ok: true, message: 'You got removed successfully' }
			: ERROR_RESPONSE;
	} catch (e) {
		console.log(e);
		return ERROR_RESPONSE;
	}
};
