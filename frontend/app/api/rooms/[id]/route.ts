import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'user1',
  password: '01234',
  database: 'eventsync_db',
});

// GET - Récupérer une salle par ID
export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    
    const result = await pool.query(
      `SELECT id, name FROM rooms WHERE id = $1`,
      [id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Salle non trouvée' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur GET room by id:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// PUT - Mettre à jour une salle
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    const body = await request.json();
    const { name } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Le nom de la salle est requis' }, { status: 400 });
    }
    
    const result = await pool.query(
      `UPDATE rooms SET name = $1 WHERE id = $2 RETURNING id, name`,
      [name, id]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Salle non trouvée' }, { status: 404 });
    }
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur PUT room:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// DELETE - Supprimer une salle
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    
    await pool.query('DELETE FROM rooms WHERE id = $1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE room:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}