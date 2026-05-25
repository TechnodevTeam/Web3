import { NextResponse } from 'next/server';

import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'user1',
  password: '01234',
  database: 'eventsync_db',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        sessions.id,
        sessions.event_id AS "eventId",
        events.title AS "eventTitle",
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
      INNER JOIN events ON events.id = sessions.event_id
      ORDER BY sessions.start_time
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur GET sessions:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
