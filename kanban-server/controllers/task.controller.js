const TaskService = require("../services/task.service");
const { sendSuccessPayload, throwError, sendError } = require("../helper");

exports.create = async (req, res) => {
  const newTask = await TaskService.create(
    req.body,
    req.params?.id,
    req?.user?.userID
  );
  if (newTask.ok) {
    sendSuccessPayload(res, newTask.task, 200);
  } else {
    const CANNOT_CREATE_TASK_ERR = throwError("Cannot create task", 400);
    sendError(res, CANNOT_CREATE_TASK_ERR);
  }
};

exports.updateTask = async (req, res) => {
  try {
    if (!!req.params.taskId && !!req.params.projectId && !!req.body.item) {
      const isTaskUpdated = await TaskService.update(
        req.params.taskId,
        req.params.projectId,
        req.user.userID,
        req.body.item
      );
      if (isTaskUpdated?.ok) {
        sendSuccessPayload(res, isTaskUpdated.message, 200);
      } else {
        const CANNOT_UPDATE_PROJECT_ERR = throwError("Cannot update Task", 400);
        sendError(res, CANNOT_UPDATE_PROJECT_ERR);
      }
    }
  } catch (error) {
    const CANNOT_UPDATE_PROJECT_ERR = throwError(error.message, 400);
    sendError(res, CANNOT_UPDATE_PROJECT_ERR);
  }
};
