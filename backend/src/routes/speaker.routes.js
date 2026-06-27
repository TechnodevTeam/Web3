const express = require("express");
const speakerController = require("../controllers/speaker.controller");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

// Routes publiques
router.get("/", speakerController.getAllSpeakers);
router.get("/:id", speakerController.getSpeakerById);

// Routes admin (protéger avec auth plus tard)
router.post("/", authMiddleware, adminMiddleware, speakerController.createSpeaker);
router.put("/:id", authMiddleware, adminMiddleware, speakerController.updateSpeaker);
router.delete("/:id", authMiddleware, adminMiddleware, speakerController.deleteSpeaker);

module.exports = router;