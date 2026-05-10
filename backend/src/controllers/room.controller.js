const roomService = require("../services/room.service");

async function getAllRooms(req, res) {
  try {
    const rooms = await roomService.getAllRooms();
    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur lors du chargement des salles",
    });
  }
}

async function getSessionsByRoomId(req, res) {
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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur lors du chargement des sessions de la salle",
    });
  }
}

module.exports = {
  getAllRooms,
  getSessionsByRoomId,
};