const router  = require('express').Router();
const c       = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const bcrypt  = require('bcryptjs');
const { AdminUser } = require('../models');

router.post('/login',           c.login);
router.post('/logout',          auth, c.logout);
router.get('/me',               auth, c.me);
router.put('/change-password',  auth, c.changePassword);
router.post('/forgot',          c.forgotPassword);
router.post('/reset',           c.resetPassword);

// TEMP: seed route — remove after first use
router.get('/setup-admin', async (req, res) => {
  const secret = req.query.secret;
  if (secret !== 'SNT_SETUP_2024') return res.status(403).json({ success: false, message: 'Forbidden' });
  const existing = await AdminUser.findOne({ email: 'admin@shreenovatech.in' });
  if (existing) return res.json({ success: true, message: 'Admin already exists' });
  const password_hash = await bcrypt.hash('Admin@123', 12);
  await AdminUser.create({ username: 'admin', email: 'admin@shreenovatech.in', password_hash, full_name: 'Super Admin', role: 'super_admin', is_active: true });
  res.json({ success: true, message: 'Admin created! Email: admin@shreenovatech.in | Password: Admin@123' });
});

module.exports = router;
