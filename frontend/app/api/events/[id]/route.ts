// frontend/app/api/events/[id]/route.ts
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
    const eventId = parseInt(id);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'ID d\'événement invalide' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `
      SELECT 
        id,
        title,
        description,
        start_date AS "startDate",
        end_date AS "endDate",
        location
      FROM events
      WHERE id = $1
      `,
      [eventId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur GET event:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'ID d\'événement invalide' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { title, description, startDate, endDate, location } = body;

    const result = await pool.query(
      `
      UPDATE events
      SET 
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        start_date = COALESCE($3, start_date),
        end_date = COALESCE($4, end_date),
        location = COALESCE($5, location)
      WHERE id = $6
      RETURNING id, title, description, start_date AS "startDate", end_date AS "endDate", location
      `,
      [title || null, description || null, startDate || null, endDate || null, location || null, eventId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur PUT event:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const eventId = parseInt(id);

    if (isNaN(eventId)) {
      return NextResponse.json(
        { error: 'ID d\'événement invalide' },
        { status: 400 }
      );
    }

    const result = await pool.query(
      'DELETE FROM events WHERE id = $1 RETURNING id',
      [eventId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur DELETE event:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}