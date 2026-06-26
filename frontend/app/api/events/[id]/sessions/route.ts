import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'user1',
  password: process.env.DB_PASSWORD || '01234',
  database: process.env.DB_NAME || 'eventsync_db',
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'ID d\'événement invalide' },
        { status: 400 }
      );
    }

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
      WHERE s.event_id = $1
      GROUP BY s.id, r.name, e.title
      ORDER BY s.start_time`,
      [eventId]
    );

    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur GET sessions by event:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}