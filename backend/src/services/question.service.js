const questionRepository = require("../repositories/question.repository");
async function upvoteQuestion(questionId) {
  return questionRepository.upvoteQuestion(questionId);
}
module.exports = {
  upvoteQuestion,
};
