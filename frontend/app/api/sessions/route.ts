// frontend/app/api/sessions/route.ts
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
        sessions.id,
        sessions.event_id AS "eventId",
        events.title AS "eventTitle",
        sessions.room_id AS "roomId",
        sessions.title,
        sessions.description,
        sessions.start_time AS "startTime",
        sessions.end_time AS "endTime",
        rooms.name AS "roomName",
        CASE 
          WHEN CURRENT_TIMESTAMP BETWEEN sessions.start_time AND sessions.end_time 
          THEN true ELSE false 
        END AS live
      FROM sessions
      INNER JOIN rooms ON rooms.id = sessions.room_id
      INNER JOIN events ON events.id = sessions.event_id
      ORDER BY sessions.start_time
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Erreur GET sessions:', error);
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let { title, description, eventId, roomId, startTime, endTime, capacity } = body;

    console.log('📥 Données reçues:', { title, eventId, roomId, startTime, endTime, capacity });

    if (!title || !eventId || !roomId || !startTime || !endTime) {
      return NextResponse.json(
        { error: 'Titre, événement, salle, début et fin sont requis' },
        { status: 400 }
      );
    }

    const startDate = new Date(startTime);
    const endDate = new Date(endTime);

    if (startDate >= endDate) {
      return NextResponse.json(
        { error: 'La date de début doit être avant la date de fin' },
        { status: 400 }
      );
    }

    const formattedStart = startDate.toISOString();
    const formattedEnd = endDate.toISOString();

    // ✅ Insérer la session
    const result = await pool.query(
      `
      INSERT INTO sessions (event_id, room_id, title, description, start_time, end_time, capacity)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, event_id, room_id, title, description,
                start_time, end_time, capacity
      `,
      [eventId, roomId, title, description || null, formattedStart, formattedEnd, capacity || 0]
    );

    const session = result.rows[0];

    // ✅ Récupérer les infos liées
    const meta = await pool.query(
      `
      SELECT events.title AS "eventTitle", rooms.name AS "roomName"
      FROM events, rooms
      WHERE events.id = $1 AND rooms.id = $2
      `,
      [eventId, roomId]
    );

    // ✅ Construire la réponse avec TOUS les champs attendus par react-admin
    const responseData = {
      id: session.id,                    // ✅ ID obligatoire pour react-admin
      eventId: session.event_id,
      roomId: session.room_id,
      title: session.title,
      description: session.description,
      startTime: session.start_time,
      endTime: session.end_time,
      capacity: session.capacity,
      eventTitle: meta.rows[0]?.eventTitle || null,
      roomName: meta.rows[0]?.roomName || null,
      live: false,
    };

    console.log('✅ Session créée:', responseData);

    return NextResponse.json(responseData);
  } catch (error) {
    console.error('❌ Erreur POST session:', error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la création' },
      { status: 500 }
    );
  }
}