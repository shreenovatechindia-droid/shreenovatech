const router = require('express').Router();
const c      = require('../controllers/dashboardController');
const { auth } = require('../middleware/auth');

router.get('/', auth, c.index);

module.exports = router;
