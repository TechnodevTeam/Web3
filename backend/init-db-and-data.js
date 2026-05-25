const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

const initDbFile = path.resolve(__dirname, 'init-db.sql');
const initDataFile = path.resolve(__dirname, 'init-data.sql');

const initDbSql = fs.readFileSync(initDbFile, 'utf8');
const initDataSql = fs.readFileSync(initDataFile, 'utf8');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

async function run() {
  try {
    console.log('Running schema SQL...');
    await pool.query(initDbSql);
    console.log('Schema created or already exists.');

    console.log('Seeding data...');
    await pool.query(initDataSql);
    console.log('Data seeding complete.');
  } catch (err) {
    console.error('Database initialization error:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

run();
