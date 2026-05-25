const roomRepository = require("../repositories/room.repository");

async function getAllRooms() {
  return await roomRepository.findAllRooms();
}

async function getRoomById(id) {
  return await roomRepository.findRoomById(id);
}

async function getSessionsByRoomId(roomId) {
  return await roomRepository.findSessionsByRoomId(roomId);
}

async function createRoom(data) {
  return await roomRepository.createRoom(data);
}

async function updateRoom(id, data) {
  return await roomRepository.updateRoom(id, data);
}

async function deleteRoom(id) {
  return await roomRepository.deleteRoom(id);
}

module.exports = {
  getAllRooms,
  getRoomById,
  getSessionsByRoomId,
  createRoom,
  updateRoom,
  deleteRoom,
};