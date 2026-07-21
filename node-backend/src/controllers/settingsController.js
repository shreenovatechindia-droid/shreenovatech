const { Setting } = require('../models');
const { ok, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const filter = req.query.group ? { setting_group: req.query.group } : {};
  const rows   = await Setting.find(filter).sort({ setting_group: 1 });
  const map    = {};
  rows.forEach(r => { map[r.setting_key] = r.setting_value; });
  ok(res, map);
};

exports.update = async (req, res) => {
  for (const [key, value] of Object.entries(req.body)) {
    const v = typeof value === 'object' ? JSON.stringify(value) : String(value);
    await Setting.findOneAndUpdate(
      { setting_key: key },
      { setting_value: v },
      { upsert: true, new: true }
    );
  }
  await logActivity(req.user.id, 'update', 'settings');
  ok(res, null, 'Settings saved');
};
