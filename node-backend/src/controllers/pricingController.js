const { Pricing } = require('../models');
const { ok, err, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const filter = req.query.all ? {} : { is_active: true };
  const rows   = await Pricing.find(filter).sort({ sort_order: 1 });
  ok(res, rows);
};

exports.show = async (req, res) => {
  const r = await Pricing.findById(req.params.id);
  if (!r) return err(res, 'Plan not found', 404);
  ok(res, r);
};

exports.store = async (req, res) => {
  const { badge, badge_class, name, description, price, price_num, renewal,
          is_featured=false, features=[], sort_order=0, is_active=true } = req.body;
  if (!name || !price) return err(res, 'Name and price are required.');

  const r = await Pricing.create({
    badge, badge_class, name, description, price,
    price_num: parseInt(price_num)||0, renewal,
    is_featured: !!is_featured,
    features: Array.isArray(features) ? features : features.split('\n').map(s=>s.trim()).filter(Boolean),
    sort_order: parseInt(sort_order)||0, is_active: !!is_active,
  });
  await logActivity(req.user.id, 'create', 'pricing', r._id);
  ok(res, { id: r._id }, 'Plan created', 201);
};

exports.update = async (req, res) => {
  const { name, description, price, price_num, renewal,
          is_featured=false, features=[], sort_order=0, is_active=true } = req.body;
  if (!name) return err(res, 'Name is required.');

  await Pricing.findByIdAndUpdate(req.params.id, {
    name, description, price, price_num: parseInt(price_num)||0, renewal,
    is_featured: !!is_featured,
    features: Array.isArray(features) ? features : features.split('\n').map(s=>s.trim()).filter(Boolean),
    sort_order: parseInt(sort_order)||0, is_active: !!is_active,
  });
  await logActivity(req.user.id, 'update', 'pricing', req.params.id);
  ok(res, null, 'Plan updated');
};

exports.destroy = async (req, res) => {
  await Pricing.findByIdAndDelete(req.params.id);
  await logActivity(req.user.id, 'delete', 'pricing', req.params.id);
  ok(res, null, 'Plan deleted');
};
