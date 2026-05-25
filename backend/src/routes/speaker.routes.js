const express = require("express");
const speakerController = require("../controllers/speaker.controller");
const router = express.Router();
router.get("/:id", speakerController.getSpeakerById);
module.exports = router;
