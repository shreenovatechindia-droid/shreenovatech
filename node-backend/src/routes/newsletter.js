const router = require('express').Router();
const { Newsletter } = require('../models');
const { ok, err } = require('../middleware/helpers');
const { auth, roles } = require('../middleware/auth');

router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email || !/\S+@\S+\.\S+/.test(email)) return err(res, 'Valid email required.');
  try {
    await Newsletter.findOneAndUpdate(
      { email }, { is_active: true }, { upsert: true, new: true }
    );
    ok(res, null, 'Subscribed successfully!', 201);
  } catch { err(res, 'Subscription failed.'); }
});

router.get('/', auth, roles('super_admin','admin'), async (req, res) => {
  const rows = await Newsletter.find().sort({ created_at: -1 });
  ok(res, rows);
});

router.delete('/:id', auth, roles('super_admin','admin'), async (req, res) => {
  await Newsletter.findByIdAndDelete(req.params.id);
  ok(res, null, 'Deleted');
});

module.exports = router;
