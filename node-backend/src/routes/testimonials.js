const router = require('express').Router();
const { Testimonial } = require('../models');
const { ok, err } = require('../middleware/helpers');
const { auth, roles } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const rows = await Testimonial.find({ is_active: true }).sort({ sort_order: 1 });
    ok(res, rows);
  } catch { ok(res, []); }
});

router.post('/', auth, roles('super_admin','admin'), async (req, res) => {
  const { name, role, rating=5, message, sort_order=0 } = req.body;
  if (!name || !message) return err(res, 'Name and message required.');
  await Testimonial.create({ name, role, rating, message, sort_order });
  ok(res, null, 'Testimonial created', 201);
});

router.put('/:id', auth, roles('super_admin','admin'), async (req, res) => {
  const { name, role, rating, message, sort_order, is_active } = req.body;
  await Testimonial.findByIdAndUpdate(req.params.id, { name, role, rating, message, sort_order, is_active });
  ok(res, null, 'Testimonial updated');
});

router.delete('/:id', auth, roles('super_admin','admin'), async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  ok(res, null, 'Testimonial deleted');
});

module.exports = router;
