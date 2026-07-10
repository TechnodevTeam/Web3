const db = require("../db");

async function findSpeakerById(speakerId) {
  const result = await db.query(
    `
    SELECT
      speakers.id,
      speakers.full_name AS "fullName",
      speakers.photo_url AS "photoUrl",
      speakers.bio,
      speakers.external_links AS "externalLinks",
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', sessions.id,
            'title', sessions.title,
            'description', sessions.description,
            'startTime', sessions.start_time,
            'endTime', sessions.end_time,
            'roomName', rooms.name,
            'eventTitle', events.title,
            'live', CASE
              WHEN CURRENT_TIMESTAMP BETWEEN sessions.start_time AND sessions.end_time
              THEN true ELSE false
            END,
            'questions', COALESCE(
              (
                SELECT json_agg(
                  jsonb_build_object(
                    'id', q.id,
                    'content', q.content,
                    'authorName', q.author_name,
                    'upvotes', q.upvotes,
                    'createdAt', q.created_at
                  ) ORDER BY q.upvotes DESC
                )
                FROM questions q
                WHERE q.session_id = sessions.id
              ),
              '[]'
            )
          )
        ) FILTER (WHERE sessions.id IS NOT NULL),
        '[]'
      ) AS sessions
    FROM speakers
    LEFT JOIN session_speakers ON speakers.id = session_speakers.speaker_id
    LEFT JOIN sessions ON session_speakers.session_id = sessions.id
    LEFT JOIN rooms ON sessions.room_id = rooms.id
    LEFT JOIN events ON sessions.event_id = events.id
    WHERE speakers.id = $1
    GROUP BY speakers.id
    `,
    [speakerId]
  );
  return result.rows[0];
}

async function findAllSpeakers() {
  const result = await db.query(
    `
    SELECT
      id,
      full_name AS "fullName",
      photo_url AS "photoUrl",
      bio,
      external_links AS "externalLinks"
    FROM speakers
    ORDER BY id
    `
  );
  return result.rows;
}

async function createSpeaker(data) {
  const { fullName, photoUrl, bio, externalLinks } = data;
  const result = await db.query(
    `
    INSERT INTO speakers (full_name, photo_url, bio, external_links)
    VALUES ($1, $2, $3, $4)
    RETURNING id, full_name AS "fullName", photo_url AS "photoUrl", bio, external_links AS "externalLinks"
    `,
    [fullName, photoUrl, bio, externalLinks]
  );
  return result.rows[0];
}

async function updateSpeaker(id, data) {
  const { fullName, photoUrl, bio, externalLinks } = data;
  const result = await db.query(
    `
    UPDATE speakers
    SET
      full_name = COALESCE($1, full_name),
      photo_url = COALESCE($2, photo_url),
      bio = COALESCE($3, bio),
      external_links = COALESCE($4, external_links)
    WHERE id = $5
    RETURNING id, full_name AS "fullName", photo_url AS "photoUrl", bio, external_links AS "externalLinks"
    `,
    [fullName, photoUrl, bio, externalLinks, id]
  );
  return result.rows[0];
}

async function deleteSpeaker(id) {
  const result = await db.query(
    `DELETE FROM speakers WHERE id = $1 RETURNING id`,
    [id]
  );
  return result.rowCount > 0;
}

module.exports = {
  findSpeakerById,
  findAllSpeakers,
  createSpeaker,
  updateSpeaker,
  deleteSpeaker,
};
