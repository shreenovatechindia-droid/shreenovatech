const db = require('../config/db');
const { ok, err, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const showAll = req.query.all;
  const where   = showAll ? '' : 'WHERE is_active = 1';
  const [rows]  = await db.execute(`SELECT * FROM pricing_plans ${where} ORDER BY sort_order ASC`);
  rows.forEach(r => { try { r.features = JSON.parse(r.features || '[]'); } catch { r.features = []; } });
  ok(res, rows);
};

exports.show = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM pricing_plans WHERE id = ?', [req.params.id]);
  if (!rows[0]) return err(res, 'Plan not found', 404);
  const r = rows[0];
  try { r.features = JSON.parse(r.features || '[]'); } catch { r.features = []; }
  ok(res, r);
};

exports.store = async (req, res) => {
  const { badge, badge_class, name, description, price, price_num, renewal,
          is_featured = 0, features = [], sort_order = 0, is_active = 1 } = req.body;
  if (!name || !price) return err(res, 'Name and price are required.');

  const [result] = await db.execute(
    `INSERT INTO pricing_plans (badge,badge_class,name,description,price,price_num,renewal,is_featured,features,sort_order,is_active)
     VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
    [badge||'', badge_class||'', name, description||'', price, parseInt(price_num)||0,
     renewal||'', parseInt(is_featured)||0,
     JSON.stringify(Array.isArray(features) ? features : features.split('\n').map(s=>s.trim()).filter(Boolean)),
     parseInt(sort_order)||0, parseInt(is_active)||1]
  );
  await logActivity(req.user.id, 'create', 'pricing', result.insertId);
  ok(res, { id: result.insertId }, 'Plan created', 201);
};

exports.update = async (req, res) => {
  const { name, description, price, price_num, renewal,
          is_featured = 0, features = [], sort_order = 0, is_active = 1 } = req.body;
  if (!name) return err(res, 'Name is required.');

  await db.execute(
    `UPDATE pricing_plans SET name=?,description=?,price=?,price_num=?,renewal=?,is_featured=?,features=?,sort_order=?,is_active=? WHERE id=?`,
    [name, description||'', price||'', parseInt(price_num)||0, renewal||'',
     parseInt(is_featured)||0,
     JSON.stringify(Array.isArray(features) ? features : features.split('\n').map(s=>s.trim()).filter(Boolean)),
     parseInt(sort_order)||0, parseInt(is_active)||1, req.params.id]
  );
  await logActivity(req.user.id, 'update', 'pricing', req.params.id);
  ok(res, null, 'Plan updated');
};

exports.destroy = async (req, res) => {
  await db.execute('DELETE FROM pricing_plans WHERE id = ?', [req.params.id]);
  await logActivity(req.user.id, 'delete', 'pricing', req.params.id);
  ok(res, null, 'Plan deleted');
};
