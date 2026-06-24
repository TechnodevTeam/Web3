const roomService = require("../services/room.service");

async function getAllRooms(req, res) {
  try {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
async function getSessionsByRoomId(req, res) {
  // ... votre code existant
}

// Nouveaux
async function getRoomById(req, res) {
  try {
    const roomId = Number(req.params.id);
    if (Number.isNaN(roomId)) {
      return res.status(400).json({
        message: "L'id de la salle doit être un nombre valide",
        receivedId: req.params.id,
      });
    }
    const sessions = await roomService.getSessionsByRoomId(roomId);
    res.json(sessions);

    const id = Number(req.params.id);
    const room = await roomService.getRoomById(id);
    if (!room) return res.status(404).json({ error: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function createRoom(req, res) {
  try {
    const newRoom = await roomService.createRoom(req.body);
    res.status(201).json(newRoom);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function updateRoom(req, res) {
  try {
    const id = Number(req.params.id);
    const updated = await roomService.updateRoom(id, req.body);
    if (!updated) return res.status(404).json({ error: "Room not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function deleteRoom(req, res) {
  try {
    const id = Number(req.params.id);
    await roomService.deleteRoom(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
module.exports = {
  getAllRooms,
  getSessionsByRoomId,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
};