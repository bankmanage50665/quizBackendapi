const express = require("express");
const router = express.Router();

const wrongAnswerController = require("../controller/wrongAnswerController");

router.post("/wrong-answers", wrongAnswerController.wrongAnswer);
router.get("/wrong-answers", wrongAnswerController.getAllWrongAnswer);
router.patch(
  "/wrong-answers/:id/resolve",
  wrongAnswerController.updateWrongAnswer
);

module.exports = router;
