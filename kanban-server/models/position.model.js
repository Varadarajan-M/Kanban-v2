const mongoose = require("mongoose");

const positionSchema = new mongoose.Schema(
  {
    id: {
      type:  mongoose.Schema.Types.ObjectId,
      required: true,
    },
    seq: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Position = mongoose.model("Position", positionSchema);

module.exports = Position;
