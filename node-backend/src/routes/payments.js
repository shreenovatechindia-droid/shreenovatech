const router = require('express').Router();
const c      = require('../controllers/paymentsController');
const { auth, roles } = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/',           auth, roles('super_admin','admin'), c.index);
router.get('/:id',        auth, roles('super_admin','admin'), c.show);
router.post('/',          (req, res, next) => { req.uploadFolder = 'payments'; next(); }, upload.single('screenshot'), c.store);
router.put('/:id/status', auth, roles('super_admin','admin'), c.updateStatus);
router.delete('/:id',     auth, roles('super_admin','admin'), c.destroy);

module.exports = router;
