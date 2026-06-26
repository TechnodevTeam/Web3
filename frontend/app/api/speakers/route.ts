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
      `SELECT 
        id,
        full_name AS "fullName",
        photo_url AS "photoUrl",
        bio,
        external_links AS "externalLinks",
        COUNT(ss.session_id) AS "sessionCount"
      FROM speakers
      LEFT JOIN session_speakers ss ON speakers.id = ss.speaker_id
      GROUP BY speakers.id
      ORDER BY full_name`
    );
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur GET speakers:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, photoUrl, bio, externalLinks } = body;

    if (!fullName) {
      return NextResponse.json(
        { error: 'Le nom est requis' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO speakers (full_name, photo_url, bio, external_links)
       VALUES ($1, $2, $3, $4)
       RETURNING id, full_name AS "fullName", photo_url AS "photoUrl", bio, external_links AS "externalLinks"`,
      [fullName, photoUrl || null, bio || null, externalLinks || null]
    );

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur POST speaker:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}