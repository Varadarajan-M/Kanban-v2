const mongoose = require('mongoose');

const SharedProjectUsers = mongoose.model(
  'sharedProjectUsers',
  new mongoose.Schema({
    name: String,
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  })
);

module.exports = SharedProjectUsers;
