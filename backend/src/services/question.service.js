const questionRepository = require("../repositories/question.repository");
const sessionRepository = require("../repositories/session.repository");

async function createQuestion({
  sessionId,
  content,
  authorName,
}) {
  const session = await sessionRepository.findSessionById(sessionId);

  if (!session) {
    const error = new Error("Session introuvable");
    error.status = 404;
    throw error;
  }

  if (!session.live) {
    const error = new Error(
      "Impossible de poser une question. La session n'est pas live."
    );

    error.status = 403;
    throw error;
  }

  return await questionRepository.createQuestion({
    sessionId,
    content,
    authorName,
  });
}

async function upvoteQuestion(questionId) {
  const question =
    await questionRepository.upvoteQuestion(questionId);

  if (!question) {
    const error = new Error("Question introuvable");
    error.status = 404;
    throw error;
  }

  return question;
}

module.exports = {
  createQuestion,
  upvoteQuestion,
};