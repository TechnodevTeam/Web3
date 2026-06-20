const sessionRepository = require("../repositories/session.repository");
async function getSessionsByEventId(eventId) {
  return await sessionRepository.findSessionsByEventId(eventId);
}
async function getSessionById(sessionId) {
  return await sessionRepository.findSessionById(sessionId);
}
async function getQuestionsBySessionId(sessionId) {
  return await sessionRepository.findQuestionsBySessionId(sessionId);
}
async function createQuestion(sessionId, body) {
  const content = body.content;
  const authorName = body.authorName || null;
  if (!content || content.trim() === "") {
    const error = new Error("Le contenu de la question est obligatoire");
    error.status = 400;
    throw error;
  }
  const session = await sessionRepository.findSessionById(sessionId);
  if (!session) {
    const error = new Error("Session introuvable");
    error.status = 404;
    throw error;
  }
  const live = await sessionRepository.isSessionLive(sessionId);
  if (!live) {
    const error = new Error(
      "Impossible de poser une question. La session n'est pas live."
    );
    error.status = 400;
    throw error;
  }
  return await sessionRepository.createQuestion(
    sessionId,
    content.trim(),
    authorName
  );
}
async function upvoteQuestion(questionId) {
  const question = await sessionRepository.upvoteQuestion(questionId);
  if (!question) {
    const error = new Error("Question introuvable");
    error.status = 404;
    throw error;
  }
  return question;
}
async function getAllSessions() {
  return sessionRepository.findAllSessions();
}
<<<<<<< HEAD
=======

async function createSession(data) {
  return await sessionRepository.createSession(data);
}

async function updateSession(id, data) {
  return await sessionRepository.updateSession(id, data);
}

async function deleteSession(id) {
  return await sessionRepository.deleteSession(id);
}

async function addAnswerToQuestion(questionId, answerContent) {
  return await sessionRepository.addAnswerToQuestion(questionId, answerContent);
}

>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
module.exports = {
  getSessionsByEventId,
  getSessionById,
  getQuestionsBySessionId,
  createQuestion,
  upvoteQuestion,
  getAllSessions,
<<<<<<< HEAD
};
=======
  createSession,
  updateSession,
  deleteSession,
  addAnswerToQuestion,
};
>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
