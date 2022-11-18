const express = require("express");
const TaskController = require("../controllers/task.controller");
const TaskValidator = require("../validators/task.validator");
const { taskNameValidator } = require("../validators/task.validator");
const verifyAuth = require("../middlewares/auth");
const router = express.Router();

router.use("/task", router);

router.post(
  "/:id",
  verifyAuth,
  TaskValidator.validateTasks,
  TaskController.create
);

router
  .route("/:taskId/project/:projectId")
  .put(verifyAuth, taskNameValidator, TaskController.updateTask);

module.exports = router;
