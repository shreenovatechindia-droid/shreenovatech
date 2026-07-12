const { verifyToken } = require('../config/jwt');

const auth = (req, res, next) => {
  const header = req.headers.authorization || '';
  const token  = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ success: false, message: 'No token provided' });
  try {
    req.user = verifyToken(token);
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

const roles = (...allowed) => (req, res, next) => {
  if (!allowed.includes(req.user?.role))
    return res.status(403).json({ success: false, message: 'Insufficient permissions' });
  next();
};

module.exports = { auth, roles };
