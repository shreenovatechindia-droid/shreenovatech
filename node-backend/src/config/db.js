const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// MySQL-compatible wrapper: converts ? placeholders to $1,$2,... and returns [rows] format
pool.execute = async (sql, params = []) => {
  let i = 0;
  const pgSql = sql.replace(/\?/g, () => `$${++i}`);
  const result = await pool.query(pgSql, params);
  return [result.rows, result.fields];
};

pool.on('connect', () => console.log('✅ PostgreSQL connected'));
pool.on('error', (err) => console.error('❌ PostgreSQL error:', err.message));

module.exports = pool;
