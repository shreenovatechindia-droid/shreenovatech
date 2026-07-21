const { Portfolio } = require('../models');
const { ok, err, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const { category, all } = req.query;
  const filter = {};
  if (!all) filter.is_active = true;
  if (category) filter.category = category;
  const rows = await Portfolio.find(filter).sort({ sort_order: 1, _id: 1 });
  ok(res, rows);
};

exports.show = async (req, res) => {
  const r = await Portfolio.findById(req.params.id);
  if (!r) return err(res, 'Project not found', 404);
  ok(res, r);
};

exports.store = async (req, res) => {
  const { title, category, badge, industry, description, features=[], tech=[],
          image_url, live_url, github_url, client_name, completion_date,
          is_featured=false, sort_order=0, is_active=true } = req.body;
  if (!title || !category) return err(res, 'Title and category are required.');

  const imgUrl = req.file ? `${process.env.BASE_URL}/uploads/portfolio/${req.file.filename}` : (image_url||'');
  const r = await Portfolio.create({
    title, category, badge, industry, description,
    features: Array.isArray(features) ? features : features.split(',').map(s=>s.trim()).filter(Boolean),
    tech:     Array.isArray(tech)     ? tech     : tech.split(',').map(s=>s.trim()).filter(Boolean),
    image_url: imgUrl, live_url, github_url, client_name,
    completion_date: completion_date||null,
    is_featured: !!is_featured, sort_order: parseInt(sort_order)||0, is_active: !!is_active,
  });
  await logActivity(req.user.id, 'create', 'portfolio', r._id);
  ok(res, { id: r._id }, 'Project created', 201);
};

exports.update = async (req, res) => {
  const { title, category, badge, industry, description, features=[], tech=[],
          image_url, live_url, github_url, client_name, completion_date,
          is_featured=false, sort_order=0, is_active=true } = req.body;
  if (!title || !category) return err(res, 'Title and category are required.');

  const imgUrl = req.file ? `${process.env.BASE_URL}/uploads/portfolio/${req.file.filename}` : (image_url||'');
  await Portfolio.findByIdAndUpdate(req.params.id, {
    title, category, badge, industry, description,
    features: Array.isArray(features) ? features : features.split(',').map(s=>s.trim()).filter(Boolean),
    tech:     Array.isArray(tech)     ? tech     : tech.split(',').map(s=>s.trim()).filter(Boolean),
    image_url: imgUrl, live_url, github_url, client_name,
    completion_date: completion_date||null,
    is_featured: !!is_featured, sort_order: parseInt(sort_order)||0, is_active: !!is_active,
  });
  await logActivity(req.user.id, 'update', 'portfolio', req.params.id);
  ok(res, null, 'Project updated');
};

exports.destroy = async (req, res) => {
  await Portfolio.findByIdAndDelete(req.params.id);
  await logActivity(req.user.id, 'delete', 'portfolio', req.params.id);
  ok(res, null, 'Project deleted');
};
