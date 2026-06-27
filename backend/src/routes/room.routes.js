const express = require("express");
const roomController = require("../controllers/room.controller");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')


router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
router.get("/:id/sessions", roomController.getSessionsByRoomId);
router.post("/", authMiddleware, adminMiddleware, roomController.createRoom);
router.put("/:id", authMiddleware, adminMiddleware, roomController.updateRoom);
router.delete("/:id", authMiddleware, adminMiddleware, roomController.deleteRoom);

module.exports = router;