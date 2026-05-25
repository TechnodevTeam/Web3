const speakerService = require("../services/speaker.service");

async function getSpeakerById(req, res) { /* votre code existant */ }
async function getAllSpeakers(req, res) {
  try {
    const speakers = await speakerService.getAllSpeakers();
    res.json(speakers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
async function createSpeaker(req, res) {
  try {
    const newSpeaker = await speakerService.createSpeaker(req.body);
    res.status(201).json(newSpeaker);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
async function updateSpeaker(req, res) {
  try {
    const id = Number(req.params.id);
    const updated = await speakerService.updateSpeaker(id, req.body);
    if (!updated) return res.status(404).json({ error: "Speaker not found" });
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
async function deleteSpeaker(req, res) {
  try {
    const id = Number(req.params.id);
    await speakerService.deleteSpeaker(id);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  getSpeakerById,
  getAllSpeakers,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
};