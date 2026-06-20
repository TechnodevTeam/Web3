const express = require("express");
const speakerController = require("../controllers/speaker.controller");
const router = express.Router();
<<<<<<< HEAD
router.get("/:id", speakerController.getSpeakerById);
module.exports = router;
=======

router.get("/", speakerController.getAllSpeakers);
router.get("/:id", speakerController.getSpeakerById);
router.post("/", speakerController.createSpeaker);
router.put("/:id", speakerController.updateSpeaker);
router.delete("/:id", speakerController.deleteSpeaker);


module.exports = router;
>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
