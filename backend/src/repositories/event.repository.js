const db = require("../db");

async function findAllEvents() {
  try {
    const result = await db.query(`
      SELECT
        id,
        title,
        description,
        start_date AS "startDate",
        end_date AS "endDate",
        location
      FROM events
      ORDER BY start_date
    `);
    return result.rows;
  } catch (error) {
    return MOCK_EVENTS;
  }
}
async function findEventById(id) {
  try {
    const result = await db.query(
      `
      SELECT
        events.id,
        events.title,
        events.description,
        events.start_date AS "startDate",
        events.end_date AS "endDate",
        events.location,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', sessions.id,
              'title', sessions.title,
              'description', sessions.description,
              'startTime', sessions.start_time,
              'endTime', sessions.end_time,
              'roomName', rooms.name,
              'capacity', sessions.capacity,
              'live', CASE
                WHEN CURRENT_TIMESTAMP BETWEEN sessions.start_time AND sessions.end_time
                THEN true ELSE false
              END,
              'speakers', COALESCE(
                (
                  SELECT json_agg(
                    jsonb_build_object(
                      'id', sp.id,
                      'fullName', sp.full_name
                    )
                  )
                  FROM session_speakers ss
                  INNER JOIN speakers sp ON ss.speaker_id = sp.id
                  WHERE ss.session_id = sessions.id
                ),
                '[]'
              )
            )
          ) FILTER (WHERE sessions.id IS NOT NULL),
          '[]'
        ) AS sessions
      FROM events
      LEFT JOIN sessions ON sessions.event_id = events.id
      LEFT JOIN rooms ON sessions.room_id = rooms.id
      WHERE events.id = $1
      GROUP BY events.id
      `,
      [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0];
  } catch (error) {
    return null;
  }
}

async function createEvent({ title, description, startDate, endDate, location }) {
  const result = await db.query(
    `INSERT INTO events (title, description, start_date, end_date, location)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, title, description, start_date AS "startDate", end_date AS "endDate", location`,
    [title, description, startDate, endDate, location]
  );
  return result.rows[0];
}

async function updateEvent(id, { title, description, startDate, endDate, location }) {
  const result = await db.query(
    `UPDATE events
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         start_date = COALESCE($3, start_date),
         end_date = COALESCE($4, end_date),
         location = COALESCE($5, location)
     WHERE id = $6
     RETURNING id, title, description, start_date AS "startDate", end_date AS "endDate", location`,
    [title, description, startDate, endDate, location, id]
  );
  return result.rows[0];
}

async function deleteEvent(id) {
  await db.query(`DELETE FROM events WHERE id = $1`, [id]);
  return true;
}

module.exports = {
  findAllEvents,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
