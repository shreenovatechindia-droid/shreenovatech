const router = require('express').Router();
const db     = require('../config/db');
const { ok, err } = require('../middleware/helpers');
const { auth, roles } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC'
    );
    ok(res, rows);
  } catch { ok(res, []); }
});

router.post('/', auth, roles('super_admin','admin'), async (req, res) => {
  const { name, role, initials, rating = 5, quote, sort_order = 0 } = req.body;
  if (!name || !quote) return err(res, 'Name and quote required.');
  await db.execute(
    'INSERT INTO testimonials (name,role,initials,rating,quote,sort_order) VALUES (?,?,?,?,?,?)',
    [name, role||'', initials||name.slice(0,2).toUpperCase(), rating, quote, sort_order]
  );
  ok(res, null, 'Testimonial created', 201);
});

router.put('/:id', auth, roles('super_admin','admin'), async (req, res) => {
  const { name, role, initials, rating, quote, sort_order, is_active } = req.body;
  await db.execute(
    'UPDATE testimonials SET name=?,role=?,initials=?,rating=?,quote=?,sort_order=?,is_active=? WHERE id=?',
    [name, role, initials, rating, quote, sort_order, is_active, req.params.id]
  );
  ok(res, null, 'Testimonial updated');
});

router.delete('/:id', auth, roles('super_admin','admin'), async (req, res) => {
  await db.execute('DELETE FROM testimonials WHERE id = ?', [req.params.id]);
  ok(res, null, 'Testimonial deleted');
});

module.exports = router;
