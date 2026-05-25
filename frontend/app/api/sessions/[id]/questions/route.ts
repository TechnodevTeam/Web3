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
    const result = await pool.query(
      `
      SELECT 
        id, 
        session_id AS "sessionId", 
        content, 
        author_name AS "authorName", 
        upvotes, 
        created_at AS "createdAt"
      FROM questions 
      WHERE session_id = $1 
      ORDER BY upvotes DESC, created_at ASC
      `,
      [sessionId]
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur GET questions:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: sessionId } = await params;
    const { content, authorName } = await request.json();

    if (!content) {
      return NextResponse.json({ error: 'Le contenu est requis' }, { status: 400 });
    }

    const sessionResult = await pool.query(
      `SELECT start_time, end_time FROM sessions WHERE id = $1`,
      [sessionId]
    );

    if (sessionResult.rows.length === 0) {
      return NextResponse.json({ error: 'Session introuvable' }, { status: 404 });
    }

    const { start_time, end_time } = sessionResult.rows[0];
    const now = new Date();
    if (now < new Date(start_time) || now > new Date(end_time)) {
      return NextResponse.json({ error: "La session n'est pas live" }, { status: 403 });
    }

    const result = await pool.query(
      `
      INSERT INTO questions (session_id, content, author_name)
      VALUES ($1, $2, $3)
      RETURNING id, session_id AS "sessionId", content, author_name AS "authorName", upvotes, created_at AS "createdAt"
      `,
      [sessionId, content, authorName || null]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    console.error('Erreur POST question:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
