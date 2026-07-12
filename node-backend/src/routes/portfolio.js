const router = require('express').Router();
const c      = require('../controllers/portfolioController');
const { auth, roles } = require('../middleware/auth');
const upload = require('../config/multer');

const editorRoles = roles('super_admin','admin','editor');

router.get('/',       c.index);
router.get('/:id',    c.show);
router.post('/',      auth, editorRoles, (req, res, next) => { req.uploadFolder = 'portfolio'; next(); }, upload.single('image'), c.store);
router.put('/:id',    auth, editorRoles, (req, res, next) => { req.uploadFolder = 'portfolio'; next(); }, upload.single('image'), c.update);
router.delete('/:id', auth, roles('super_admin','admin'), c.destroy);

module.exports = router;
