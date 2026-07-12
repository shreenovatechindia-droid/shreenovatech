const router = require('express').Router();
const c      = require('../controllers/bookingsController');
const { auth, roles } = require('../middleware/auth');
const upload = require('../config/multer');

const adminRoles = roles('super_admin', 'admin', 'support');

router.get('/',              auth, adminRoles, c.index);
router.get('/:id',           auth, adminRoles, c.show);
router.post('/',             upload.fields([
  { name: 'logoFile', maxCount: 1 },
  { name: 'imagesFile', maxCount: 1 },
  { name: 'docsFile', maxCount: 1 },
]), c.store);
router.put('/:id/status',    auth, adminRoles, c.updateStatus);
router.put('/:id',           auth, adminRoles, c.update);
router.delete('/:id',        auth, roles('super_admin', 'admin'), c.destroy);

module.exports = router;
