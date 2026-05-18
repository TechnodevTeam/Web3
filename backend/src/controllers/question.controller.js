const questionService = require("../services/question.service");

async function upvoteQuestion(req, res) {
  const questionId = req.params.id;

  const updatedQuestion =
    await questionService.upvoteQuestion(questionId);

  res.json(updatedQuestion);
}

module.exports = {
  upvoteQuestion,
};