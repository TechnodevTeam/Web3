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
    const { id: speakerId } = await params;
    
    const speakerResult = await pool.query(
      `SELECT id, full_name AS "fullName", photo_url AS "photoUrl", bio, external_links AS "externalLinks" 
       FROM speakers WHERE id = $1`,
      [speakerId]
    );

    if (speakerResult.rows.length === 0) {
      return NextResponse.json({ error: 'Intervenant introuvable' }, { status: 404 });
    }

    const speaker = speakerResult.rows[0];

    const sessionsResult = await pool.query(
      `
      SELECT 
        sessions.id, 
        sessions.title, 
        sessions.description, 
        sessions.start_time AS "startTime", 
        sessions.end_time AS "endTime", 
        rooms.name AS "roomName",
        events.title AS "eventTitle"
      FROM sessions
      JOIN rooms ON sessions.room_id = rooms.id
      JOIN events ON sessions.event_id = events.id
      JOIN session_speakers ss ON sessions.id = ss.session_id
      WHERE ss.speaker_id = $1
      ORDER BY sessions.start_time
      `,
      [speakerId]
    );

    speaker.sessions = sessionsResult.rows;

    return NextResponse.json(speaker);
  } catch (error) {
    console.error('Erreur GET speaker:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
