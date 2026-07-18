const router = require('express').Router();
const db     = require('../config/db');
const { ok, err } = require('../middleware/helpers');
const { auth, roles } = require('../middleware/auth');

// Public: subscribe
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email || !/\S+@\S+\.\S+/.test(email)) return err(res, 'Valid email required.');
  try {
    await db.execute(
      'INSERT INTO newsletter_subscribers (email) VALUES (?) ON DUPLICATE KEY UPDATE is_active = 1',
      [email]
    );
    ok(res, null, 'Subscribed successfully!', 201);
  } catch { err(res, 'Subscription failed.'); }
});

// Admin: list all
router.get('/', auth, roles('super_admin', 'admin'), async (req, res) => {
  const [rows] = await db.execute(
    'SELECT * FROM newsletter_subscribers ORDER BY created_at DESC'
  );
  ok(res, rows);
});

// Admin: delete
router.delete('/:id', auth, roles('super_admin', 'admin'), async (req, res) => {
  await db.execute('DELETE FROM newsletter_subscribers WHERE id = ?', [req.params.id]);
  ok(res, null, 'Deleted');
});

module.exports = router;
