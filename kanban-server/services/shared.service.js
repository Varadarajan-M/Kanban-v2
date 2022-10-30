const {
  hashPassword,
  isFalsy,
  isSame,
  isStrFalsy,
  isPasswordMatching,
} = require('../helper');
const SharedProjectUsers = require('../models/shared.project.users.model');
const ERROR_RESPONSE = {
  ok: false,
};

const Board = require('../models/board.model');
const mongoose = require('mongoose');

exports.isBoardOwner = async (userId, boardId) =>
  !isFalsy(await Board.exists({ _id: boardId, user_id: userId }));

exports.fetchSharedProjects = async (userId, name) => {
  try {
    if (!userId) {
      return ERROR_RESPONSE;
    }
    let projects;
    if (!name) {
      projects = await SharedProjectUsers.aggregate([
        { $match: { users: { $in: [mongoose.Types.ObjectId(userId)] } } },
      ]);
    } else {
      projects = await SharedProjectUsers.find({
        name: { $regex: name, $options: 'i' },
      });
    }

    return { ok: true, projects };
  } catch (e) {
    console.log(e);
    return ERROR_RESPONSE;
  }
};
