const router = require('express').Router();
const c      = require('../controllers/hostingController');
const { auth, roles } = require('../middleware/auth');

router.get('/',       c.index);
router.get('/:id',    c.show);
router.post('/',      auth, roles('super_admin','admin'), c.store);
router.put('/:id',    auth, roles('super_admin','admin'), c.update);
router.delete('/:id', auth, roles('super_admin','admin'), c.destroy);

module.exports = router;
