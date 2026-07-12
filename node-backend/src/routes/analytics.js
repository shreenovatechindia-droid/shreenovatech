const router = require('express').Router();
const c      = require('../controllers/analyticsController');
const { auth, roles } = require('../middleware/auth');

router.get('/',          auth, roles('super_admin','admin'), c.index);
router.put('/:id',       auth, roles('super_admin','admin'), c.update);
router.get('/visitors',  auth, roles('super_admin','admin'), c.visitors);
router.post('/track',    c.track);

module.exports = router;
