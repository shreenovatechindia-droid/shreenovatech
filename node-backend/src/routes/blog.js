const router = require('express').Router();
const db     = require('../config/db');
const { ok, err, paginate, logActivity } = require('../middleware/helpers');
const { auth, roles } = require('../middleware/auth');

// Public: list active blogs
router.get('/', async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page) || 1);
    const limit  = Math.min(50, parseInt(req.query.limit) || 10);
    const offset = (page - 1) * limit;
    const admin  = req.query.all;

    const where  = admin ? '' : 'WHERE is_active = 1';
    const [[{ total }]] = await db.execute(`SELECT COUNT(*) as total FROM blogs ${where}`);
    const [rows] = await db.execute(
      `SELECT * FROM blogs ${where} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`
    );
    ok(res, { blogs: rows, pagination: paginate(total, page, limit) });
  } catch { ok(res, { blogs: [], pagination: null }); }
});

// Public: single blog
router.get('/:id', async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM blogs WHERE id = ?', [req.params.id]);
  if (!rows[0]) return err(res, 'Blog not found', 404);
  ok(res, rows[0]);
});

// Admin: create
router.post('/', auth, roles('super_admin', 'admin', 'editor'), async (req, res) => {
  const { title, slug, content, excerpt, image_url, category, tags, is_active = 1 } = req.body;
  if (!title || !content) return err(res, 'Title and content are required.');
  const [result] = await db.execute(
    'INSERT INTO blogs (title, slug, content, excerpt, image_url, category, tags, is_active) VALUES (?,?,?,?,?,?,?,?)',
    [title, slug || title.toLowerCase().replace(/\s+/g, '-'), content, excerpt || '', image_url || '', category || 'general', tags || '', parseInt(is_active)]
  );
  await logActivity(req.user.id, 'create', 'blog', result.insertId);
  ok(res, { id: result.insertId }, 'Blog created', 201);
});

// Admin: update
router.put('/:id', auth, roles('super_admin', 'admin', 'editor'), async (req, res) => {
  const { title, slug, content, excerpt, image_url, category, tags, is_active } = req.body;
  await db.execute(
    'UPDATE blogs SET title=?, slug=?, content=?, excerpt=?, image_url=?, category=?, tags=?, is_active=? WHERE id=?',
    [title, slug || '', content, excerpt || '', image_url || '', category || 'general', tags || '', parseInt(is_active), req.params.id]
  );
  await logActivity(req.user.id, 'update', 'blog', req.params.id);
  ok(res, null, 'Blog updated');
});

// Admin: delete
router.delete('/:id', auth, roles('super_admin', 'admin'), async (req, res) => {
  await db.execute('DELETE FROM blogs WHERE id = ?', [req.params.id]);
  await logActivity(req.user.id, 'delete', 'blog', req.params.id);
  ok(res, null, 'Blog deleted');
});

module.exports = router;
