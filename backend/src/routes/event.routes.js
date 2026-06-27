const express = require("express");
const eventController = require("../controllers/event.controller");
const sessionController = require("../controllers/session.controller");
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')

// Exemple dans event.routes.js
router.post('/', authMiddleware, adminMiddleware, eventController.createEvent)
router.put('/:id', authMiddleware, adminMiddleware, eventController.updateEvent)
router.delete('/:id', authMiddleware, adminMiddleware, eventController.deleteEvent)

module.exports = router;