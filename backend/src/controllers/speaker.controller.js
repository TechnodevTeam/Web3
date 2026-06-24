const speakerService = require("../services/speaker.service");

async function getSpeakerById(req, res) {
  try {
    const speakerId = Number(req.params.id);
    if (Number.isNaN(speakerId)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const speaker = await speakerService.getSpeakerById(speakerId);
    if (!speaker) {
      return res.status(404).json({ error: "Intervenant non trouvé" });
    }
    res.json(speaker);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

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
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

async function updateSpeaker(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const updated = await speakerService.updateSpeaker(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Speaker not found" });
    }
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

async function deleteSpeaker(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const deleted = await speakerService.deleteSpeaker(id);
    if (!deleted) {
      return res.status(404).json({ error: "Speaker not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
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