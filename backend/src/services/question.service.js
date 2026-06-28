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

async function answerQuestion(questionId, content) {
  return questionRepository.addAnswer(questionId, content)
}

module.exports = {
  upvoteQuestion,
  getAllQuestions,
  deleteQuestion,
  answerQuestion,
}