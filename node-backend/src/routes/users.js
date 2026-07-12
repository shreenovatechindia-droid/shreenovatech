const router = require('express').Router();
const c      = require('../controllers/usersController');
const { auth, roles } = require('../middleware/auth');

router.get('/',       auth, roles('super_admin','admin'), c.index);
router.get('/:id',    auth, roles('super_admin','admin'), c.show);
router.post('/',      auth, roles('super_admin'), c.store);
router.put('/:id',    auth, roles('super_admin','admin'), c.update);
router.delete('/:id', auth, roles('super_admin'), c.destroy);

module.exports = router;
