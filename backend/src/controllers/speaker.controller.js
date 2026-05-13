const speakerService = require("../services/speaker.service");

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
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur lors du chargement de l'intervenant",
    });
  }
}

module.exports = {
  getSpeakerById,
};