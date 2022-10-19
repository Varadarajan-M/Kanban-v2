const express = require('express');
const BoardController = require('../controllers/board.controller');
const verifyAuth = require('../middlewares/auth');
const { boardNameValidator } = require('../validators/board.validator');

const router = express.Router();

router.use('/board', router);

router.post('/:projectId', boardNameValidator, verifyAuth, BoardController.create);

router.patch('/:projectId/:boardId', boardNameValidator, verifyAuth, BoardController.update);

module.exports = router;