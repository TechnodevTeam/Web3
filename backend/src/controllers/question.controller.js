const questionService = require("../services/question.service");

async function createQuestion(req, res) {
  try {
    const sessionId = Number(req.params.id);

    if (Number.isNaN(sessionId)) {
      return res.status(400).json({
        message: "Id de session invalide",
      });
    }

    const { content, authorName } = req.body;

    if (!content || content.trim() === "") {
      return res.status(400).json({
        message: "Le contenu de la question est obligatoire",
      });
    }

    const question = await questionService.createQuestion({
      sessionId,
      content,
      authorName,
    });

    res.status(201).json(question);
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      message:
        error.message ||
        "Erreur serveur lors de la création de la question",
    });
  }
}

async function upvoteQuestion(req, res) {
  try {
    const questionId = Number(req.params.id);

    if (Number.isNaN(questionId)) {
      return res.status(400).json({
        message: "Id de question invalide",
      });
    }

    const question =
      await questionService.upvoteQuestion(questionId);

    res.json(question);
  } catch (error) {
    console.error(error);

    res.status(error.status || 500).json({
      message:
        error.message ||
        "Erreur serveur lors de l'upvote",
    });
  }
}

module.exports = {
  createQuestion,
  upvoteQuestion,
};