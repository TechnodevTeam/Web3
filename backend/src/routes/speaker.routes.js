const express = require("express");
const speakerController = require("../controllers/speaker.controller");

const router = express.Router();

router.get("/", speakerController.getAllSpeakers);
router.get("/:id", speakerController.getSpeakerById);
router.post("/", speakerController.createSpeaker);
router.put("/:id", speakerController.updateSpeaker);
router.delete("/:id", speakerController.deleteSpeaker);


module.exports = router;