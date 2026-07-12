const router = require('express').Router();
const db     = require('../config/db');
const { ok, err } = require('../middleware/helpers');
const { auth, roles } = require('../middleware/auth');

// GET all notifications (admin)
router.get('/', auth, async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50'
    );
    const [[{ unread }]] = await db.execute(
      'SELECT COUNT(*) as unread FROM notifications WHERE is_read = 0'
    );
    ok(res, { notifications: rows, unread: Number(unread) });
  } catch { ok(res, { notifications: [], unread: 0 }); }
});

// PUT mark one as read
router.put('/read-all', auth, async (req, res) => {
  await db.execute('UPDATE notifications SET is_read = 1');
  ok(res, null, 'All marked as read');
});

router.put('/:id', auth, async (req, res) => {
  await db.execute('UPDATE notifications SET is_read = 1 WHERE id = ?', [req.params.id]);
  ok(res, null, 'Marked as read');
});

router.delete('/:id', auth, async (req, res) => {
  await db.execute('DELETE FROM notifications WHERE id = ?', [req.params.id]);
  ok(res, null, 'Deleted');
});

module.exports = router;
