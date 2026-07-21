const router  = require('express').Router();
const c       = require('../controllers/authController');
const { auth } = require('../middleware/auth');

// TEMP: remove after use
router.get('/setup-admin', async (req, res) => {
  if (req.query.secret !== 'SNT_SETUP_2024') return res.status(403).json({ success: false });
  const bcrypt = require('bcryptjs');
  const { AdminUser } = require('../models');
  await AdminUser.deleteOne({ email: 'admin@shreenovatech.in' });
  await AdminUser.create({
    username: 'admin',
    email: 'admin@shreenovatech.in',
    password_hash: await bcrypt.hash('Admin@123', 12),
    full_name: 'Super Admin',
    role: 'super_admin',
    is_active: true,
  });
  res.json({ success: true, message: 'Admin created' });
});

router.post('/login',           c.login);
router.post('/logout',          auth, c.logout);
router.get('/me',               auth, c.me);
router.put('/change-password',  auth, c.changePassword);
router.post('/forgot',          c.forgotPassword);
router.post('/reset',           c.resetPassword);

module.exports = router;
