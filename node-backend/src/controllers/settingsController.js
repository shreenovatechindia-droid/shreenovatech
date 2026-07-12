const db = require('../config/db');
const { ok, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const { group } = req.query;
  const where  = group ? 'WHERE setting_group = ?' : '';
  const params = group ? [group] : [];
  const [rows] = await db.execute(
    `SELECT setting_key, setting_value, setting_group FROM site_settings ${where} ORDER BY setting_group, id`,
    params
  );
  const map = {};
  rows.forEach(r => { map[r.setting_key] = r.setting_value; });
  ok(res, map);
};

exports.update = async (req, res) => {
  const entries = Object.entries(req.body);
  for (const [key, value] of entries) {
    const v = typeof value === 'object' ? JSON.stringify(value) : String(value);
    await db.execute('UPDATE site_settings SET setting_value = ? WHERE setting_key = ?', [v, key]);
  }
  await logActivity(req.user.id, 'update', 'settings');
  ok(res, null, 'Settings saved');
};
