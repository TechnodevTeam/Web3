import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'user1',
  password: '01234',
  database: 'eventsync_db',
});


export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        name
      FROM rooms 
      ORDER BY name
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur GET rooms:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}


export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('POST - Body reçu:', body);
    
    const { name } = body;
    
    if (!name) {
      return NextResponse.json({ error: 'Le nom de la salle est requis' }, { status: 400 });
    }
    
    const result = await pool.query(
      `INSERT INTO rooms (name) 
       VALUES ($1) 
       RETURNING id, name`,
      [name]
    );
    
    console.log('POST - Salle créée:', result.rows[0]);
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur POST room:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}