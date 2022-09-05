const express = require('express');

const projectRouter = require('./project.route');
const boardRouter = require('./board.route');
const sharedRouter = require('./shared.route');
const taskRouter = require('./task.route');
const userRouter = require('./user.route');

const router = express.Router();

router.use('/', projectRouter);
router.use('/', boardRouter);
router.use('/', sharedRouter);
router.use('/', taskRouter);
router.use('/', userRouter);

module.exports = router;
