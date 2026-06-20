const express = require("express");
const eventController = require("../controllers/event.controller");
<<<<<<< HEAD
const sessionController = require("../controllers/session.controller");
=======

>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
const router = express.Router();
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
<<<<<<< HEAD
module.exports = router;
=======
router.post("/", eventController.createEvent);
router.put("/:id", eventController.updateEvent);
router.delete("/:id", eventController.deleteEvent);

module.exports = router;
>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
