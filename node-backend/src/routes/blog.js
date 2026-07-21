const router = require('express').Router();
const { Blog } = require('../models');
const { ok, err, paginate, logActivity } = require('../middleware/helpers');
const { auth, roles } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const page   = Math.max(1, parseInt(req.query.page) || 1);
    const limit  = Math.min(50, parseInt(req.query.limit) || 10);
    const filter = req.query.all ? {} : { is_active: true };
    const total  = await Blog.countDocuments(filter);
    const rows   = await Blog.find(filter).sort({ created_at: -1 }).skip((page-1)*limit).limit(limit);
    ok(res, { blogs: rows, pagination: paginate(total, page, limit) });
  } catch { ok(res, { blogs: [], pagination: null }); }
});

router.get('/:id', async (req, res) => {
  const b = await Blog.findById(req.params.id);
  if (!b) return err(res, 'Blog not found', 404);
  ok(res, b);
});

router.post('/', auth, roles('super_admin','admin','editor'), async (req, res) => {
  const { title, slug, content, excerpt, image_url, category, tags, is_active=true } = req.body;
  if (!title || !content) return err(res, 'Title and content are required.');
  const b = await Blog.create({
    title, slug: slug || title.toLowerCase().replace(/\s+/g,'-'),
    content, excerpt: excerpt||'', image_url: image_url||'',
    category: category||'general',
    tags: Array.isArray(tags) ? tags : (tags||'').split(',').map(s=>s.trim()).filter(Boolean),
    is_active: !!is_active, author: req.user?.id,
  });
  await logActivity(req.user.id, 'create', 'blog', b._id);
  ok(res, { id: b._id }, 'Blog created', 201);
});

router.put('/:id', auth, roles('super_admin','admin','editor'), async (req, res) => {
  const { title, slug, content, excerpt, image_url, category, tags, is_active } = req.body;
  await Blog.findByIdAndUpdate(req.params.id, {
    title, slug, content, excerpt, image_url,
    category: category||'general',
    tags: Array.isArray(tags) ? tags : (tags||'').split(',').map(s=>s.trim()).filter(Boolean),
    is_active: !!is_active,
  });
  await logActivity(req.user.id, 'update', 'blog', req.params.id);
  ok(res, null, 'Blog updated');
});

router.delete('/:id', auth, roles('super_admin','admin'), async (req, res) => {
  await Blog.findByIdAndDelete(req.params.id);
  await logActivity(req.user.id, 'delete', 'blog', req.params.id);
  ok(res, null, 'Blog deleted');
});

module.exports = router;
