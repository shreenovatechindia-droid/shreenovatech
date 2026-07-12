const router = require('express').Router();
const c      = require('../controllers/settingsController');
const { auth, roles } = require('../middleware/auth');

router.get('/',  c.index);
router.put('/',  auth, roles('super_admin','admin'), c.update);

module.exports = router;
