const { isFalsy } = require('../helper');
const SharedProjectUsers = require('../models/shared.project.users.model');
const ERROR_RESPONSE = {
	ok: false,
};
const mongoose = require('mongoose');
const Board = require('../models/board.model');
const ProjectService = require('./project.service');

exports.isBoardOwner = async (userId, boardId) => !isFalsy(await Board.exists({ _id: boardId, user_id: userId }));

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
		const projectOwner = await ProjectService.isProjectOwnerService(projectId, userId);
		if (!projectOwner) return ERROR_RESPONSE;

		const res = await SharedProjectUsers.updateOne({ projectId }, { projectId, users }, { upsert: true });
		return { ok: true, message: 'Shared Project Successfully' };
	} catch (e) {
		console.log(e);
		return ERROR_RESPONSE;
	}
};
