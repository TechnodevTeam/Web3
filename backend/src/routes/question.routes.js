// backend/src/routes/question.routes.js
const express = require("express");
const questionController = require("../controllers/question.controller");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

// Route pour upvoter une question
router.patch("/:id/upvote", authMiddleware, adminMiddleware, questionController.upvoteQuestion);

module.exports = router;