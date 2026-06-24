const express = require("express");
const questionController = require("../controllers/question.controller");
const router = express.Router();
router.post("/:id/upvote", questionController.upvoteQuestion);
module.exports = router;
