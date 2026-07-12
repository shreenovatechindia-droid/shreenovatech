const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'SNT_JWT_SECRET_KEY_2024_SHREENOVATECH';
const EXPIRES = process.env.JWT_EXPIRES_IN || '24h';

const generateToken = (user) =>
  jwt.sign({ id: user.id, role: user.role, email: user.email }, SECRET, { expiresIn: EXPIRES });

const verifyToken = (token) => jwt.verify(token, SECRET);

module.exports = { generateToken, verifyToken };
