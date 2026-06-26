import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'user1',
  password: process.env.DB_PASSWORD || '01234',
  database: process.env.DB_NAME || 'eventsync_db',
});

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT 
        s.id,
        s.title,
        s.description,
        s.start_time AS "startTime",
        s.end_time AS "endTime",
        s.capacity,
        r.name AS "roomName",
        e.title AS "eventTitle",
        CASE 
          WHEN CURRENT_TIMESTAMP BETWEEN s.start_time AND s.end_time 
          THEN true ELSE false 
        END AS live,
        COALESCE(
          json_agg(
            DISTINCT jsonb_build_object(
              'id', sp.id,
              'fullName', sp.full_name
            )
          ) FILTER (WHERE sp.id IS NOT NULL),
          '[]'
        ) AS speakers
      FROM sessions s
      INNER JOIN rooms r ON s.room_id = r.id
      INNER JOIN events e ON s.event_id = e.id
      LEFT JOIN session_speakers ss ON s.id = ss.session_id
      LEFT JOIN speakers sp ON ss.speaker_id = sp.id
      GROUP BY s.id, r.name, e.title
      ORDER BY s.start_time`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur GET sessions:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventId, roomId, title, description, startTime, endTime, capacity } = body;

    if (!eventId || !roomId || !title || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Tous les champs obligatoires sont requis' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO sessions (event_id, room_id, title, description, start_time, end_time, capacity)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, event_id AS "eventId", room_id AS "roomId", title, description,
                 start_time AS "startTime", end_time AS "endTime", capacity`,
      [eventId, roomId, title, description || null, startTime, endTime, capacity || 0]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur POST session:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}