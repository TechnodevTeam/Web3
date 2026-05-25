import { NextResponse } from 'next/server';

import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'user1',
  password: '01234',
  database: 'eventsync_db',
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: questionId } = await params;
    const result = await pool.query(
      `
      UPDATE questions 
      SET upvotes = upvotes + 1 
      WHERE id = $1 
      RETURNING id, upvotes
      `,
      [questionId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Question introuvable' }, { status: 404 });
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur PATCH upvote:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
