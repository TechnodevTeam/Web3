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
    const { id: sessionId } = await params;
    
    if (!sessionId) {
      return NextResponse.json({ error: 'ID de session invalide' }, { status: 400 });
    }

    console.log(`Fetching session with ID: ${sessionId}`);

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
      WHERE sessions.id = $1::INTEGER
    `, [parseInt(sessionId)]);
    
    if (result.rows.length === 0) {
      console.log(`Session not found for ID: ${sessionId}`);
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 });
    }

    const speakersResult = await pool.query(`
      SELECT DISTINCT s.id, s.full_name AS "fullName", s.bio, s.photo_url AS "imageUrl"
      FROM speakers s
      INNER JOIN session_speakers ss ON ss.speaker_id = s.id
      WHERE ss.session_id = $1::INTEGER
    `, [parseInt(sessionId)]);

    const session = result.rows[0];
    session.speakers = speakersResult.rows || [];

    console.log(`Session found:`, session);
    return NextResponse.json(session);
  } catch (error) {
    console.error('Erreur GET session:', error);
    return NextResponse.json(
      { error: 'Erreur serveur', details: error instanceof Error ? error.message : 'Erreur inconnue' }, 
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const body = await request.json();
    const { title, description, eventId, roomId, startTime, endTime, capacity } = body;

    const result = await pool.query(
      `
      UPDATE sessions
      SET event_id = $1,
          room_id = $2,
          title = $3,
          description = $4,
          start_time = $5,
          end_time = $6,
          capacity = $7
      WHERE id = $8
      RETURNING id, event_id AS "eventId", room_id AS "roomId", title, description,
                start_time AS "startTime", end_time AS "endTime", capacity
      `,
      [
        eventId,
        roomId,
        title,
        description || null,
        startTime,
        endTime,
        capacity || 0,
        parseInt(sessionId),
      ]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 });
    }

    const session = result.rows[0];
    const meta = await pool.query(
      `
      SELECT events.title AS "eventTitle", rooms.name AS "roomName",
        CASE
          WHEN CURRENT_TIMESTAMP BETWEEN $3::timestamp AND $4::timestamp
          THEN true ELSE false
        END AS live
      FROM events
      INNER JOIN rooms ON rooms.id = $1
      WHERE events.id = $2
      `,
      [roomId, eventId, startTime, endTime]
    );

    if (meta.rows[0]) {
      Object.assign(session, meta.rows[0]);
    }

    return NextResponse.json(session);
  } catch (error) {
    console.error('Erreur PUT session:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    await pool.query('DELETE FROM sessions WHERE id = $1', [parseInt(sessionId)]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE session:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
