const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });
const sqlFile = path.resolve(__dirname, 'init-db.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');
const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});
pool
  .query(sql)
  .then(() => {
    console.log('Database initialization complete.');
  })
  .catch((error) => {
    console.error('Database initialization failed:', error);
    if (error.code === '42501') {
      console.error('Vérifiez que l’utilisateur PostgreSQL a les droits CREATE sur le schéma public.');
      console.error('Par exemple, exécutez en tant que superutilisateur PostgreSQL :');
      console.error("  ALTER SCHEMA public OWNER TO user1;");
      console.error("  GRANT ALL ON SCHEMA public TO user1;");
    }
    process.exitCode = 1;
  })
  .finally(() => pool.end());
