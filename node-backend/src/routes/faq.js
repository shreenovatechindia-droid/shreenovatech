const router = require('express').Router();
const db     = require('../config/db');
const { ok, err } = require('../middleware/helpers');
const { auth, roles } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const where  = category ? 'WHERE category = ? AND is_active = 1' : 'WHERE is_active = 1';
    const params = category ? [category] : [];
    const [rows] = await db.execute(
      `SELECT * FROM faqs ${where} ORDER BY sort_order ASC`, params
    );
    ok(res, rows);
  } catch { ok(res, []); }
});

router.post('/', auth, roles('super_admin','admin'), async (req, res) => {
  const { category = 'general', question, answer, sort_order = 0 } = req.body;
  if (!question || !answer) return err(res, 'Question and answer required.');
  await db.execute(
    'INSERT INTO faqs (category,question,answer,sort_order) VALUES (?,?,?,?)',
    [category, question, answer, sort_order]
  );
  ok(res, null, 'FAQ created', 201);
});

router.put('/:id', auth, roles('super_admin','admin'), async (req, res) => {
  const { category, question, answer, sort_order, is_active } = req.body;
  await db.execute(
    'UPDATE faqs SET category=?,question=?,answer=?,sort_order=?,is_active=? WHERE id=?',
    [category, question, answer, sort_order, is_active, req.params.id]
  );
  ok(res, null, 'FAQ updated');
});

router.delete('/:id', auth, roles('super_admin','admin'), async (req, res) => {
  await db.execute('DELETE FROM faqs WHERE id = ?', [req.params.id]);
  ok(res, null, 'FAQ deleted');
});

module.exports = router;
