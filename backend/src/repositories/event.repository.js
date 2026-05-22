//repositories/event.repository.js

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

module.exports = {
  findAllEvents,
  findEventById,
};
