const eventRepository = require("../repositories/event.repository");
async function getAllEvents() {
  return await eventRepository.findAllEvents();
}
async function getEventById(id) {
  return await eventRepository.findEventById(id);
}
<<<<<<< HEAD
=======

async function createEvent(data) {
  return await eventRepository.createEvent(data);
}

async function updateEvent(id, data) {
  return await eventRepository.updateEvent(id, data);
}

async function deleteEvent(id) {
  return await eventRepository.deleteEvent(id);
}

>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};