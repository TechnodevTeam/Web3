const eventRepository = require("../repositories/event.repository");

async function getAllEvents() {
  return await eventRepository.findAllEvents();
}

async function getEventById(id) {
  return await eventRepository.findEventById(id);
}

module.exports = {
  getAllEvents,
  getEventById,
};