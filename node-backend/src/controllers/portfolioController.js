const db = require('../config/db');
const { ok, err, logActivity } = require('../middleware/helpers');

const parseJSON = (v, fallback = []) => { try { return JSON.parse(v || '[]'); } catch { return fallback; } };

exports.index = async (req, res) => {
  const { category, all } = req.query;
  const where = [], params = [];
  if (!all) { where.push('is_active = 1'); }
  if (category) { where.push('category = ?'); params.push(category); }
  const whereSQL = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const [rows] = await db.execute(
    `SELECT * FROM portfolio ${whereSQL} ORDER BY sort_order ASC, id ASC`, params
  );
  rows.forEach(r => { r.features = parseJSON(r.features); r.tech = parseJSON(r.tech); });
  ok(res, rows);
};

exports.show = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM portfolio WHERE id = ?', [req.params.id]);
  if (!rows[0]) return err(res, 'Project not found', 404);
  const r = rows[0];
  r.features = parseJSON(r.features);
  r.tech     = parseJSON(r.tech);
  ok(res, r);
};

exports.store = async (req, res) => {
  const { title, category, badge, industry, description, features = [], tech = [],
          image_url, live_url, github_url, client_name, completion_date,
          is_featured = 0, sort_order = 0, is_active = 1 } = req.body;

  if (!title || !category) return err(res, 'Title and category are required.');

  const imgUrl = req.file
    ? `${process.env.BASE_URL}/uploads/portfolio/${req.file.filename}`
    : (image_url || '');

  const [result] = await db.execute(
    `INSERT INTO portfolio (title,category,badge,industry,description,features,tech,image_url,
     live_url,github_url,client_name,completion_date,is_featured,sort_order,is_active)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [title, category, badge||'', industry||'', description||'',
     JSON.stringify(Array.isArray(features) ? features : features.split(',').map(s=>s.trim()).filter(Boolean)),
     JSON.stringify(Array.isArray(tech) ? tech : tech.split(',').map(s=>s.trim()).filter(Boolean)),
     imgUrl, live_url||'', github_url||'', client_name||'', completion_date||null,
     parseInt(is_featured)||0, parseInt(sort_order)||0, parseInt(is_active)||1]
  );
  await logActivity(req.user.id, 'create', 'portfolio', result.insertId);
  ok(res, { id: result.insertId }, 'Project created', 201);
};

exports.update = async (req, res) => {
  const { title, category, badge, industry, description, features = [], tech = [],
          image_url, live_url, github_url, client_name, completion_date,
          is_featured = 0, sort_order = 0, is_active = 1 } = req.body;

  if (!title || !category) return err(res, 'Title and category are required.');

  const imgUrl = req.file
    ? `${process.env.BASE_URL}/uploads/portfolio/${req.file.filename}`
    : (image_url || '');

  await db.execute(
    `UPDATE portfolio SET title=?,category=?,badge=?,industry=?,description=?,features=?,tech=?,
     image_url=?,live_url=?,github_url=?,client_name=?,completion_date=?,is_featured=?,sort_order=?,is_active=?
     WHERE id=?`,
    [title, category, badge||'', industry||'', description||'',
     JSON.stringify(Array.isArray(features) ? features : features.split(',').map(s=>s.trim()).filter(Boolean)),
     JSON.stringify(Array.isArray(tech) ? tech : tech.split(',').map(s=>s.trim()).filter(Boolean)),
     imgUrl, live_url||'', github_url||'', client_name||'', completion_date||null,
     parseInt(is_featured)||0, parseInt(sort_order)||0, parseInt(is_active)||1, req.params.id]
  );
  await logActivity(req.user.id, 'update', 'portfolio', req.params.id);
  ok(res, null, 'Project updated');
};

exports.destroy = async (req, res) => {
  await db.execute('DELETE FROM portfolio WHERE id = ?', [req.params.id]);
  await logActivity(req.user.id, 'delete', 'portfolio', req.params.id);
  ok(res, null, 'Project deleted');
};
