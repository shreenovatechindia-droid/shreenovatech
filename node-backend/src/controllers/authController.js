const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const { AdminUser } = require('../models');
const { generateToken } = require('../config/jwt');
const { ok, err, logActivity } = require('../middleware/helpers');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return err(res, 'Email and password are required.');

  const user = await AdminUser.findOne({ email, is_active: true });
  if (!user || !(await bcrypt.compare(password, user.password_hash)))
    return err(res, 'Invalid email or password.', 401);

  const token = generateToken({ id: user._id, role: user.role, email: user.email });
  user.last_login = new Date();
  await user.save();
  await logActivity(user._id, 'login', 'auth');
  ok(res, {
    token,
    user: { id: user._id, username: user.username, email: user.email, full_name: user.full_name, role: user.role },
  }, 'Login successful');
};

exports.logout = async (req, res) => {
  await logActivity(req.user.id, 'logout', 'auth');
  ok(res, null, 'Logged out successfully');
};

exports.me = async (req, res) => {
  const user = await AdminUser.findById(req.user.id).select('-password_hash -reset_token -remember_token');
  if (!user) return err(res, 'User not found', 404);
  ok(res, user);
};

exports.changePassword = async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password || new_password.length < 8)
    return err(res, 'Current password and new password (min 8 chars) required.');

  const user = await AdminUser.findById(req.user.id);
  if (!user || !(await bcrypt.compare(current_password, user.password_hash)))
    return err(res, 'Current password is incorrect.', 401);

  user.password_hash = await bcrypt.hash(new_password, 12);
  await user.save();
  await logActivity(req.user.id, 'change_password', 'auth');
  ok(res, null, 'Password changed successfully');
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return err(res, 'Email is required.');
  const user = await AdminUser.findOne({ email, is_active: true });
  if (user) {
    user.reset_token   = crypto.randomBytes(32).toString('hex');
    user.reset_expires = new Date(Date.now() + 3600000);
    await user.save();
  }
  ok(res, null, 'If that email exists, a reset link has been sent.');
};

exports.resetPassword = async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password || password.length < 8)
    return err(res, 'Token and password (min 8 chars) required.');

  const user = await AdminUser.findOne({ reset_token: token, reset_expires: { $gt: new Date() } });
  if (!user) return err(res, 'Invalid or expired reset token.');

  user.password_hash = await bcrypt.hash(password, 12);
  user.reset_token   = undefined;
  user.reset_expires = undefined;
  await user.save();
  ok(res, null, 'Password reset successfully.');
};
