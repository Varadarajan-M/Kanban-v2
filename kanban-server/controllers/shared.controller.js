const { sendSuccessPayload, throwError, sendError } = require("../helper");
const SharedService = require("../services/shared.service");
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

exports.updateProjectWithSharedUsers = async function (req, res) {
  const resp = await SharedService.updateProjectWithSharedUsers(
    req.user.userID,
    req.params?.id,
    req.body?.users ?? []
  );
  if (resp.ok) {
    sendSuccessPayload(res, resp, 200);
  } else {
    const cannotShareErr = throwError("Cannot share project", 400);
    sendError(res, cannotShareErr);
  }
};

exports.cloneProject = async function (req, res) {
  const resp = await SharedService.cloneProject(
    req.user.userID,
    req.params?.id
  );
  if (resp.ok) {
    sendSuccessPayload(res, resp.message, 201);
  } else {
    const cannotShareErr = throwError("Cannot clone project", 400);
    sendError(res, cannotShareErr);
  }
};

exports.removeProject = async function (req, res) {
  const resp = await SharedService.removeProject(
    req.user.userID,
    req.params?.id
  );
  if (resp.ok) {
    sendSuccessPayload(res, resp.message, 201);
  } else {
    const cannotShareErr = throwError("Cannot delete project", 400);
    sendError(res, cannotShareErr);
  }
};
