const mysql = require('mysql2/promise');
require('dotenv').config();

let poolConfig;

if (process.env.DATABASE_URL) {
  // Aiven / Railway DATABASE_URL format
  poolConfig = {
    uri: process.env.DATABASE_URL,
    waitForConnections: true,
    connectionLimit: 10,
    charset: 'utf8mb4',
    ssl: { rejectUnauthorized: false },
  };
} else {
  poolConfig = {
    host:               process.env.DB_HOST     || 'localhost',
    port:               parseInt(process.env.DB_PORT) || 3306,
    user:               process.env.DB_USER     || 'root',
    password:           process.env.DB_PASS     || '',
    database:           process.env.DB_NAME     || 'shreenovatech_db',
    waitForConnections: true,
    connectionLimit:    10,
    charset:            'utf8mb4',
    ...(process.env.DB_SSL === 'true' && { ssl: { rejectUnauthorized: false } }),
  };
}

const pool = mysql.createPool(poolConfig);

// Test connection on startup
pool.getConnection()
  .then(conn => { console.log('✅ MySQL connected'); conn.release(); })
  .catch(err => console.error('❌ MySQL connection failed:', err.message));

module.exports = pool;
