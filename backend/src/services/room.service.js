const roomRepository = require("../repositories/room.repository");

async function getAllRooms() {
  return await roomRepository.findAllRooms();
}

async function getSessionsByRoomId(roomId) {
  return await roomRepository.findSessionsByRoomId(roomId);
}

module.exports = {
  getAllRooms,
  getSessionsByRoomId,
};