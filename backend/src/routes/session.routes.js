const express = require("express");
const sessionController = require("../controllers/session.controller");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

router.get("/", sessionController.getAllSessions);
router.get("/:id", sessionController.getSessionById);
router.get("/event/:eventId", sessionController.getSessionsByEventId);


router.get("/:id/questions", sessionController.getQuestionsBySessionId);

router.post("/:id/questions", sessionController.createQuestion);

router.post("/questions/:id/upvote", sessionController.upvoteQuestion);

router.post("/", authMiddleware, adminMiddleware, sessionController.createSession);
router.put("/:id", authMiddleware, adminMiddleware, sessionController.updateSession);
router.delete("/:id", authMiddleware, adminMiddleware, sessionController.deleteSession);


module.exports = router;
