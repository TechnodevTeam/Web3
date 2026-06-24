const express = require("express");
const speakerController = require("../controllers/speaker.controller");
const router = express.Router();

// Routes publiques
router.get("/", speakerController.getAllSpeakers);
router.get("/:id", speakerController.getSpeakerById);

// Routes admin (protéger avec auth plus tard)
router.post("/", speakerController.createSpeaker);
router.put("/:id", speakerController.updateSpeaker);
router.delete("/:id", speakerController.deleteSpeaker);

module.exports = router;