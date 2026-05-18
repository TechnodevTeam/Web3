const db = require("../db");

async function upvoteQuestion(questionId) {
  const result = await db.query(
    `
    UPDATE questions
    SET upvotes = upvotes + 1
    WHERE id = $1
    RETURNING *
    `,
    [questionId]
  );

  return result.rows[0];
}

module.exports = {
  upvoteQuestion,
};