const db = require('../config/db');
const { ok, err, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const { type } = req.query;
  const where  = type ? 'WHERE type = ? AND is_active = 1' : 'WHERE is_active = 1';
  const params = type ? [type] : [];
  const [rows] = await db.execute(
    `SELECT * FROM hosting_plans ${where} ORDER BY sort_order ASC`, params
  );
  rows.forEach(r => { try { r.features = JSON.parse(r.features || '[]'); } catch { r.features = []; } });
  ok(res, rows);
};

exports.store = async (req, res) => {
  const { type, name, price, price_num, per, description, storage, bandwidth,
          websites, emails, features = [], is_featured = 0, is_active = 1, sort_order = 0 } = req.body;
  if (!type || !name || !price) return err(res, 'Type, name and price are required.');

  const [result] = await db.execute(
    `INSERT INTO hosting_plans (type,name,price,price_num,per,description,storage,bandwidth,websites,emails,features,is_featured,is_active,sort_order)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [type, name, price, parseFloat(price_num)||0, per||'/month', description||'',
     storage||'', bandwidth||'', websites||'', emails||'',
     JSON.stringify(Array.isArray(features) ? features : features.split(',').map(s=>s.trim()).filter(Boolean)),
     parseInt(is_featured)||0, parseInt(is_active)||1, parseInt(sort_order)||0]
  );
  await logActivity(req.user.id, 'create', 'hosting', result.insertId);
  ok(res, { id: result.insertId }, 'Hosting plan created', 201);
};

exports.update = async (req, res) => {
  const { type, name, price, price_num, per, description, storage, bandwidth,
          websites, emails, features = [], is_featured = 0, is_active = 1, sort_order = 0 } = req.body;
  if (!name) return err(res, 'Name is required.');

  await db.execute(
    `UPDATE hosting_plans SET type=?,name=?,price=?,price_num=?,per=?,description=?,storage=?,bandwidth=?,
     websites=?,emails=?,features=?,is_featured=?,is_active=?,sort_order=? WHERE id=?`,
    [type||'shared', name, price||'', parseFloat(price_num)||0, per||'/month', description||'',
     storage||'', bandwidth||'', websites||'', emails||'',
     JSON.stringify(Array.isArray(features) ? features : features.split(',').map(s=>s.trim()).filter(Boolean)),
     parseInt(is_featured)||0, parseInt(is_active)||1, parseInt(sort_order)||0, req.params.id]
  );
  await logActivity(req.user.id, 'update', 'hosting', req.params.id);
  ok(res, null, 'Hosting plan updated');
};

exports.destroy = async (req, res) => {
  await db.execute('DELETE FROM hosting_plans WHERE id = ?', [req.params.id]);
  await logActivity(req.user.id, 'delete', 'hosting', req.params.id);
  ok(res, null, 'Hosting plan deleted');
};
