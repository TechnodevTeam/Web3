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
    console.log('GET - ID reçu:', id);
    const result = await pool.query(
      'SELECT id, title, description, start_date as "startDate", end_date as "endDate", location FROM events WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur GET event by id:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = params.id;
    console.log('PUT - ID reçu:', id);
    const body = await request.json();
    console.log('PUT - Body reçu:', body);
    const numericId = parseInt(id);
    const { title, description, startDate, endDate, location } = body;
    const result = await pool.query(
      `UPDATE events 
       SET title = $1, 
           description = $2, 
           start_date = $3, 
           end_date = $4, 
           location = $5 
       WHERE id = $6 
       RETURNING id, title, description, start_date as "startDate", end_date as "endDate", location`,
      [title, description, startDate, endDate, location, numericId]
    );
    console.log('PUT - Résultat:', result.rows[0]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Événement non trouvé' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur PUT event:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = params.id;
    console.log('DELETE - ID reçu:', id);
    const numericId = parseInt(id);
    await pool.query('DELETE FROM events WHERE id = $1', [numericId]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE event:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Allow': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
