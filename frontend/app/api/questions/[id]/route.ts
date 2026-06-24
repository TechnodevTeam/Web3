// frontend/app/api/questions/[id]/route.ts
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
    const { id } = await params;
    const questionId = parseInt(id);

    if (isNaN(questionId)) {
      return NextResponse.json(
        { error: 'ID de question invalide' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT id, content, author_name AS "authorName", 
              upvotes, created_at AS "createdAt", session_id AS "sessionId"
       FROM questions
       WHERE id = $1`,
      [questionId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Question non trouvée' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erreur GET:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

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

    const existsResult = await pool.query(
      'SELECT id FROM questions WHERE id = $1',
      [questionId]
    );

    if (existsResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Question non trouvée' },
        { status: 404 }
      );
    }

    const result = await pool.query(
      `UPDATE questions 
       SET content = $1
       WHERE id = $2
       RETURNING id, content, author_name AS "authorName", 
                 upvotes, created_at AS "createdAt", session_id AS "sessionId"`,
      [content.trim(), questionId]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('❌ Erreur PUT:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la modification' },
      { status: 500 }
    );
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

    const existsResult = await pool.query(
      'SELECT id FROM questions WHERE id = $1',
      [questionId]
    );

    if (existsResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Question non trouvée' },
        { status: 404 }
      );
    }

    await pool.query('DELETE FROM questions WHERE id = $1', [questionId]);

    return NextResponse.json({ 
      success: true, 
      message: 'Question supprimée avec succès'
    });
  } catch (error) {
    console.error('❌ Erreur DELETE:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la suppression' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'GET, PUT, DELETE, OPTIONS',
    },
  });
}