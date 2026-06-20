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
<<<<<<< HEAD
module.exports = router;
=======
router.post("/questions/:id/answers", sessionController.addAnswer);

module.exports = router;
>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
