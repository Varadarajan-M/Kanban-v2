const express = require('express');
const ProjectController = require('../controllers/project.controller');
const verifyAuth = require('../middlewares/auth');

const router = express.Router();

router.use('/project', router);

router.get('/', verifyAuth, ProjectController.get);

router.get('/:id', verifyAuth, ProjectController.getOne);

router.get('/:id/sharedusers', verifyAuth, ProjectController.getSharedUsers);


router.post('/', verifyAuth, ProjectController.create);

router.put('/save/:id', verifyAuth, ProjectController.saveChanges);

router.patch('/:id', verifyAuth, ProjectController.update);

router.delete('/:id', verifyAuth, ProjectController.delete);




module.exports = router;
