const mongoose = require("mongoose");

const QuizSchema = new mongoose.Schema(
  {
    question: {
      type: String,
      required: [true, "Question is required"],
      trim: true,
    },
    options: {
      type: [String],
      required: [true, "Options are required"],
      validate: {
        validator: function (v) {
          return v.length === 4; // Ensuring we have exactly 4 options
        },
        message: "Quiz must have exactly 4 options",
      },
    },
    correctAnswer: {
      type: String,
      required: [true, "Correct answer is required"],
      validate: {
        validator: function (v) {
          return this.options.includes(v); // Ensuring correct answer is one of the options
        },
        message: "Correct answer must be one of the provided options",
      },
    },
    subject: {
      type: String,
      required: [true, "Subject is required"],
      trim: true,
    },
    difficulty: {
      type: String,
      required: [true, "Difficulty level is required"],
      enum: ["easy", "medium", "hard"],
      default: "medium",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false, // Optional if you want to track who created the quiz
    },
    like: { type: String },
  },
  { timestamps: true }
);

// Adding index for faster queries
QuizSchema.index({ subject: 1, difficulty: 1 });

const Quiz = mongoose.model("Quiz", QuizSchema);
module.exports = Quiz;
