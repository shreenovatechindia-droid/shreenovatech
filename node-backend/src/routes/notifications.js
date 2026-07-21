const router = require('express').Router();
const { Notification } = require('../models');
const { ok } = require('../middleware/helpers');
const { auth } = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ created_at: -1 }).limit(50);
    const unread = await Notification.countDocuments({ is_read: false });
    ok(res, { notifications, unread });
  } catch { ok(res, { notifications: [], unread: 0 }); }
});

router.put('/read-all', auth, async (req, res) => {
  await Notification.updateMany({}, { is_read: true });
  ok(res, null, 'All marked as read');
});

router.put('/:id', auth, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { is_read: true });
  ok(res, null, 'Marked as read');
});

router.delete('/:id', auth, async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);
  ok(res, null, 'Deleted');
});

module.exports = router;
