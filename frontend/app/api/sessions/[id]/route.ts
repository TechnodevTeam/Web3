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
    const sessionId = parseInt(id);

    if (isNaN(sessionId)) {
      return NextResponse.json(
        { error: 'ID de session invalide' },
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
              'fullName', sp.full_name,
              'bio', sp.bio,
              'photoUrl', sp.photo_url
            )
          ) FILTER (WHERE sp.id IS NOT NULL),
          '[]'
        ) AS speakers
      FROM sessions s
      INNER JOIN rooms r ON s.room_id = r.id
      INNER JOIN events e ON s.event_id = e.id
      LEFT JOIN session_speakers ss ON s.id = ss.session_id
      LEFT JOIN speakers sp ON ss.speaker_id = sp.id
      WHERE s.id = $1
      GROUP BY s.id, r.name, e.title`,
      [sessionId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Session non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur GET session:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sessionId = parseInt(id);

    if (isNaN(sessionId)) {
      return NextResponse.json(
        { error: 'ID de session invalide' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, startTime, endTime, capacity } = body;

    const result = await pool.query(
      `UPDATE sessions 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           start_time = COALESCE($3, start_time),
           end_time = COALESCE($4, end_time),
           capacity = COALESCE($5, capacity)
       WHERE id = $6
       RETURNING id, title, description, start_time AS "startTime", end_time AS "endTime", capacity`,
      [title, description, startTime, endTime, capacity, sessionId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Session non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
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
    const { id } = await params;
    const sessionId = parseInt(id);

    if (isNaN(sessionId)) {
      return NextResponse.json(
        { error: 'ID de session invalide' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'DELETE FROM sessions WHERE id = $1 RETURNING id',
      [sessionId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Session non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE session:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}