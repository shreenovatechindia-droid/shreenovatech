const router = require('express').Router();
const db     = require('../config/db');
const { ok, err } = require('../middleware/helpers');
const { auth, roles } = require('../middleware/auth');
const upload = require('../config/multer');

// GET all media
router.get('/', auth, async (req, res) => {
  try {
    const { folder } = req.query;
    const where  = folder ? 'WHERE folder = ?' : '';
    const params = folder ? [folder] : [];
    const [rows] = await db.execute(
      `SELECT * FROM media_files ${where} ORDER BY created_at DESC LIMIT 100`, params
    );
    ok(res, rows);
  } catch { ok(res, []); }
});

// POST upload media
router.post('/', auth, roles('super_admin', 'admin', 'editor'), upload.single('file'), async (req, res) => {
  if (!req.file) return err(res, 'No file uploaded.');
  const { folder = 'general' } = req.body;
  const filename = req.file.originalname;
  const fileUrl  = `${process.env.BASE_URL}/uploads/${folder}/${filename}`;
  const fileSize = req.file.size;
  const mimeType = req.file.mimetype;

  try {
    const [result] = await db.execute(
      'INSERT INTO media_files (filename, file_url, folder, file_size, mime_type, uploaded_by) VALUES (?,?,?,?,?,?)',
      [filename, fileUrl, folder, fileSize, mimeType, req.user.id]
    );
    ok(res, { id: result.insertId, url: fileUrl, filename }, 'File uploaded', 201);
  } catch { err(res, 'Upload failed.'); }
});

// DELETE media
router.delete('/:id', auth, roles('super_admin', 'admin'), async (req, res) => {
  await db.execute('DELETE FROM media_files WHERE id = ?', [req.params.id]);
  ok(res, null, 'File deleted');
});

module.exports = router;
