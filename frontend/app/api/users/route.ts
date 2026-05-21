import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'user1',
  password: '01234',
  database: 'eventsync_db',
});

// GET - Récupérer tous les utilisateurs
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, first_name as "firstName", last_name as "lastName", 
             email, role, created_at as "createdAt"
      FROM users 
      ORDER BY created_at DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur GET users:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

// POST - Créer un utilisateur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, password, role } = body;
    
    const result = await pool.query(
      `INSERT INTO users (first_name, last_name, email, password, role) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, first_name as "firstName", last_name as "lastName", email, role`,
      [firstName, lastName, email, password, role || 'user']
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur POST user:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}