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
      type:  mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Board",
    },
    userId: {
      type:  mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

module.exports = {
  TaskSchema,
  Task,
};
