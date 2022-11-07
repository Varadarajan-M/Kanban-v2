const express = require("express");
const UserController = require("../controllers/user.controller");
const UserValidator = require("../validators/user.validator");
const router = express.Router();
const verifyAuth = require("../middlewares/auth");
router.use("/user", router);

router.route("/register").post(UserValidator.register, UserController.register);

router.route("/login").post(UserValidator.login, UserController.login);

router.route("/fetch").get(verifyAuth, UserController.fetchUsers);

router.route("/fetch/:id").get(verifyAuth, UserController.getOneUser);

module.exports = router;
