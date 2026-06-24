const db = require("../db");

async function findAllEvents() {
  try {
    const result = await db.query(`
      SELECT
        id,
        title,
        description,
        start_date AS "startDate",
        end_date AS "endDate",
        location
      FROM events
      ORDER BY start_date
    `);
    return result.rows;
  } catch (error) {
    return MOCK_EVENTS;
  }
}
async function findEventById(id) {
  try {
    const result = await db.query(
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
      [id]
    );
    if (result.rows.length === 0) {
      return null;
    }
    return result.rows[0];
  } catch (error) {
    return MOCK_EVENTS.find((e) => e.id === id) || null;
  }
}


async function createEvent({ title, description, startDate, endDate, location }) {
  const result = await db.query(
    `INSERT INTO events (title, description, start_date, end_date, location)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, title, description, start_date AS "startDate", end_date AS "endDate", location`,
    [title, description, startDate, endDate, location]
  );
  return result.rows[0];
}

async function updateEvent(id, { title, description, startDate, endDate, location }) {
  const result = await db.query(
    `UPDATE events
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         start_date = COALESCE($3, start_date),
         end_date = COALESCE($4, end_date),
         location = COALESCE($5, location)
     WHERE id = $6
     RETURNING id, title, description, start_date AS "startDate", end_date AS "endDate", location`,
    [title, description, startDate, endDate, location, id]
  );
  return result.rows[0];
}

async function deleteEvent(id) {
  await db.query(`DELETE FROM events WHERE id = $1`, [id]);
  return true;
}

module.exports = {
  findAllEvents,
  findEventById,
  createEvent,
  updateEvent,
  deleteEvent,
};
