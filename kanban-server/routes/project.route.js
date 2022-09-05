const express = require("express");
const ProjectController = require("../controllers/project.controller");
const verifyAuth = require("../middlewares/auth");

const router = express.Router();

router.use("/project", router);

router.get("/", verifyAuth, ProjectController.get);

router.get("/:id", verifyAuth, ProjectController.getOne);

router.post("/create", verifyAuth, ProjectController.create);

router.post("/save/:id", verifyAuth, ProjectController.saveChanges);

router.put("/:id", verifyAuth, ProjectController.update);

router.delete("/:id", verifyAuth, ProjectController.delete);

module.exports = router;
