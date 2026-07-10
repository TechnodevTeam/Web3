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
        title,
        description,
        start_date AS "startDate",
        end_date AS "endDate",
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

    if (!title) {
      return NextResponse.json(
        { error: 'Le titre est requis' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      INSERT INTO events (title, description, start_date, end_date, location)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING id, title, description, start_date AS "startDate", end_date AS "endDate", location
      `,
      [title, description || null, startDate || null, endDate || null, location || null]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur POST event:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}
