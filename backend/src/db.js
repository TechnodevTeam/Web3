const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'eventsync_db',
  password: process.env.DB_PASSWORD || '01234',
  port: process.env.DB_PORT || 5432,
  
  max: 20, 
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('error', (err) => {
  console.error('❌ Erreur inattendue sur le pool PostgreSQL:', err);
});

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

async function getMaxId(table) {
  const result = await pool.query(`SELECT COALESCE(MAX(id), 0) as max_id FROM ${table}`);
  return parseInt(result.rows[0].max_id);
}

module.exports = pool;
module.exports.testConnection = testConnection;
module.exports.getMaxId = getMaxId;
