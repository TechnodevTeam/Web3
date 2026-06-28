const questionRepository = require("../repositories/question.repository");

async function upvoteQuestion(questionId) {
  return questionRepository.upvoteQuestion(questionId);
}

async function getAllQuestions() {
  return questionRepository.findAllQuestions();
}

async function deleteQuestion(questionId) {
  return questionRepository.deleteQuestion(questionId);
}

module.exports = {
  upvoteQuestion,
  getAllQuestions,
  deleteQuestion,
};