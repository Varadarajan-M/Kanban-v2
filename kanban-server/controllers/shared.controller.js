const { sendSuccessPayload, throwError, sendError } = require('../helper');
const SharedService = require('../services/shared.service');

//fetch shared project
exports.fetchSharedProjects = async function (req, res) {
  const projects = await SharedService.fetchSharedProjects(req.query.name);
  if (projects.ok) {
    sendSuccessPayload(res, projects.projects, 200);
  } else {
    const cannotFetchErr = throwError('Cannot fetch users', 400);
    sendError(res, cannotFetchErr);
  }
};
