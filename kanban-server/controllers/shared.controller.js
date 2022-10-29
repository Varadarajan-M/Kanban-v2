const { sendSuccessPayload, throwError, sendError } = require("../helper");
const verifyAuth = require("../middlewares/auth");
const SharedService = require("../services/shared.service");
// const verifyAuth = require("../middlewares/auth");
//fetch shared project
exports.fetchSharedProjects = async function (req, res) {
  const projects = await SharedService.fetchSharedProjects(
    req.user.userID,
    req.query.name
  );
  if (projects.ok) {
    sendSuccessPayload(res, projects.projects, 200);
  } else {
    const cannotFetchErr = throwError("Cannot fetch users", 400);
    sendError(res, cannotFetchErr);
  }
};
