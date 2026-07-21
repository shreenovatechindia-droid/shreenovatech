const { Hosting } = require('../models');
const { ok, err, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const filter = { is_active: true };
  if (req.query.type) filter.type = req.query.type;
  const rows = await Hosting.find(filter).sort({ sort_order: 1 });
  ok(res, rows);
};

exports.store = async (req, res) => {
  const { type, name, price, price_num, per, description, storage, bandwidth,
          websites, emails, features=[], is_featured=false, is_active=true, sort_order=0 } = req.body;
  if (!type || !name || !price) return err(res, 'Type, name and price are required.');

  const r = await Hosting.create({
    type, name, price, price_num: parseFloat(price_num)||0, per: per||'/month',
    description, storage, bandwidth, websites, emails,
    features: Array.isArray(features) ? features : features.split(',').map(s=>s.trim()).filter(Boolean),
    is_featured: !!is_featured, is_active: !!is_active, sort_order: parseInt(sort_order)||0,
  });
  await logActivity(req.user.id, 'create', 'hosting', r._id);
  ok(res, { id: r._id }, 'Hosting plan created', 201);
};

exports.update = async (req, res) => {
  const { type, name, price, price_num, per, description, storage, bandwidth,
          websites, emails, features=[], is_featured=false, is_active=true, sort_order=0 } = req.body;
  if (!name) return err(res, 'Name is required.');

  await Hosting.findByIdAndUpdate(req.params.id, {
    type, name, price, price_num: parseFloat(price_num)||0, per: per||'/month',
    description, storage, bandwidth, websites, emails,
    features: Array.isArray(features) ? features : features.split(',').map(s=>s.trim()).filter(Boolean),
    is_featured: !!is_featured, is_active: !!is_active, sort_order: parseInt(sort_order)||0,
  });
  await logActivity(req.user.id, 'update', 'hosting', req.params.id);
  ok(res, null, 'Hosting plan updated');
};

exports.destroy = async (req, res) => {
  await Hosting.findByIdAndDelete(req.params.id);
  await logActivity(req.user.id, 'delete', 'hosting', req.params.id);
  ok(res, null, 'Hosting plan deleted');
};
