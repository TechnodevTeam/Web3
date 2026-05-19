//routes/session.routes.js

const express = require("express");
const sessionController = require("../controllers/session.controller");

const router = express.Router();

router.get("/", sessionController.getAllSessions);
router.get("/:id", sessionController.getSessionById);
router.get("/:id/questions", sessionController.getQuestionsBySessionId);
router.post("/:id/questions", sessionController.createQuestion);

module.exports = router;