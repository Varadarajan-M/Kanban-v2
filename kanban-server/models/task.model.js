const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },
    position: {
      type: Number,
    },
    boardId: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Board",
    },
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Tasks", TaskSchema);

module.exports = {
  TaskSchema,
  Task,
};
