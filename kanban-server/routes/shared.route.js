const express = require("express");
const ShareController = require("../controllers/shared.controller");

const verifyAuth = require("../middlewares/auth");
const router = express.Router();

router.use("/shared", router);

router.route("/fetch").get(verifyAuth, ShareController.fetchSharedProjects);
router
  .route("/share/:id")
  .put(verifyAuth, ShareController.updateProjectWithSharedUsers);
router.route("/clone/:id").post(verifyAuth, ShareController.cloneProject);

router.route("/share/:id").delete(verifyAuth, ShareController.removeProject);
module.exports = router;
