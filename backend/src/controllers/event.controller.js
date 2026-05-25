//controllers/event.controller.js

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

// ... (vos fonctions getAllEvents, getEventById, etc.) ...

// Ajoutez les nouvelles fonctions (create, update, delete) en utilisant la même syntaxe async function
async function createEvent(req, res) {
  try {
    const newEvent = await eventService.createEvent(req.body);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

async function updateEvent(req, res) {
  try {
    const id = Number(req.params.id);
    const updated = await eventService.updateEvent(id, req.body);
    if (!updated) return res.status(404).json({ error: "Event not found" });
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

async function deleteEvent(req, res) {
  try {
    const id = Number(req.params.id);
    const deleted = await eventService.deleteEvent(id);
    if (!deleted) return res.status(404).json({ error: "Event not found" });
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

// Exportation de TOUTES les fonctions
module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};