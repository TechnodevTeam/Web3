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
            'eventTitle', events.title
          )
        ) FILTER (WHERE sessions.id IS NOT NULL),
        '[]'
      ) AS sessions
    FROM speakers
    LEFT JOIN session_speakers
      ON speakers.id = session_speakers.speaker_id
    LEFT JOIN sessions
      ON session_speakers.session_id = sessions.id
    LEFT JOIN rooms
      ON sessions.room_id = rooms.id
    LEFT JOIN events
      ON sessions.event_id = events.id
    WHERE speakers.id = $1
    GROUP BY speakers.id
    `,
    [speakerId]
  );
  return result.rows[0];
}
module.exports = {
  findSpeakerById,
};
