// backend/src/routes/question.routes.js
const express = require("express");
const questionController = require("../controllers/question.controller");
const router = express.Router();

// Route pour upvoter une question
router.patch("/:id/upvote", questionController.upvoteQuestion);

module.exports = router;