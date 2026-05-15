const db = require("../db");

async function findAllRooms() {
  try {
    const result = await db.query(`
      SELECT
        rooms.id,
        rooms.name,

        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', sessions.id,
              'title', sessions.title,
              'startTime', sessions.start_time,
              'endTime', sessions.end_time
            )
          ) FILTER (WHERE sessions.id IS NOT NULL),
          '[]'
        ) AS sessions

      FROM rooms

      LEFT JOIN sessions
        ON rooms.id = sessions.room_id

      GROUP BY rooms.id

      ORDER BY rooms.name
    `);

    return result.rows;
  } catch (error) {
  console.log(error);
  throw error;
}
}

async function findSessionsByRoomId(roomId) {
  try {
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
        rooms.name AS "roomName",

        CASE
          WHEN CURRENT_TIMESTAMP
            BETWEEN sessions.start_time
            AND sessions.end_time
          THEN true
          ELSE false
        END AS live

      FROM sessions

      INNER JOIN rooms
        ON sessions.room_id = rooms.id

      WHERE sessions.room_id = $1

      ORDER BY sessions.start_time
      `,
      [roomId]
    );

    return result.rows;
  } catch (error) {
  console.log(error);
  throw error;
}
}

module.exports = {
  findAllRooms,
  findSessionsByRoomId,
};