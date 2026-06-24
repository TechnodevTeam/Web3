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
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    const result = await pool.query(
      `SELECT id, first_name as "firstName", last_name as "lastName", 
              email, role, created_at as "createdAt"
       FROM users WHERE id = $1`,
      [id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 });
    }
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur GET user by id:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
export async function PUT(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    const body = await request.json();
    const { firstName, lastName, email, role } = body;
    const result = await pool.query(
      `UPDATE users 
       SET first_name = $1, last_name = $2, email = $3, role = $4 
       WHERE id = $5 
       RETURNING id, first_name as "firstName", last_name as "lastName", email, role`,
      [firstName, lastName, email, role, id]
    );
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur PUT user:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
export async function DELETE(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const params = await context.params;
    const id = parseInt(params.id);
    await pool.query('DELETE FROM users WHERE id = $1', [id]);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE user:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
