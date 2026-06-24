import { NextResponse } from 'next/server';

import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'user1',
  password: '01234',
  database: 'eventsync_db',
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: eventId } = await params;
    const result = await pool.query(
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
          THEN true ELSE false 
        END AS live,
        COALESCE(
          (
            SELECT json_agg(jsonb_build_object(
              'id', s.id,
              'fullName', s.full_name,
              'photoUrl', s.photo_url,
              'bio', s.bio,
              'externalLinks', s.external_links
            ))
            FROM speakers s
            JOIN session_speakers ss ON s.id = ss.speaker_id
            WHERE ss.session_id = sessions.id
          ), '[]'
        ) AS speakers,
        COALESCE(
          (
            SELECT json_agg(jsonb_build_object(
              'id', q.id,
              'content', q.content,
              'authorName', q.author_name,
              'upvotes', q.upvotes,
              'createdAt', q.created_at
            ) ORDER BY q.upvotes DESC, q.created_at ASC)
            FROM questions q
            WHERE q.session_id = sessions.id
          ), '[]'
        ) AS questions
      FROM sessions
      INNER JOIN rooms ON sessions.room_id = rooms.id
      WHERE sessions.event_id = $1
      ORDER BY sessions.start_time
      `,
      [eventId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur GET sessions by event:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
