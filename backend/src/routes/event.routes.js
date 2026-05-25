// event.routes.js

const express = require("express");
const eventController = require("../controllers/event.controller");

const router = express.Router();

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.post("/", eventController.createEvent);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

// Gardez cette route si elle est utile
router.get("/:id/sessions", eventController.getSessionsByEventId);

module.exports = router;