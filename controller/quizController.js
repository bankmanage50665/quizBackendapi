const mongoose = require("mongoose");
// controllers/quizController.js
const Quiz = require("../models/quizModel");

// Get all quizzes (with optional filtering)
exports.getQuizzes = async (req, res) => {
  try {
    const { subject, difficulty } = req.query;
    const filter = {};

    if (subject) filter.subject = subject;
    if (difficulty) filter.difficulty = difficulty;

    const quizzes = await Quiz.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching quizzes",
    });
  }
};

// Get single quiz by ID
exports.getQuizById = async (req, res) => {
  try {
    const id = req.params.id;

    // Add validation for ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid quiz ID format",
      });
    }

    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching quiz",
    });
  }
};

// Create new quiz
exports.createQuiz = async (req, res) => {
  try {
    // Add user ID if authentication is implemented
    // if (req.user) {
    //   req.body.createdBy = req.user.id;
    // }

    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error("Error creating quiz:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while creating quiz",
    });
  }
};

// Controller function to insert multiple quizzes
 exports.createMultipleQuizzes = async (req, res) => {
  try {
    const quizzes = req.body;

    // Validate if quizzes array exists and is not empty
    if (!quizzes || !Array.isArray(quizzes) || quizzes.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of quiz questions",
      });
    }

    // Insert multiple quizzes
    const createdQuizzes = await Quiz.insertMany(quizzes, {
      validateBeforeSave: true,
    });

    res.status(201).json({
      success: true,
      count: createdQuizzes.length,
      data: createdQuizzes,
      message: "Quizzes created successfully",
    });
  } catch (error) {
    // Check if it's a validation error
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    console.error("Error creating quizzes:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// Update quiz
exports.updateQuiz = async (req, res) => {
  try {
    let quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check if user is authorized to update (if authentication is implemented)
    if (
      req.user &&
      quiz.createdBy &&
      quiz.createdBy.toString() !== req.user.id
    ) {
      return res.status(401).json({
        success: false,
        message: "User not authorized to update this quiz",
      });
    }

    quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (error) {
    console.error("Error updating quiz:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error while updating quiz",
    });
  }
};

// Delete quiz
exports.deleteQuiz = async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    // Check if user is authorized to delete (if authentication is implemented)
    if (
      req.user &&
      quiz.createdBy &&
      quiz.createdBy.toString() !== req.user.id
    ) {
      return res.status(401).json({
        success: false,
        message: "User not authorized to delete this quiz",
      });
    }

    await quiz.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting quiz",
    });
  }
};

// Get quizzes by subject
exports.getQuizzesBySubject = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ subject: req.params.subject });

    res.status(200).json({
      success: true,
      count: quizzes.length,
      data: quizzes,
    });
  } catch (error) {
    console.error("Error fetching quizzes by subject:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching quizzes by subject",
    });
  }
};
