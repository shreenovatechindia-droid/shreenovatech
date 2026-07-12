const db = require('../config/db');
const { ok, err, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM site_stats ORDER BY sort_order ASC');
  ok(res, rows);
};

exports.update = async (req, res) => {
  const { num_value, suffix, label } = req.body;
  await db.execute(
    'UPDATE site_stats SET num_value=?,suffix=?,label=? WHERE id=?',
    [parseFloat(num_value)||0, suffix||'', label||'', req.params.id]
  );
  await logActivity(req.user.id, 'update', 'stats', req.params.id);
  ok(res, null, 'Stat updated');
};

exports.track = async (req, res) => {
  const { page = '/', referrer = '' } = req.body;
  const ua   = req.headers['user-agent'] || '';
  const ip   = req.ip || '';
  const date = new Date().toISOString().slice(0, 10);
  await db.execute(
    'INSERT INTO visitors (ip_address,page,user_agent,referrer,visit_date) VALUES (?,?,?,?,?)',
    [ip, page, ua, referrer, date]
  );
  ok(res, null, 'Tracked');
};

exports.visitors = async (req, res) => {
  const { days = 30 } = req.query;
  const [rows] = await db.execute(`
    SELECT visit_date, COUNT(*) as visits
    FROM visitors
    WHERE visit_date >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
    GROUP BY visit_date
    ORDER BY visit_date ASC
  `, [parseInt(days)]);
  ok(res, rows);
};
