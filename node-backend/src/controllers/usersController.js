const bcrypt = require('bcryptjs');
const { AdminUser } = require('../models');
const { ok, err, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const rows = await AdminUser.find().select('-password_hash -reset_token -remember_token').sort({ created_at: -1 });
  ok(res, rows);
};

exports.show = async (req, res) => {
  const u = await AdminUser.findById(req.params.id).select('-password_hash -reset_token -remember_token');
  if (!u) return err(res, 'User not found', 404);
  ok(res, u);
};

exports.store = async (req, res) => {
  const { username, email, password, full_name, role='admin', is_active=true } = req.body;
  if (!username || !email || !password) return err(res, 'Username, email and password are required.');
  if (!/\S+@\S+\.\S+/.test(email)) return err(res, 'Invalid email.');
  if (password.length < 8) return err(res, 'Password must be at least 8 characters.');
  if (!['super_admin','admin','editor','support'].includes(role)) return err(res, 'Invalid role.');

  try {
    const hash = await bcrypt.hash(password, 12);
    const u    = await AdminUser.create({ username, email, password_hash: hash, full_name: full_name||'', role, is_active: !!is_active });
    await logActivity(req.user.id, 'create_user', 'users', u._id);
    ok(res, { id: u._id }, 'User created', 201);
  } catch {
    err(res, 'Username or email already exists.');
  }
};

exports.update = async (req, res) => {
  const { full_name, role, is_active, password } = req.body;
  const update = { full_name: full_name||'', role: role||'admin', is_active: !!is_active };
  if (password && password.length >= 8)
    update.password_hash = await bcrypt.hash(password, 12);
  await AdminUser.findByIdAndUpdate(req.params.id, update);
  await logActivity(req.user.id, 'update_user', 'users', req.params.id);
  ok(res, null, 'User updated');
};

exports.destroy = async (req, res) => {
  if (req.user.id == req.params.id) return err(res, 'Cannot delete your own account.');
  await AdminUser.findByIdAndDelete(req.params.id);
  await logActivity(req.user.id, 'delete_user', 'users', req.params.id);
  ok(res, null, 'User deleted');
};
