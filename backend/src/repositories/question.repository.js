const db = require("../db");

async function upvoteQuestion(questionId) {
  const result = await db.query(
    `UPDATE questions
     SET upvotes = upvotes + 1
     WHERE id = $1
     RETURNING *`,
    [questionId]
  );
  return result.rows[0];
}

async function findAllQuestions() {
  const result = await db.query(`
    SELECT
      questions.id,
      questions.session_id AS "sessionId",
      sessions.title AS "sessionTitle",
      questions.content,
      questions.author_name AS "authorName",
      questions.upvotes,
      questions.created_at AS "createdAt"
    FROM questions
    INNER JOIN sessions ON sessions.id = questions.session_id
    ORDER BY questions.created_at DESC
  `);
  return result.rows;
}

async function deleteQuestion(questionId) {
  const result = await db.query(
    `DELETE FROM questions WHERE id = $1 RETURNING id`,
    [questionId]
  );
  return result.rows[0];
}

async function addAnswer(questionId, content) {
  const result = await db.query(
    `INSERT INTO question_answers (question_id, content)
     VALUES ($1, $2)
     RETURNING id, question_id AS "questionId", content, created_at AS "createdAt"`,
    [questionId, content]
  )
  return result.rows[0]
}

module.exports = {
  upvoteQuestion,
  findAllQuestions,
  deleteQuestion,
  addAnswer,
}