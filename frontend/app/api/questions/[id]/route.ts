import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'user1',
  password: process.env.DB_PASSWORD || '01234',
  database: process.env.DB_NAME || 'eventsync_db',
});

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const questionId = parseInt(id);

    if (isNaN(questionId)) {
      return NextResponse.json(
        { error: 'ID de question invalide' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { content } = body;

    if (!content || content.trim() === '') {
      return NextResponse.json(
        { error: 'Le contenu est requis' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE questions SET content = $1 WHERE id = $2
       RETURNING id, content, author_name AS "authorName", upvotes, created_at AS "createdAt"`,
      [content.trim(), questionId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Question non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur PUT question:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const questionId = parseInt(id);

    if (isNaN(questionId)) {
      return NextResponse.json(
        { error: 'ID de question invalide' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'DELETE FROM questions WHERE id = $1 RETURNING id',
      [questionId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Question non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE question:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
