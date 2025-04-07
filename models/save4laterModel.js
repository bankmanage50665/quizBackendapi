const mongoose = require("mongoose");

const Save4LaterSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    quiz: {
      type: mongoose.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    savedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Prevent duplicate saves
Save4LaterSchema.index({ user: 1, quiz: 1 }, { unique: true });

module.exports = mongoose.model("Save4Later", Save4LaterSchema);
