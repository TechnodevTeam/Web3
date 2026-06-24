const roomRepository = require("../repositories/room.repository");
async function getAllRooms() {
  return await roomRepository.findAllRooms();
}
<<<<<<< HEAD
async function getSessionsByRoomId(roomId) {
  return await roomRepository.findSessionsByRoomId(roomId);
}
=======

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

>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
module.exports = {
  getAllRooms,
  getRoomById,
  getSessionsByRoomId,
  createRoom,
  updateRoom,
  deleteRoom,
};