const { Task } = require("../models/task.model");
const ShareService = require("./shared.service");
const ProjectService = require("./project.service");
const ERROR_RESPONSE = {
  ok: false,
};
exports.create = async function ({ item }, boardId, userId) {
  const boardOwner = await ShareService.isBoardOwner(userId, boardId);
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

exports.update = async function (taskId, projectId, userId, item) {
  const projectOwner = await ProjectService.isProjectOwnerService(
    projectId,
    userId
  );

  if (!projectOwner) return ERROR_RESPONSE;
  try {
    const updatedData = await Task.updateOne({ _id: taskId }, { item });
    if (updatedData.modifiedCount > 0) {
      return { ok: true, message: "Updated successfully" };
    }
  } catch (e) {
    console.log(e);
    return ERROR_RESPONSE;
  }
};
