const { isFalsy, sortBy } = require('../helper');
const Board = require('../models/board.model');
const Project = require('../models/project.model');
const { Task } = require('../models/task.model');
const { isBoardOwner } = require('./shared.service');

const ERROR_RESPONSE = {
	ok: false,
};

const isProjectOwner = async (projectId, userId) => !isFalsy(await Project.exists({ _id: projectId, userId }));

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
		let boardData = {};
		// TODO optimise the logic for fetching tasks
		const [project, boards, tasks] = await Promise.all([
			Project.findOne({ _id: projectId, userId }).lean(),
			Board.find({ userId, projectId }).lean().sort({ position: 'asc' }),
			Task.find({ user_id: userID, project_id: projectId }).lean(),
		]);

		if (boards?.length > 0) {
			boards.forEach((board) => {
				const boardTasks = sortBy(
					tasks?.filter((task) => task.board_id.toString() === board._id.toString()),
					'task_position',
				);

				boardData[board.board_position] = {
					...board,
					tasks: boardTasks,
				};
			});
		}
		return { ok: true, data: { ...project, boards: boardData } };
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
	// optimise the logic
	try {
		await Promise.all([
			Board.deleteMany({ projectId, user_id: userID }),
			Task.deleteMany({ project_id: projectID, user_id: userID }),
			Project.deleteOne({ _id: projectID, user_id: userID }),
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
