const { sendSuccessPayload, throwError, sendError } = require("../helper");
const UserService = require("../services/user.service");

exports.register = async (req, res) => {
  const registered = await UserService.register(req.body);
  if (registered.ok) {
    sendSuccessPayload(res, { user: registered.user }, 201);
  } else {
    const userExistErr = throwError("Cannot Create a User", 400);
    sendError(res, userExistErr);
  }
};
exports.login = async function (req, res) {
  const loggedin = await UserService.login(req.body);
  if (loggedin.ok) {
    sendSuccessPayload(res, loggedin.user, 200);
  } else {
    const invalidUserErr = throwError("Cannot login", 400);
    sendError(res, invalidUserErr);
  }
};

exports.fetchUsers = async function (req, res) {
  const users = await UserService.fetchUsers(req.query.name);
  if (users.users.length >= 0) {
    sendSuccessPayload(res, users.users, 200);
  } else {
    const cannotFetchErr = throwError("Cannot fetch users", 400);
    sendError(res, cannotFetchErr);
  }
};
