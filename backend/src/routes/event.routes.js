const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const sessionController = require("../controllers/session.controller");
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.get("/:id/sessions", sessionController.getSessionsByEventId);

// Exemple dans event.routes.js
router.post('/', authMiddleware, adminMiddleware, eventController.createEvent)
router.put('/:id', authMiddleware, adminMiddleware, eventController.updateEvent)
router.delete('/:id', authMiddleware, adminMiddleware, eventController.deleteEvent)

module.exports = router;