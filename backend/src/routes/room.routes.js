const express = require("express");
const roomController = require("../controllers/room.controller");
const router = express.Router();
router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
router.get("/:id/sessions", roomController.getSessionsByRoomId);
module.exports = router;

router.post("/", roomController.createRoom);
router.put("/:id", roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);

module.exports = router;
