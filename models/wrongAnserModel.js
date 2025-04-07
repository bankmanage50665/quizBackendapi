const mongoose = require("mongoose");

const WrongAnswerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: [true, "Quiz ID is required"],
    },
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
      trim: true,
    },
    wrongAnswer: {
      type: String,
      required: [true, "Wrong answer is required"],
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    resolved: {
      type: Boolean,
      default: false,
    },
    resolvedAt: {
      type: Date,
      default: null,
    }
  },
  { timestamps: true }
);

// Add compound index for faster user-specific queries
WrongAnswerSchema.index({ userId: 1, quizId: 1 });

const WrongAnswer = mongoose.model("WrongAnswer", WrongAnswerSchema);
module.exports = WrongAnswer;