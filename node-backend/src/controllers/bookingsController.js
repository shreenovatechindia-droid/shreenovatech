const db = require('../config/db');
const { ok, err, paginate, genRef, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.min(100, parseInt(req.query.limit) || 20);
  const offset = (page - 1) * limit;
  const { status, search } = req.query;

  const where = [];
  const params = [];
  if (status) { where.push('status = ?'); params.push(status); }
  if (search) {
    where.push('(full_name LIKE ? OR email LIKE ? OR mobile LIKE ? OR ref_id LIKE ?)');
    const s = `%${search}%`;
    params.push(s, s, s, s);
  }
  const whereSQL = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const [[{ total }]] = await db.execute(`SELECT COUNT(*) as total FROM bookings ${whereSQL}`, params);
  const [rows] = await db.execute(
    `SELECT * FROM bookings ${whereSQL} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, params
  );

  rows.forEach(r => { try { r.services = JSON.parse(r.services || '[]'); } catch { r.services = []; } });
  ok(res, { bookings: rows, pagination: paginate(total, page, limit) });
};

exports.show = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM bookings WHERE id = ?', [req.params.id]);
  if (!rows[0]) return err(res, 'Booking not found', 404);
  const b = rows[0];
  try { b.services = JSON.parse(b.services || '[]'); } catch { b.services = []; }
  ok(res, b);
};

exports.store = async (req, res) => {
  const { fullName, mobile, email, whatsapp, company, business, website,
          city, state, country = 'India', projectType, budget, timeline,
          description, services = [] } = req.body;

  if (!fullName) return err(res, 'Full name is required.');
  if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) return err(res, 'Enter a valid 10-digit Indian mobile number.');
  if (!email || !/\S+@\S+\.\S+/.test(email)) return err(res, 'Enter a valid email address.');

  const refId = genRef('BK');
  const logoUrl   = req.files?.logoFile?.[0]   ? `${process.env.BASE_URL}/uploads/logos/${req.files.logoFile[0].filename}`   : '';
  const imagesUrl = req.files?.imagesFile?.[0] ? `${process.env.BASE_URL}/uploads/portfolio/${req.files.imagesFile[0].filename}` : '';
  const docsUrl   = req.files?.docsFile?.[0]   ? `${process.env.BASE_URL}/uploads/portfolio/${req.files.docsFile[0].filename}`   : '';

  await db.execute(
    `INSERT INTO bookings (ref_id,full_name,mobile,whatsapp,email,company,business,website,
     city,state,country,project_type,budget,timeline,description,services,logo_url,images_url,docs_url)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [refId, fullName, mobile, whatsapp||'', email, company||'', business||'', website||'',
     city||'', state||'', country, projectType||'', budget||'', timeline||'',
     description||'', JSON.stringify(services), logoUrl, imagesUrl, docsUrl]
  );
  ok(res, { ref_id: refId }, 'Booking submitted successfully', 201);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  const allowed = ['new','contacted','in_progress','completed','cancelled'];
  if (!allowed.includes(status)) return err(res, 'Invalid status.');
  await db.execute('UPDATE bookings SET status = ? WHERE id = ?', [status, req.params.id]);
  await logActivity(req.user.id, `status_${status}`, 'bookings', req.params.id);
  ok(res, null, 'Status updated');
};

exports.update = async (req, res) => {
  const { admin_notes } = req.body;
  await db.execute('UPDATE bookings SET admin_notes = ? WHERE id = ?', [admin_notes || '', req.params.id]);
  await logActivity(req.user.id, 'update', 'bookings', req.params.id);
  ok(res, null, 'Booking updated');
};

exports.destroy = async (req, res) => {
  await db.execute('DELETE FROM bookings WHERE id = ?', [req.params.id]);
  await logActivity(req.user.id, 'delete', 'bookings', req.params.id);
  ok(res, null, 'Booking deleted');
};
