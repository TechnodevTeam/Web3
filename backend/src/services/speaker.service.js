const speakerRepository = require("../repositories/speaker.repository");

async function getSpeakerById(speakerId) {
  return await speakerRepository.findSpeakerById(speakerId);
}

async function getAllSpeakers() {
  return await speakerRepository.findAllSpeakers();
}

async function createSpeaker(data) {
  return await speakerRepository.createSpeaker(data);
}

async function updateSpeaker(id, data) {
  return await speakerRepository.updateSpeaker(id, data);
}
async function deleteSpeaker(id) {
  return await speakerRepository.deleteSpeaker(id);
}

module.exports = {
  getSpeakerById,
  getAllSpeakers,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
};
