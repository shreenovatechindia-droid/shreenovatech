const db = require('../config/db');
const { ok, err, paginate, genRef, logActivity } = require('../middleware/helpers');

const PKG_MAP = {
  silver:  ['Silver Package',  9999],
  golden:  ['Golden Package',  14999],
  diamond: ['Diamond Package', 19999],
};

exports.index = async (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page)  || 1);
  const limit  = Math.min(100, parseInt(req.query.limit) || 20);
  const offset = (page - 1) * limit;
  const { status, package: pkg, search } = req.query;

  const where = [], params = [];
  if (status) { where.push('status = ?'); params.push(status); }
  if (pkg)    { where.push('package_key = ?'); params.push(pkg); }
  if (search) {
    where.push('(full_name LIKE ? OR email LIKE ? OR ref_id LIKE ?)');
    const s = `%${search}%`;
    params.push(s, s, s);
  }
  const whereSQL = where.length ? 'WHERE ' + where.join(' AND ') : '';

  const [[{ total }]] = await db.execute(`SELECT COUNT(*) as total FROM payments ${whereSQL}`, params);
  const [rows] = await db.execute(
    `SELECT * FROM payments ${whereSQL} ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`, params
  );
  ok(res, { payments: rows, pagination: paginate(total, page, limit) });
};

exports.show = async (req, res) => {
  const [rows] = await db.execute('SELECT * FROM payments WHERE id = ?', [req.params.id]);
  if (!rows[0]) return err(res, 'Payment not found', 404);
  ok(res, rows[0]);
};

exports.store = async (req, res) => {
  const { fullName, mobile, email, payMethod, package: pkgKey = 'silver',
          whatsapp, company, gst, address, city, state, country = 'India',
          pincode, transaction_id } = req.body;

  if (!fullName) return err(res, 'Full name is required.');
  if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) return err(res, 'Enter a valid 10-digit Indian mobile number.');
  if (!email || !/\S+@\S+\.\S+/.test(email)) return err(res, 'Enter a valid email address.');
  if (!payMethod) return err(res, 'Please select a payment method.');

  const [pkgName, amount] = PKG_MAP[pkgKey] || PKG_MAP.silver;
  const gstAmt   = Math.round(amount * 0.18);
  const total    = amount + gstAmt;
  const refId    = genRef('PAY');
  const screenshotUrl = req.file
    ? `${process.env.BASE_URL}/uploads/payments/${req.file.filename}` : '';

  await db.execute(
    `INSERT INTO payments (ref_id,full_name,mobile,whatsapp,email,company,gst,address,city,state,
     country,pincode,package_key,package_name,amount,gst_amount,total_amount,pay_method,transaction_id,screenshot_url)
     VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [refId, fullName, mobile, whatsapp||'', email, company||'', gst||'', address||'',
     city||'', state||'', country, pincode||'', pkgKey, pkgName,
     amount, gstAmt, total, payMethod, transaction_id||'', screenshotUrl]
  );
  ok(res, { ref_id: refId }, 'Payment submitted successfully', 201);
};

exports.updateStatus = async (req, res) => {
  const { status, admin_notes } = req.body;
  if (!['pending','verified','rejected'].includes(status)) return err(res, 'Invalid status.');
  await db.execute(
    'UPDATE payments SET status=?, admin_notes=?, verified_by=?, verified_at=NOW() WHERE id=?',
    [status, admin_notes||'', req.user.id, req.params.id]
  );
  await logActivity(req.user.id, `payment_${status}`, 'payments', req.params.id);
  ok(res, null, 'Payment status updated');
};

exports.destroy = async (req, res) => {
  await db.execute('DELETE FROM payments WHERE id = ?', [req.params.id]);
  await logActivity(req.user.id, 'delete', 'payments', req.params.id);
  ok(res, null, 'Payment deleted');
};
