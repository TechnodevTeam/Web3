const express = require("express");

const router = express.Router();

const questionController = require("../controllers/question.controller");

router.post(
  "/:id/upvote",
  questionController.upvoteQuestion
);

module.exports = router;