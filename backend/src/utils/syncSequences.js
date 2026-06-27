const pool = require("../db");

async function syncAllSequences() {
  console.log("🔄 Synchronisation des séquences...");

  const tables = [
    "sessions",
    "events",
    "rooms",
    "speakers",
    "users",
    "questions",
    "answers",
  ];

  for (const table of tables) {
    try {
      await pool.query(`
        SELECT setval(
          pg_get_serial_sequence('${table}', 'id'),
          COALESCE((SELECT MAX(id) FROM ${table}), 0) + 1,
          false
        );
      `);

      console.log(`✅ ${table} synchronisée`);
    } catch (err) {
      console.error(`❌ Erreur ${table}:`);
      console.error(err);
    }
  }

  console.log("✅ Synchronisation terminée");
}

module.exports = {
  syncAllSequences,
};