const express = require("express");
const roomController = require("../controllers/room.controller");

const router = express.Router();

router.get("/", roomController.getAllRooms);
router.get("/:id/sessions", roomController.getSessionsByRoomId);

module.exports = router;