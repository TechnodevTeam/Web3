const express = require("express");
const sessionController = require("../controllers/session.controller");
const router = express.Router();

// Routes publiques
router.get("/", sessionController.getAllSessions);
router.get("/:id", sessionController.getSessionById);
router.get("/event/:eventId", sessionController.getSessionsByEventId);

// ✅ CORRECTION : Ajout de la route GET /:id/questions
router.get("/:id/questions", sessionController.getQuestionsBySessionId);

// ✅ CORRECTION : Ajout de la route POST /:id/questions
router.post("/:id/questions", sessionController.createQuestion);

// ✅ CORRECTION : Ajout de la route POST /questions/:id/upvote
router.post("/questions/:id/upvote", sessionController.upvoteQuestion);

// ✅ CORRECTION : Ajout de la route POST /:id/answers (optionnel, commenté si pas utilisé)
// router.post("/:id/answers", sessionController.addAnswer);

// Routes admin (protéger avec auth plus tard)
router.post("/", sessionController.createSession);
router.put("/:id", sessionController.updateSession);
router.delete("/:id", sessionController.deleteSession);

// ✅ UN SEUL module.exports
module.exports = router;