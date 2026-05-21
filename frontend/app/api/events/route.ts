import { NextResponse } from 'next/server';
// @ts-ignore
import { Pool } from 'pg';

// Configuration directe (remplacez par vos identifiants)
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'user1',
  password: '01234',  // Remplacez par votre vrai mot de passe
  database: 'eventsync_db',
});

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT 
        id, 
        title, 
        description, 
        start_date as "startDate", 
        end_date as "endDate", 
        location
      FROM events 
      ORDER BY start_date DESC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur GET events:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, startDate, endDate, location } = body;
    
    const result = await pool.query(
      `INSERT INTO events (title, description, start_date, end_date, location) 
       VALUES ($1, $2, $3, $4, $5) 
       RETURNING id, title, description, start_date as "startDate", end_date as "endDate", location`,
      [title, description, startDate, endDate, location]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur POST events:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, title, description, startDate, endDate, location } = body;
    
    const result = await pool.query(
      `UPDATE events 
       SET title = $1, description = $2, start_date = $3, end_date = $4, location = $5 
       WHERE id = $6 
       RETURNING id, title, description, start_date as "startDate", end_date as "endDate", location`,
      [title, description, startDate, endDate, location, id]
    );
    
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur PUT events:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    await pool.query('DELETE FROM events WHERE id = $1', [id]);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE events:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}