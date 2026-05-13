const express = require("express");
const questionController = require("../controllers/question.controller");

const router = express.Router();

router.post("/sessions/:id/questions", questionController.createQuestion);
router.patch("/:id/upvote", questionController.upvoteQuestion);

module.exports = router;