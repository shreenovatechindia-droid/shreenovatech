const router  = require('express').Router();
const c       = require('../controllers/authController');
const { auth } = require('../middleware/auth');

router.post('/login',           c.login);
router.post('/logout',          auth, c.logout);
router.get('/me',               auth, c.me);
router.put('/change-password',  auth, c.changePassword);
router.post('/forgot',          c.forgotPassword);
router.post('/reset',           c.resetPassword);

module.exports = router;
