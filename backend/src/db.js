// backend/src/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'eventsync_db',
  password: process.env.DB_PASSWORD || '01234',
  port: process.env.DB_PORT || 5432,
  // ✅ Ajouter des options pour la stabilité
  max: 20, // Nombre max de connexions
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// ✅ Gestion des erreurs de connexion
pool.on('error', (err) => {
  console.error('❌ Erreur inattendue sur le pool PostgreSQL:', err);
});

// ✅ Tester la connexion au démarrage
async function testConnection() {
  try {
    const client = await pool.connect();
    console.log('✅ Connexion PostgreSQL établie');
    client.release();
    return true;
  } catch (err) {
    console.error('❌ Erreur de connexion PostgreSQL:', err.message);
    return false;
  }
}

// ✅ Fonction pour vérifier et réparer les séquences (appelée depuis syncSequences)
async function getMaxId(table) {
  const result = await pool.query(`SELECT COALESCE(MAX(id), 0) as max_id FROM ${table}`);
  return parseInt(result.rows[0].max_id);
}

module.exports = pool;
module.exports.testConnection = testConnection;
module.exports.getMaxId = getMaxId;