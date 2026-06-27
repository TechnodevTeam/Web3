const express = require("express");
const sessionController = require("../controllers/session.controller");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

// Routes publiques
router.get("/", authMiddleware, sessionController.getAllSessions);
router.get("/:id", authMiddleware, sessionController.getSessionById);
router.get("/event/:eventId", authMiddleware, sessionController.getSessionsByEventId);

// ✅ CORRECTION : Ajout de la route GET /:id/questions
router.get("/:id/questions", authMiddleware, sessionController.getQuestionsBySessionId);

// ✅ CORRECTION : Ajout de la route POST /:id/questions
router.post("/:id/questions", authMiddleware, sessionController.createQuestion);

// ✅ CORRECTION : Ajout de la route POST /questions/:id/upvote
router.post("/questions/:id/upvote", authMiddleware, sessionController.upvoteQuestion);

// ✅ CORRECTION : Ajout de la route POST /:id/answers (optionnel, commenté si pas utilisé)
// router.post("/:id/answers", sessionController.addAnswer);

// Routes admin (protéger avec auth plus tard)
router.post("/", authMiddleware, sessionController.createSession);
router.put("/:id", authMiddleware, sessionController.updateSession);
router.delete("/:id", authMiddleware, sessionController.deleteSession);

// ✅ UN SEUL module.exports
module.exports = router;