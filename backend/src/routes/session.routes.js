const express = require("express");
const sessionController = require("../controllers/session.controller");

const router = express.Router();

router.get("/:id", sessionController.getSessionById);
router.get("/:id/questions", sessionController.getQuestionsBySessionId);
router.post("/:id/questions", sessionController.createQuestion);

module.exports = router;