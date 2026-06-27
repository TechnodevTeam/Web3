require("dotenv").config();

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

(async () => {
  try {
    const client = await pool.connect();
    console.log("Connexion réussie !");
    const res = await client.query("SELECT NOW()");
    console.log(res.rows);
    client.release();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();