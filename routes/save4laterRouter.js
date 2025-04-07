const express = require("express");
const router = express.Router();

const save4Controller = require("../controller/save4laterController");

router.post("/save4later", save4Controller.saveQuiz);
router.get("/getAllSave4Later/:userId", save4Controller.getSavedQuizzes)

module.exports = router;
