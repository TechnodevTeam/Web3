import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'user1',
  password: '01234',
  database: 'eventsync_db',
});

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email et mot de passe requis' }, { status: 400 });
    }
    
    const result = await pool.query(
      `SELECT id, first_name as "firstName", last_name as "lastName", 
              email, role, created_at as "createdAt"
       FROM users 
       WHERE email = $1 AND password = $2`,
      [email, password]
    );
    
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Identifiants incorrects' }, { status: 401 });
    }
    
    return NextResponse.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Erreur login:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}