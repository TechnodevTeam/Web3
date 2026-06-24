// frontend/app/api/questions/[id]/upvote/route.ts
import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'user1',
  password: '01234',
  database: 'eventsync_db',
});

// ✅ CORRECTION: params est une Promesse, on doit l'attendre
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ✅ Utiliser await pour déballer params
    const { id } = await params;
    const questionId = parseInt(id);

    console.log('📥 Upvote PATCH appelé pour question:', questionId);

    if (isNaN(questionId)) {
      return NextResponse.json(
        { error: 'ID de question invalide' },
        { status: 400 }
      );
    }

    // Vérifier si la question existe
    const checkResult = await pool.query(
      'SELECT id FROM questions WHERE id = $1',
      [questionId]
    );

    if (checkResult.rows.length === 0) {
      return NextResponse.json(
        { error: 'Question non trouvée' },
        { status: 404 }
      );
    }

    // Incrémenter les upvotes
    const result = await pool.query(
      `
      UPDATE questions 
      SET upvotes = upvotes + 1
      WHERE id = $1
      RETURNING id, upvotes
      `,
      [questionId]
    );

    return NextResponse.json({
      id: result.rows[0].id,
      upvotes: result.rows[0].upvotes
    });
  } catch (error) {
    console.error('❌ Erreur PATCH upvote:', error);
    return NextResponse.json(
      { error: 'Erreur serveur' },
      { status: 500 }
    );
  }
}

// ✅ Méthode OPTIONS pour les preflight CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'PATCH, OPTIONS',
    },
  });
}