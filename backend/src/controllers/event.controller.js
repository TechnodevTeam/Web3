const eventService = require("../services/event.service");
async function getAllEvents(req, res) {
  try {
    const events = await eventService.getAllEvents();
    res.json(events);
  } catch (error) {
    console.error("ERREUR getAllEvents:", error);
    res.status(500).json({
      message: "Erreur serveur lors du chargement des événements"
    });
  }
}
async function getEventById(req, res) {
  try {
    const id = Number(req.params.id);
    const event = await eventService.getEventById(id);
    if (!event) {
      return res.status(404).json({
        message: "Événement introuvable",
      });
    }
    res.json(event);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur lors du chargement de l’événement",
    });
  }
}
module.exports = {
  getAllEvents,
  getEventById,
};
