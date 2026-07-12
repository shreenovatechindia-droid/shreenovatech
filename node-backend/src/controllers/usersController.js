const bcrypt = require('bcryptjs');
const db     = require('../config/db');
const { ok, err, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const [rows] = await db.execute(
    'SELECT id,username,email,full_name,role,is_active,last_login,created_at FROM admin_users ORDER BY created_at DESC'
  );
  ok(res, rows);
};

exports.show = async (req, res) => {
  const [rows] = await db.execute(
    'SELECT id,username,email,full_name,role,is_active,last_login,created_at FROM admin_users WHERE id = ?',
    [req.params.id]
  );
  if (!rows[0]) return err(res, 'User not found', 404);
  ok(res, rows[0]);
};

exports.store = async (req, res) => {
  const { username, email, password, full_name, role = 'admin', is_active = 1 } = req.body;
  if (!username || !email || !password) return err(res, 'Username, email and password are required.');
  if (!/\S+@\S+\.\S+/.test(email)) return err(res, 'Invalid email.');
  if (password.length < 8) return err(res, 'Password must be at least 8 characters.');
  if (!['super_admin','admin','editor','support'].includes(role)) return err(res, 'Invalid role.');

  const hash = await bcrypt.hash(password, 12);
  try {
    const [result] = await db.execute(
      'INSERT INTO admin_users (username,email,password_hash,full_name,role,is_active) VALUES (?,?,?,?,?,?)',
      [username, email, hash, full_name||'', role, parseInt(is_active)||1]
    );
    await logActivity(req.user.id, 'create_user', 'users', result.insertId);
    ok(res, { id: result.insertId }, 'User created', 201);
  } catch {
    err(res, 'Username or email already exists.');
  }
};

exports.update = async (req, res) => {
  const { full_name, role, is_active, password } = req.body;
  await db.execute(
    'UPDATE admin_users SET full_name=?,role=?,is_active=? WHERE id=?',
    [full_name||'', role||'admin', parseInt(is_active)||1, req.params.id]
  );
  if (password && password.length >= 8) {
    const hash = await bcrypt.hash(password, 12);
    await db.execute('UPDATE admin_users SET password_hash=? WHERE id=?', [hash, req.params.id]);
  }
  await logActivity(req.user.id, 'update_user', 'users', req.params.id);
  ok(res, null, 'User updated');
};

exports.destroy = async (req, res) => {
  if (req.user.id == req.params.id) return err(res, 'Cannot delete your own account.');
  await db.execute('DELETE FROM admin_users WHERE id = ?', [req.params.id]);
  await logActivity(req.user.id, 'delete_user', 'users', req.params.id);
  ok(res, null, 'User deleted');
};
