const express = require("express");
const questionController = require("../controllers/question.controller");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

router.patch("/:id/upvote", questionController.upvoteQuestion);

router.get("/", authMiddleware, adminMiddleware, questionController.getAllQuestions);
router.delete("/:id", authMiddleware, adminMiddleware, questionController.deleteQuestion);
router.post("/:id/answer", authMiddleware, adminMiddleware, questionController.answerQuestion);

module.exports = router;
