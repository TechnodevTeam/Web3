const db = require("../db");

const MOCK_ROOMS = [
  { id: 1, name: "Salle Galaxie", capacity: 200, type: "Conférence" },
  { id: 2, name: "Salle Nébuleuse", capacity: 50, type: "Workshop" },
  { id: 3, name: "Salle NP", capacity: 100, type: "Conférence" },
  { id: 4, name: "Salle Alpha", capacity: 80, type: "Conférence" },
  { id: 5, name: "Salle Beta", capacity: 40, type: "Workshop" },
  { id: 6, name: "Salle Gamma", capacity: 60, type: "Workshop" },
  { id: 7, name: "Salle Delta", capacity: 120, type: "Table ronde" },
  { id: 8, name: "Salle Epsilon", capacity: 30, type: "Workshop" },
  { id: 9, name: "Salle Zêta", capacity: 150, type: "Conférence" }
];

const MOCK_SESSIONS = [
  {
    id: 1,
    eventId: 1,
    roomId: 1,
    title: "Keynote d'ouverture",
    description: "Introduction par les fondateurs sur l'avenir du Web3.",
    startTime: "2026-06-10T09:30:00Z",
    endTime: "2026-06-10T10:30:00Z",
    capacity: 200,
    roomName: "Salle Galaxie",
    live: false
  },
  {
    id: 2,
    eventId: 1,
    roomId: 2,
    title: "Workshop Solidity",
    description: "Apprenez à coder votre premier smart contract.",
    startTime: "2026-06-10T11:00:00Z",
    endTime: "2026-06-10T13:00:00Z",
    capacity: 50,
    roomName: "Salle Nébuleuse",
    live: true
  },
  {
    id: 3,
    eventId: 2,
    roomId: 3,
    title: "Conférence NP",
    description: "Présentation des nouvelles technologies NP.",
    startTime: "2026-07-15T10:00:00Z",
    endTime: "2026-07-15T12:00:00Z",
    capacity: 100,
    roomName: "Salle NP",
    live: false
  },
  {
    id: 4,
    eventId: 3,
    roomId: 4,
    title: "Session Alpha",
    description: "Exploration des concepts Alpha.",
    startTime: "2026-08-05T09:00:00Z",
    endTime: "2026-08-05T11:00:00Z",
    capacity: 80,
    roomName: "Salle Alpha",
    live: false
  },
  {
    id: 5,
    eventId: 4,
    roomId: 5,
    title: "Atelier Beta",
    description: "Session pratique dans la salle Beta.",
    startTime: "2026-08-10T14:00:00Z",
    endTime: "2026-08-10T16:00:00Z",
    capacity: 40,
    roomName: "Salle Beta",
    live: false
  },
  {
    id: 6,
    eventId: 5,
    roomId: 6,
    title: "Exploration Gamma",
    description: "Découverte des outils Gamma.",
    startTime: "2026-09-01T10:00:00Z",
    endTime: "2026-09-01T12:00:00Z",
    capacity: 60,
    roomName: "Salle Gamma",
    live: false
  },
  {
    id: 7,
    eventId: 6,
    roomId: 7,
    title: "Table ronde Delta",
    description: "Discussion ouverte sur les protocoles Delta.",
    startTime: "2026-10-15T15:00:00Z",
    endTime: "2026-10-15T17:00:00Z",
    capacity: 120,
    roomName: "Salle Delta",
    live: false
  },
  {
    id: 8,
    eventId: 7,
    roomId: 8,
    title: "Masterclass Epsilon",
    description: "Expertise approfondie en salle Epsilon.",
    startTime: "2026-11-20T09:00:00Z",
    endTime: "2026-11-20T12:00:00Z",
    capacity: 30,
    roomName: "Salle Epsilon",
    live: false
  },
  {
    id: 9,
    eventId: 8,
    roomId: 9,
    title: "Conférence Zêta",
    description: "Découverte des nouveaux horizons avec Zêta.",
    startTime: "2026-12-05T10:00:00Z",
    endTime: "2026-12-05T13:00:00Z",
    capacity: 150,
    roomName: "Salle Zêta",
    live: false
  }
];

async function findAllRooms() {
  try {
    const result = await db.query(`
      SELECT id, name
      FROM rooms
      ORDER BY name
    `);
    return result.rows;
  } catch (error) {
    return MOCK_ROOMS;
  }
}

async function findSessionsByRoomId(roomId) {
  try {
    const result = await db.query(
      `
      SELECT
        sessions.id,
        sessions.event_id AS "eventId",
        sessions.room_id AS "roomId",
        sessions.title,
        sessions.description,
        sessions.start_time AS "startTime",
        sessions.end_time AS "endTime",
        sessions.capacity,
        rooms.name AS "roomName",
        CASE
          WHEN CURRENT_TIMESTAMP BETWEEN sessions.start_time AND sessions.end_time
          THEN true
          ELSE false
        END AS live
      FROM sessions
      INNER JOIN rooms
        ON sessions.room_id = rooms.id
      WHERE sessions.room_id = $1
      ORDER BY sessions.start_time
      `,
      [roomId]
    );
    return result.rows;
  } catch (error) {
    return MOCK_SESSIONS.filter((s) => s.roomId === Number(roomId));
  }

async function findAllRooms() {
  const result = await db.query(`
    SELECT
      rooms.id,
      rooms.name,

      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', sessions.id,
            'title', sessions.title,
            'startTime', sessions.start_time,
            'endTime', sessions.end_time
          )
        ) FILTER (WHERE sessions.id IS NOT NULL),
        '[]'
      ) AS sessions

    FROM rooms

    LEFT JOIN sessions
      ON rooms.id = sessions.room_id

    GROUP BY rooms.id

    ORDER BY rooms.name
  `);

  return result.rows;
}

module.exports = {
  findAllRooms,
  findSessionsByRoomId,
};
};
