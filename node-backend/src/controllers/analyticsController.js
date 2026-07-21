const { Stat, Visitor } = require('../models');
const { ok, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const rows = await Stat.find().sort({ sort_order: 1 });
  ok(res, rows);
};

exports.update = async (req, res) => {
  const { num_value, suffix, label } = req.body;
  await Stat.findByIdAndUpdate(req.params.id, {
    num_value: parseFloat(num_value)||0, suffix: suffix||'', label: label||'',
  });
  await logActivity(req.user.id, 'update', 'stats', req.params.id);
  ok(res, null, 'Stat updated');
};

exports.track = async (req, res) => {
  const { page='/', referrer='' } = req.body;
  await Visitor.create({
    ip_address: req.ip||'', page,
    user_agent: req.headers['user-agent']||'',
    referrer, visit_date: new Date().toISOString().slice(0,10),
  });
  ok(res, null, 'Tracked');
};

exports.visitors = async (req, res) => {
  const days = parseInt(req.query.days) || 30;
  const from = new Date(Date.now() - days*24*60*60*1000).toISOString().slice(0,10);
  const rows = await Visitor.aggregate([
    { $match: { visit_date: { $gte: from } } },
    { $group: { _id: '$visit_date', visits: { $sum: 1 } } },
    { $sort: { _id: 1 } },
    { $project: { visit_date: '$_id', visits: 1, _id: 0 } },
  ]);
  ok(res, rows);
};
