const router = require('express').Router();
const { Testimonial } = require('../models');
const { ok, err, logActivity } = require('../middleware/helpers');
const { auth, roles } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const filter = req.query.all ? {} : { is_active: true };
    const rows = await Testimonial.find(filter).sort({ sort_order: 1 });
    ok(res, rows);
  } catch { ok(res, []); }
});

router.post('/', auth, roles('super_admin','admin'), async (req, res) => {
  const { name, role, initials, rating=5, quote, sort_order=0 } = req.body;
  if (!name || !quote) return err(res, 'Name and quote required.');
  const t = await Testimonial.create({ name, role, initials, rating, quote, sort_order });
  await logActivity(req.user.id, 'create', 'testimonials', t._id);
  ok(res, { id: t._id }, 'Testimonial created', 201);
});

router.put('/:id', auth, roles('super_admin','admin'), async (req, res) => {
  const { name, role, initials, rating, quote, sort_order, is_active } = req.body;
  await Testimonial.findByIdAndUpdate(req.params.id, { name, role, initials, rating, quote, sort_order, is_active });
  await logActivity(req.user.id, 'update', 'testimonials', req.params.id);
  ok(res, null, 'Testimonial updated');
});

router.delete('/:id', auth, roles('super_admin','admin'), async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  await logActivity(req.user.id, 'delete', 'testimonials', req.params.id);
  ok(res, null, 'Testimonial deleted');
});

module.exports = router;
