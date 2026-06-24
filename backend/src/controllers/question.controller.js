// backend/src/controllers/question.controller.js
const questionService = require("../services/question.service");

async function upvoteQuestion(req, res) {
  try {
    const questionId = Number(req.params.id);
    
    // Vérifier si l'ID est valide
    if (isNaN(questionId)) {
      return res.status(400).json({ 
        error: "ID de question invalide" 
      });
    }
    
    const updatedQuestion = await questionService.upvoteQuestion(questionId);
    
    // Vérifier si la question existe
    if (!updatedQuestion) {
      return res.status(404).json({ 
        error: "Question non trouvée" 
      });
    }
    
    // Retourner la question mise à jour
    res.status(200).json(updatedQuestion);
  } catch (error) {
    console.error("Erreur upvoteQuestion:", error);
    res.status(500).json({ 
      error: "Erreur serveur lors de l'upvote" 
    });
  }
}

module.exports = {
  upvoteQuestion,
};