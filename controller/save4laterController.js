const mongoose = require("mongoose");
const Quiz = require("../models/quizModel");

const Save4Later = require("../models/save4laterModel");
const User = require("../models/userModel");

// Save a quiz for later
exports.saveQuiz = async (req, res) => {
  try {
    const { userId, quizId } = req.body;

    // Check if already saved
    const existingSave = await Save4Later.findOne({
      user: userId,
      quiz: quizId,
    });
    if (existingSave) {
      return res.status(400).json({ message: "Quiz already saved for later" });
    }

    // Create new save
    const savedQuiz = new Save4Later({
      user: userId,
      quiz: quizId,
    });

    

    await savedQuiz.save();

    // Update user's save4Later array
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { save4Later: quizId } },
      { new: true }
    );

    res.status(201).json(savedQuiz);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSavedQuizzes = async (req, res) => {
  try {
    const { userId } = req.params;

    // Validate userId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({
        success: false,
        message: "Valid user ID is required",
      });
    }

    // Find all saved items for this user and FULLY populate quiz details
    const savedQuizzes = await Save4Later.find({ user: userId })
      .populate({
        path: "quiz",
        select:
          "question options correctAnswer subject difficulty createdAt like", // Include all fields you need
      })
      .sort({ savedAt: -1 });

    // Transform the response to get exactly what you want
    const formattedQuizzes = savedQuizzes.map((item) => ({
      _id: item._id,
      savedAt: item.savedAt,
      quiz: {
        _id: item.quiz._id,
        question: item.quiz.question,
        options: item.quiz.options,
        correctAnswer: item.quiz.correctAnswer,
        subject: item.quiz.subject,
        difficulty: item.quiz.difficulty,
        createdAt: item.quiz.createdAt,
        like: item.quiz.like,
      },
    }));

    // Check if any saved quizzes were found
    if (formattedQuizzes.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No saved quizzes found for this user",
        data: [],
      });
    }

    res.status(200).json({
      success: true,
      message: "Saved quizzes retrieved successfully",
      count: formattedQuizzes.length,
      data: formattedQuizzes,
    });
  } catch (error) {
    console.error("Error retrieving saved quizzes:", error);
    res.status(500).json({
      success: false,
      message: "Server error while retrieving saved quizzes",
      error: error.message,
    });
  }
};
