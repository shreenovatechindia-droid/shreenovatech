const bcrypt   = require('bcryptjs');
const db       = require('../config/db');
const { generateToken } = require('../config/jwt');
const { ok, err, logActivity } = require('../middleware/helpers');
const crypto   = require('crypto');

exports.login = async (req, res) => {
  const { email, password, remember } = req.body;
  if (!email || !password) return err(res, 'Email and password are required.');

  const [rows] = await db.execute(
    'SELECT * FROM admin_users WHERE email = ? AND is_active = 1 LIMIT 1', [email]
  );
  const user = rows[0];
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return err(res, 'Invalid email or password.', 401);

  const token = generateToken(user);
  await db.execute('UPDATE admin_users SET last_login = NOW() WHERE id = ?', [user.id]);

  if (remember) {
    const remToken = crypto.randomBytes(32).toString('hex');
    await db.execute('UPDATE admin_users SET remember_token = ? WHERE id = ?', [remToken, user.id]);
  }

  await logActivity(user.id, 'login', 'auth');
  ok(res, {
    token,
    user: { id: user.id, username: user.username, email: user.email, full_name: user.full_name, role: user.role },
  }, 'Login successful');
};

exports.logout = async (req, res) => {
  await logActivity(req.user.id, 'logout', 'auth');
  ok(res, null, 'Logged out successfully');
};

exports.me = async (req, res) => {
  const [rows] = await db.execute(
    'SELECT id, username, email, full_name, role, last_login FROM admin_users WHERE id = ?', [req.user.id]
  );
  if (!rows[0]) return err(res, 'User not found', 404);
  ok(res, rows[0]);
};

exports.changePassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password || new_password.length < 8)
    return err(res, 'Current password and new password (min 8 chars) required.');

  const [rows] = await db.execute('SELECT * FROM admin_users WHERE id = ?', [req.user.id]);
  const user = rows[0];
  if (!user || !(await bcrypt.compare(current_password, user.password_hash)))
    return err(res, 'Current password is incorrect.', 401);

  const hash = await bcrypt.hash(new_password, 12);
  await db.execute('UPDATE admin_users SET password_hash = ? WHERE id = ?', [hash, req.user.id]);
  await logActivity(req.user.id, 'change_password', 'auth');
  ok(res, null, 'Password changed successfully');
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return err(res, 'Email is required.');

  const [rows] = await db.execute(
    'SELECT id FROM admin_users WHERE email = ? AND is_active = 1', [email]
  );
  if (rows[0]) {
    const token   = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 3600000).toISOString().slice(0, 19).replace('T', ' ');
    await db.execute(
      'UPDATE admin_users SET reset_token = ?, reset_expires = ? WHERE id = ?',
      [token, expires, rows[0].id]
    );
    // TODO: send email with reset link containing token
  }
  ok(res, null, 'If that email exists, a reset link has been sent.');
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password || password.length < 8)
    return err(res, 'Token and password (min 8 chars) required.');

  const [rows] = await db.execute(
    'SELECT id FROM admin_users WHERE reset_token = ? AND reset_expires > NOW()', [token]
  );
  if (!rows[0]) return err(res, 'Invalid or expired reset token.');

  const hash = await bcrypt.hash(password, 12);
  await db.execute(
    'UPDATE admin_users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?',
    [hash, rows[0].id]
  );
  ok(res, null, 'Password reset successfully.');
};
