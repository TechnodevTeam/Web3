const express = require("express");
const eventController = require("../controllers/event.controller");
const sessionController = require("../controllers/session.controller");

const router = express.Router();
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);

module.exports = router;

router.post("/", eventController.createEvent);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

module.exports = router;