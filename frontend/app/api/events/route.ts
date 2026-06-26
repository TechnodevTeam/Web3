import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  user: process.env.DB_USER || 'user1',
  password: process.env.DB_PASSWORD || '01234',
  database: process.env.DB_NAME || 'eventsync_db',
});

export async function GET() {
  try {
    const result = await pool.query(
      `SELECT id, title, description, start_date, end_date, location 
       FROM events 
       ORDER BY start_date`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur GET events:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description, start_date, end_date, location } = body;

    if (!title || !start_date || !end_date) {
      return NextResponse.json(
        { error: 'Titre, date de début et de fin requis' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO events (title, description, start_date, end_date, location)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, description, start_date, end_date, location`,
      [title, description || null, start_date, end_date, location || null]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur POST event:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}