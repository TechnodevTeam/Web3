const express = require("express");
const roomController = require("../controllers/room.controller");
const router = express.Router();
const { authMiddleware, adminMiddleware } = require('../middleware/auth.middleware')


router.get("/", authMiddleware, roomController.getAllRooms);
router.get("/:id", authMiddleware, roomController.getRoomById);
router.get("/:id/sessions", authMiddleware, roomController.getSessionsByRoomId);
router.post("/", authMiddleware, adminMiddleware, roomController.createRoom);
router.put("/:id", authMiddleware, adminMiddleware, roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);

module.exports = router;