const sessionService = require("../services/session.service");

async function getSessionsByEventId(req, res) {
  try {
    const eventId = Number(req.params.eventId);
    if (Number.isNaN(eventId)) {
      return res.status(400).json({
        message: "L'id de l'événement doit être un nombre valide",
      });
    }
    const sessions = await sessionService.getSessionsByEventId(eventId);
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur lors du chargement des sessions de l'événement",
    });
  }
}

async function getSessionById(req, res) {
  try {
    const sessionId = Number(req.params.id);
    if (Number.isNaN(sessionId)) {
      return res.status(400).json({
        message: "L'id de la session doit être un nombre valide",
      });
    }
    const session = await sessionService.getSessionById(sessionId);
    if (!session) {
      return res.status(404).json({
        message: "Session introuvable",
      });
    }
    res.json(session);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur lors du chargement de la session",
    });
  }
}

async function getQuestionsBySessionId(req, res) {
  try {
    const sessionId = Number(req.params.id);
    if (Number.isNaN(sessionId)) {
      return res.status(400).json({
        message: "L'id de la session doit être un nombre valide",
      });
    }
    const session = await sessionService.getSessionById(sessionId);
    if (!session) {
      return res.status(404).json({
        message: "Session introuvable",
      });
    }
    const isLive = await sessionService.isSessionLive(sessionId);
    if (!isLive) {
      return res.status(403).json({
        message: "Les questions sont accessibles uniquement pendant une session live",
      });
    }
    const questions = await sessionService.getQuestionsBySessionId(sessionId);
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur serveur lors du chargement des questions",
    });
  }
}

async function createQuestion(req, res) {
  try {
    const sessionId = Number(req.params.id);
    if (Number.isNaN(sessionId)) {
      return res.status(400).json({
        message: "L'id de la session doit être un nombre valide",
      });
    }
    const question = await sessionService.createQuestion(sessionId, req.body);
    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Erreur serveur lors de la création de la question",
    });
  }
}

async function upvoteQuestion(req, res) {
  try {
    const questionId = Number(req.params.id);
    if (Number.isNaN(questionId)) {
      return res.status(400).json({
        message: "L'id de la question doit être un nombre valide",
      });
    }
    const question = await sessionService.upvoteQuestion(questionId);
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Erreur serveur lors de l'upvote",
    });
  }
}

async function getAllSessions(req, res) {
  try {
    const sessions = await sessionService.getAllSessions();
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur chargement sessions",
    });
  }
}

async function createSession(req, res) {
  try {
    const newSession = await sessionService.createSession(req.body);
    res.status(201).json(newSession);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

async function updateSession(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const updated = await sessionService.updateSession(id, req.body);
    if (!updated) {
      return res.status(404).json({ error: "Session non trouvée" });
    }
    res.json(updated);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

async function deleteSession(req, res) {
  try {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "ID invalide" });
    }
    const deleted = await sessionService.deleteSession(id);
    if (!deleted) {
      return res.status(404).json({ error: "Session non trouvée" });
    }
    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
}

async function addAnswer(req, res) {
  try {
    const questionId = Number(req.params.id);
    if (Number.isNaN(questionId)) {
      return res.status(400).json({ error: "ID de question invalide" });
    }
    const { content } = req.body;
    if (!content || content.trim() === "") {
      return res.status(400).json({ error: "Le contenu de la réponse est requis" });
    }
    const answer = await sessionService.addAnswerToQuestion(questionId, content);
    res.status(201).json(answer);
  } catch (error) {
    console.error(error);
    res.status(error.status || 500).json({
      message: error.message || "Erreur lors de l'ajout de la réponse",
    });
  }
}

module.exports = {
  getSessionsByEventId,
  getSessionById,
  getQuestionsBySessionId,
  createQuestion,
  upvoteQuestion,
  getAllSessions,
  createSession,
  updateSession,
  deleteSession,
  addAnswer, 
};
