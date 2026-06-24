const speakerService = require("../services/speaker.service");
<<<<<<< HEAD
async function getSpeakerById(req, res) {
  try {
    const speakerId = Number(req.params.id);
    if (Number.isNaN(speakerId)) {
      return res.status(400).json({
        message: "L'id de l'intervenant doit être un nombre valide",
      });
    }
    const speaker = await speakerService.getSpeakerById(speakerId);
    if (!speaker) {
      return res.status(404).json({
        message: "Intervenant introuvable",
      });
    }
    res.json(speaker);
=======

async function getSpeakerById(req, res) { /* votre code existant */ }
async function getAllSpeakers(req, res) {
  try {
    const speakers = await speakerService.getAllSpeakers();
    res.json(speakers);
>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
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
<<<<<<< HEAD
};
=======
  getAllSpeakers,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
};
>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
