const express = require("express");
const eventController = require("../controllers/event.controller");
const sessionController = require("../controllers/session.controller");
const router = express.Router();
router.get("/", eventController.getAllEvents);
router.get("/:id/sessions", sessionController.getSessionsByEventId);
router.get("/:id", eventController.getEventById);
module.exports = router;
