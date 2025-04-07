const express = require("express");
const router = express.Router();
const quizController = require("../controller/quizController");




router.post("/bulk", quizController.createMultipleQuizzes)



router.get("/getQuizzes", quizController.getQuizzes);
router.post("/createQuiz", quizController.createQuiz);
router.get("/:id", quizController.getQuizById);
router.post("/:id", quizController.updateQuiz);
router.delete("/:id", quizController.deleteQuiz);
router.get("/:id", quizController.getQuizzesBySubject);

module.exports = router;
