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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, eventId, roomId, startTime, endTime, capacity } = body;

    if (!title || !eventId || !roomId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Titre, événement, salle, début et fin sont requis' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO sessions (event_id, room_id, title, description, start_time, end_time, capacity)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, event_id AS "eventId", room_id AS "roomId", title, description,
                start_time AS "startTime", end_time AS "endTime", capacity
      `,
      [eventId, roomId, title, description || null, startTime, endTime, capacity || 0]
    );

    const session = result.rows[0];
    const meta = await pool.query(
      `
      SELECT events.title AS "eventTitle", rooms.name AS "roomName"
      FROM events
      INNER JOIN rooms ON rooms.id = $1
      WHERE events.id = $2
      `,
      [roomId, eventId]
    );

    if (meta.rows[0]) {
      session.eventTitle = meta.rows[0].eventTitle;
      session.roomName = meta.rows[0].roomName;
    }

    session.live = false;
    return NextResponse.json(session);
  } catch (error) {
    console.error('Erreur POST session:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
