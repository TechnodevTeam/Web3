const speakerRepository = require("../repositories/speaker.repository");
async function getSpeakerById(speakerId) {
  return await speakerRepository.findSpeakerById(speakerId);
}
module.exports = {
  getSpeakerById,
};
