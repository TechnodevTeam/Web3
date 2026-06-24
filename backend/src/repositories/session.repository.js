const db = require("../db");
async function findSessionsByEventId(eventId) {
  const result = await db.query(
    `
    SELECT
      sessions.id,
      sessions.event_id AS "eventId",
      sessions.room_id AS "roomId",
      sessions.title,
      sessions.description,
      sessions.start_time AS "startTime",
      sessions.end_time AS "endTime",
      sessions.capacity,
      rooms.name AS "roomName",
      CASE
        WHEN CURRENT_TIMESTAMP BETWEEN sessions.start_time AND sessions.end_time
        THEN true
        ELSE false
      END AS live,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', speakers.id,
            'fullName', speakers.full_name,
            'photoUrl', speakers.photo_url,
            'bio', speakers.bio,
            'externalLinks', speakers.external_links
          )
        ) FILTER (WHERE speakers.id IS NOT NULL),
        '[]'
      ) AS speakers,
      COALESCE(
       json_agg(
         DISTINCT jsonb_build_object(
           'id', questions.id,
           'content', questions.content,
           'authorName', questions.author_name,
            'upvotes', questions.upvotes,
           'createdAt', questions.created_at,
           'answers',
            COALESCE(
             (
                SELECT json_agg(
                 jsonb_build_object(
                    'id', qa.id,
                    'content', qa.content,
                   'createdAt', qa.created_at
                  )
               )
                FROM question_answers qa
               WHERE qa.question_id = questions.id
             ),
              '[]'
            )
          )
       ) FILTER (WHERE questions.id IS NOT NULL),
       '[]'
      ) AS questions
    FROM sessions
    INNER JOIN rooms
      ON sessions.room_id = rooms.id
    LEFT JOIN session_speakers
      ON sessions.id = session_speakers.session_id
    LEFT JOIN speakers
      ON session_speakers.speaker_id = speakers.id
    LEFT JOIN questions
      ON sessions.id = questions.session_id
    WHERE sessions.event_id = $1
    GROUP BY
      sessions.id,
      rooms.name
    ORDER BY sessions.start_time
    `,
    [eventId]
  );
  return result.rows;
}
async function findSessionById(sessionId) {
  const result = await db.query(
    `
    SELECT
      sessions.id,
      sessions.event_id AS "eventId",
      sessions.room_id AS "roomId",
      sessions.title,
      sessions.description,
      sessions.start_time AS "startTime",
      sessions.end_time AS "endTime",
      sessions.capacity,
      rooms.name AS "roomName",
      CASE
        WHEN CURRENT_TIMESTAMP BETWEEN sessions.start_time AND sessions.end_time
        THEN true
        ELSE false
      END AS live
    FROM sessions
    INNER JOIN rooms
      ON sessions.room_id = rooms.id
    WHERE sessions.id = $1
    `,
    [sessionId]
  );
  return result.rows[0];
}
async function findQuestionsBySessionId(sessionId) {
  const result = await db.query(
    `
    SELECT
      id,
      session_id AS "sessionId",
      content,
      author_name AS "authorName",
      upvotes,
      created_at AS "createdAt"
    FROM questions
    WHERE session_id = $1
    ORDER BY upvotes DESC, created_at ASC
    `,
    [sessionId]
  );
  return result.rows;
}
async function isSessionLive(sessionId) {
  const result = await db.query(
    `
    SELECT
      CASE
        WHEN CURRENT_TIMESTAMP BETWEEN start_time AND end_time
        THEN true
        ELSE false
      END AS live
    FROM sessions
    WHERE id = $1
    `,
    [sessionId]
  );
  if (result.rows.length === 0) {
    return false;
  }
  return result.rows[0].live;
}
async function createQuestion(sessionId, content, authorName) {
  const result = await db.query(
    `
    INSERT INTO questions (session_id, content, author_name)
    VALUES ($1, $2, $3)
    RETURNING
      id,
      session_id AS "sessionId",
      content,
      author_name AS "authorName",
      upvotes,
      created_at AS "createdAt"
    `,
    [sessionId, content, authorName]
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
async function findAllSessions() {
  const result = await db.query(`
    SELECT
      sessions.id,
      sessions.event_id AS "eventId",
      events.title AS "eventTitle",   -- Ajout du titre de l'événement
      sessions.room_id AS "roomId",
      sessions.title,
      sessions.description,
      sessions.start_time AS "startTime",
      sessions.end_time AS "endTime",
      rooms.name AS "roomName",
      CASE
        WHEN CURRENT_TIMESTAMP BETWEEN sessions.start_time AND sessions.end_time
        THEN true ELSE false
      END AS live
    FROM sessions
    INNER JOIN rooms ON rooms.id = sessions.room_id
    INNER JOIN events ON events.id = sessions.event_id   -- Jointure ajoutée
    ORDER BY sessions.start_time
  `);
  return result.rows;
}
<<<<<<< HEAD
=======

async function createSession({
  title,
  description,
  eventId,
  roomId,
  startTime,
  endTime,
  capacity,
}) {
  const result = await db.query(
    `INSERT INTO sessions (title, description, event_id, room_id, start_time, end_time, capacity)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING id, title, description, event_id AS "eventId", room_id AS "roomId",
               start_time AS "startTime", end_time AS "endTime", capacity`,
    [title, description, eventId, roomId, startTime, endTime, capacity]
  );
  return result.rows[0];
}

async function updateSession(
  id,
  { title, description, eventId, roomId, startTime, endTime, capacity }
) {
  const result = await db.query(
    `UPDATE sessions
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         event_id = COALESCE($3, event_id),
         room_id = COALESCE($4, room_id),
         start_time = COALESCE($5, start_time),
         end_time = COALESCE($6, end_time),
         capacity = COALESCE($7, capacity)
     WHERE id = $8
     RETURNING id, title, description, event_id AS "eventId", room_id AS "roomId",
               start_time AS "startTime", end_time AS "endTime", capacity`,
    [title, description, eventId, roomId, startTime, endTime, capacity, id]
  );
  return result.rows[0];
}

async function deleteSession(id) {
  await db.query(`DELETE FROM sessions WHERE id = $1`, [id]);
  return true;
}

async function addAnswerToQuestion(questionId, answerContent) {
  const result = await db.query(
    `INSERT INTO question_answers (question_id, content)
     VALUES ($1, $2)
     RETURNING id, question_id AS "questionId", content, created_at AS "createdAt"`,
    [questionId, answerContent]
  );
  return result.rows[0];
}

>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
module.exports = {
  findSessionsByEventId,
  findSessionById,
  findQuestionsBySessionId,
  isSessionLive,
  createQuestion,
  upvoteQuestion,
  findAllSessions,
<<<<<<< HEAD
};
=======
  createSession,
  updateSession,
  deleteSession,
  addAnswerToQuestion,
};
>>>>>>> 06fb22607d78567084a7aa67ca2dc4e6f9336a8c
