const questionService = require("../services/question.service");

async function upvoteQuestion(req, res) {
  try {
    const questionId = Number(req.params.id);
    if (isNaN(questionId)) {
      return res.status(400).json({ error: "ID de question invalide" });
    }
    const updatedQuestion = await questionService.upvoteQuestion(questionId);
    if (!updatedQuestion) {
      return res.status(404).json({ error: "Question non trouvée" });
    }
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Erreur upvoteQuestion:", error);
    res.status(500).json({ error: "Erreur serveur lors de l'upvote" });
  }
}

async function getAllQuestions(req, res) {
  try {
    const questions = await questionService.getAllQuestions()
    const total = questions.length
    res.set('Content-Range', `questions 0-${total}/${total}`)
    res.json(questions)
  } catch (error) {
    console.error("Erreur getAllQuestions:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

async function deleteQuestion(req, res) {
  try {
    const questionId = Number(req.params.id)
    if (isNaN(questionId)) {
      return res.status(400).json({ error: "ID de question invalide" })
    }
    const deleted = await questionService.deleteQuestion(questionId)
    if (!deleted) {
      return res.status(404).json({ error: "Question non trouvée" })
    }
    res.json({ id: questionId })
  } catch (error) {
    console.error("Erreur deleteQuestion:", error);
    res.status(500).json({ error: "Erreur serveur" });
  }
}

module.exports = {
  upvoteQuestion,
  getAllQuestions,
  deleteQuestion,
};