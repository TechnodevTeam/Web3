const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  user: 'user1',
  password: '01234',
  database: 'eventsync_db',
});

async function run() {
  try {
    console.log('Checking "users" table content...');
    const res = await pool.query('SELECT id, email, password, role FROM users');
    console.log('Users found:', res.rows);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    await pool.end();
  }
}

run();
