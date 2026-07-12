const db = require('../config/db');
const { ok, err, paginate, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.min(100, parseInt(req.query.limit) || 20);
  const offset = (page - 1) * limit;
  const { status, search } = req.query;

  const where = [], params = [];
  if (status) { where.push('status = ?'); params.push(status); }
  if (search) {
    where.push('(name LIKE ? OR email LIKE ? OR message LIKE ?)');
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  const whereSQL = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const [[{ total }]] = await db.execute(`SELECT COUNT(*) as total FROM contacts ${whereSQL}`, params);
  const [rows] = await db.execute(
    `SELECT * FROM contacts ${whereSQL} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, params
  );
  ok(res, { contacts: rows, pagination: paginate(total, page, limit) });
};

exports.show = async (req, res) => {
  await db.execute('UPDATE contacts SET status = "read" WHERE id = ? AND status = "new"', [req.params.id]);
  const [rows] = await db.execute('SELECT * FROM contacts WHERE id = ?', [req.params.id]);
  if (!rows[0]) return err(res, 'Contact not found', 404);
  ok(res, rows[0]);
};

exports.store = async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name)    return err(res, 'Name is required.');
  if (!email || !/\S+@\S+\.\S+/.test(email)) return err(res, 'Enter a valid email address.');
  if (!message) return err(res, 'Message is required.');

  const ip = req.ip || '';
  await db.execute(
    'INSERT INTO contacts (name,email,phone,message,ip_address) VALUES (?,?,?,?,?)',
    [name, email, phone||'', message, ip]
  );
  ok(res, null, 'Message sent successfully', 201);
};

exports.reply = async (req, res) => {
  const { reply } = req.body;
  if (!reply) return err(res, 'Reply text is required.');
  await db.execute(
    'UPDATE contacts SET status="replied", reply_text=?, replied_by=?, replied_at=NOW() WHERE id=?',
    [reply, req.user.id, req.params.id]
  );
  await logActivity(req.user.id, 'reply', 'contacts', req.params.id);
  ok(res, null, 'Reply saved');
};

exports.update = async (req, res) => {
  const { status } = req.body;
  if (!['new','read','replied'].includes(status)) return err(res, 'Invalid status.');
  await db.execute('UPDATE contacts SET status = ? WHERE id = ?', [status, req.params.id]);
  await logActivity(req.user.id, `contact_${status}`, 'contacts', req.params.id);
  ok(res, null, 'Status updated');
};

exports.destroy = async (req, res) => {
  await db.execute('DELETE FROM contacts WHERE id = ?', [req.params.id]);
  await logActivity(req.user.id, 'delete', 'contacts', req.params.id);
  ok(res, null, 'Contact deleted');
};
