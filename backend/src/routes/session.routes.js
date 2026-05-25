const express = require("express");
const sessionController = require("../controllers/session.controller");

const router = express.Router();

router.get("/", sessionController.getAllSessions);
router.get("/:id", sessionController.getSessionById);
router.post("/", sessionController.createSession);
router.put("/:id", sessionController.updateSession);
router.delete("/:id", sessionController.deleteSession);
router.get("/:id/questions", sessionController.getQuestionsBySessionId);
router.post("/:id/questions", sessionController.createQuestion);
router.post("/questions/:id/answers", sessionController.addAnswer);

module.exports = router;