const express = require('express');
const { isProduction } = require('../helper');
const Board = require('../models/board.model');
const Project = require('../models/project.model');
const { Task } = require('../models/task.model');
const ShareController = require('../controllers/shared.controller');

const User = require('../models/user.model');
const verifyAuth = require('../middlewares/auth');
const router = express.Router();

router.use('/shared', router);

router.route('/fetch').get(verifyAuth, ShareController.fetchSharedProjects);

module.exports = router;
