const mongoose = require("mongoose");
const WrongAnswer = require("../models/wrongAnserModel");

async function wrongAnswer(req, res) {
  async (req, res) => {
    try {
      const { quizId, question, correctAnswer, wrongAnswer, userId } = req.body;

      // Check if this wrong answer already exists for this user and quiz
      const existingWrongAnswer = await WrongAnswer.findOne({
        userId,
        quizId,
        wrongAnswer,
        resolved: false,
      });

      // If it already exists, don't create a duplicate
      if (existingWrongAnswer) {
        return res.status(200).json({
          message: "Wrong answer already recorded",
          wrongAnswer: existingWrongAnswer,
        });
      }

      // Create new wrong answer record
      const newWrongAnswer = new WrongAnswer({
        userId,
        quizId,
        question,
        correctAnswer,
        wrongAnswer,
      });

      await newWrongAnswer.save();

      res.status(201).json({
        success: true,
        message: "Wrong answer saved successfully",
        data: newWrongAnswer,
      });
    } catch (error) {
      console.error("Error saving wrong answer:", error);
      res.status(500).json({
        success: false,
        message: "Error saving wrong answer",
        error: error.message,
      });
    }
  };
}

async function getAllWrongAnswer(req, res) {
  async (req, res) => {
    try {
      const userId = req.user.id; // Assuming auth middleware sets req.user

      const wrongAnswers = await WrongAnswer.find({
        userId,
        resolved: false,
      })
        .sort({ createdAt: -1 }) // Most recent first
        .populate(
          "quizId",
          "question options correctAnswer subject difficulty"
        );

      res.status(200).json({
        success: true,
        count: wrongAnswers.length,
        data: wrongAnswers,
      });
    } catch (error) {
      console.error("Error fetching wrong answers:", error);
      res.status(500).json({
        success: false,
        message: "Error fetching wrong answers",
        error: error.message,
      });
    }
  };
}

async function updateWrongAnswer(req, res) {
  async (req, res) => {
    try {
      const wrongAnswerId = req.params.id;
      const userId = req.user.id;

      const wrongAnswer = await WrongAnswer.findOneAndUpdate(
        { _id: wrongAnswerId, userId },
        {
          resolved: true,
          resolvedAt: new Date(),
        },
        { new: true }
      );

      if (!wrongAnswer) {
        return res.status(404).json({
          success: false,
          message: "Wrong answer not found or not owned by user",
        });
      }

      res.status(200).json({
        success: true,
        message: "Wrong answer marked as resolved",
        data: wrongAnswer,
      });
    } catch (error) {
      console.error("Error resolving wrong answer:", error);
      res.status(500).json({
        success: false,
        message: "Error resolving wrong answer",
        error: error.message,
      });
    }
  };
}

module.exports = { wrongAnswer, getAllWrongAnswer , updateWrongAnswer};
