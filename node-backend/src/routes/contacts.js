const router = require('express').Router();
const c      = require('../controllers/contactsController');
const { auth, roles } = require('../middleware/auth');

const adminRoles = roles('super_admin','admin','support');

router.get('/',          auth, adminRoles, c.index);
router.get('/:id',       auth, adminRoles, c.show);
router.post('/',         c.store);
router.put('/:id/reply', auth, adminRoles, c.reply);
router.put('/:id',       auth, adminRoles, c.update);
router.delete('/:id',    auth, roles('super_admin','admin'), c.destroy);

module.exports = router;
