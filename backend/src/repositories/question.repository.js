const db = require("../db");

async function createQuestion({
  sessionId,
  content,
  authorName,
}) {
  const result = await db.query(
    `
    INSERT INTO questions (
      session_id,
      content,
      author_name,
      upvotes,
      created_at
    )
    VALUES ($1, $2, $3, 0, CURRENT_TIMESTAMP)
    RETURNING
      id,
      session_id AS "sessionId",
      content,
      author_name AS "authorName",
      upvotes,
      created_at AS "createdAt"
    `,
    [
      sessionId,
      content,
      authorName || null,
    ]
  );

  return result.rows[0];
}

async function upvoteQuestion(questionId) {
  const result = await db.query(
    `
    UPDATE questions
    SET upvotes = upvotes + 1
    WHERE id = $1
    RETURNING
      id,
      session_id AS "sessionId",
      content,
      author_name AS "authorName",
      upvotes,
      created_at AS "createdAt"
    `,
    [questionId]
  );

  return result.rows[0];
}

module.exports = {
  createQuestion,
  upvoteQuestion,
};