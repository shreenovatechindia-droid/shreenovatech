const router = require('express').Router();
const { Faq } = require('../models');
const { ok, err } = require('../middleware/helpers');
const { auth, roles } = require('../middleware/auth');

router.get('/', async (req, res) => {
  try {
    const filter = { is_active: true };
    if (req.query.category) filter.category = req.query.category;
    const rows = await Faq.find(filter).sort({ sort_order: 1 });
    ok(res, rows);
  } catch { ok(res, []); }
});

router.post('/', auth, roles('super_admin','admin'), async (req, res) => {
  const { category='general', question, answer, sort_order=0 } = req.body;
  if (!question || !answer) return err(res, 'Question and answer required.');
  await Faq.create({ category, question, answer, sort_order });
  ok(res, null, 'FAQ created', 201);
});

router.put('/:id', auth, roles('super_admin','admin'), async (req, res) => {
  const { category, question, answer, sort_order, is_active } = req.body;
  await Faq.findByIdAndUpdate(req.params.id, { category, question, answer, sort_order, is_active });
  ok(res, null, 'FAQ updated');
});

router.delete('/:id', auth, roles('super_admin','admin'), async (req, res) => {
  await Faq.findByIdAndDelete(req.params.id);
  ok(res, null, 'FAQ deleted');
});

module.exports = router;
