const router = require('express').Router();
const { Media } = require('../models');
const { ok, err, logActivity } = require('../middleware/helpers');
const { auth, roles } = require('../middleware/auth');
const upload = require('../config/multer');

router.get('/', auth, async (req, res) => {
  try {
    const filter = req.query.folder ? { folder: req.query.folder } : {};
    const rows = await Media.find(filter).sort({ created_at: -1 }).limit(100);
    ok(res, rows);
  } catch { ok(res, []); }
});

router.post('/', auth, roles('super_admin','admin','editor'), upload.single('file'), async (req, res) => {
  if (!req.file) return err(res, 'No file uploaded.');
  const { folder = 'general' } = req.body;
  const fileUrl = `${process.env.BASE_URL}/uploads/${folder}/${req.file.filename}`;
  const m = await Media.create({
    filename:      req.file.filename,
    original_name: req.file.originalname,
    file_path:     req.file.path,
    file_url:      fileUrl,
    file_type:     req.file.mimetype,
    file_size:     req.file.size,
    folder,
    uploaded_by:   req.user.id,
  });
  await logActivity(req.user.id, 'upload', 'media', m._id);
  ok(res, { id: m._id, url: fileUrl, filename: m.filename }, 'File uploaded', 201);
});

router.delete('/:id', auth, roles('super_admin','admin'), async (req, res) => {
  await Media.findByIdAndDelete(req.params.id);
  await logActivity(req.user.id, 'delete', 'media', req.params.id);
  ok(res, null, 'File deleted');
});

module.exports = router;
