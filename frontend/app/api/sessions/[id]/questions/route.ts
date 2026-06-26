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
        id,
        content,
        author_name AS "authorName",
        upvotes,
        created_at AS "createdAt"
      FROM questions
      WHERE session_id = $1
      ORDER BY upvotes DESC, created_at ASC`,
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
    const { id } = await params;
    const sessionId = parseInt(id);

    if (isNaN(sessionId)) {
      return NextResponse.json(
        { error: 'ID de session invalide' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content, authorName } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Le contenu de la question est requis' },
        { status: 400 }
      );
    }

    // Vérifier si la session est live
    const sessionCheck = await pool.query(
      `SELECT CASE 
        WHEN CURRENT_TIMESTAMP BETWEEN start_time AND end_time 
        THEN true ELSE false 
      END AS live FROM sessions WHERE id = $1`,
      [sessionId]
    );

    if (sessionCheck.rows.length === 0) {
      return NextResponse.json(
        { error: 'Session non trouvée' },
        { status: 404 }
      );
    }

    if (!sessionCheck.rows[0].live) {
      return NextResponse.json(
        { error: 'La session n\'est pas en direct' },
        { status: 403 }
      );
    }

    const result = await pool.query(
      `INSERT INTO questions (session_id, content, author_name)
       VALUES ($1, $2, $3)
       RETURNING id, content, author_name AS "authorName", upvotes, created_at AS "createdAt"`,
      [sessionId, content.trim(), authorName || null]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur POST question:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}