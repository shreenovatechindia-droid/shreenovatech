const ok  = (res, data = null, message = 'Success', code = 200) =>
  res.status(code).json({ success: true, message, data });

const err = (res, message = 'Error', code = 400) =>
  res.status(code).json({ success: false, message });

const paginate = (total, page, perPage) => ({
  total,
  per_page:     perPage,
  current_page: page,
  last_page:    Math.ceil(total / perPage),
  from:         (page - 1) * perPage + 1,
  to:           Math.min(page * perPage, total),
});

const genRef = (prefix = 'SNT') =>
  `${prefix}-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const logActivity = async (adminId, action, module, recordId = null, details = null) => {
  try {
    const { Activity } = require('../models');
    await Activity.create({ admin_id: String(adminId), action, module, record_id: String(recordId), details });
  } catch {}
};

module.exports = { ok, err, paginate, genRef, logActivity };
