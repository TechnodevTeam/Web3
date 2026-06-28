const express = require("express");
const questionController = require("../controllers/question.controller");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

// Routes publiques
router.patch("/:id/upvote", questionController.upvoteQuestion);

// Routes protégées admin
router.get("/", authMiddleware, adminMiddleware, questionController.getAllQuestions);
router.delete("/:id", authMiddleware, adminMiddleware, questionController.deleteQuestion);

module.exports = router;