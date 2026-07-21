const { Payment } = require('../models');
const { ok, err, paginate, genRef, logActivity } = require('../middleware/helpers');

const PKG_MAP = {
  silver:  ['Silver Package',  9999],
  golden:  ['Golden Package',  14999],
  diamond: ['Diamond Package', 19999],
};

exports.index = async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const { status, package: pkg, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (pkg)    filter.package_key = pkg;
  if (search) filter.$or = [
    { full_name: new RegExp(search,'i') },
    { email: new RegExp(search,'i') },
    { ref_id: new RegExp(search,'i') },
  ];

  const total = await Payment.countDocuments(filter);
  const rows  = await Payment.find(filter).sort({ created_at: -1 }).skip((page-1)*limit).limit(limit);
  ok(res, { payments: rows, pagination: paginate(total, page, limit) });
};

exports.show = async (req, res) => {
  const p = await Payment.findById(req.params.id);
  if (!p) return err(res, 'Payment not found', 404);
  ok(res, p);
};

exports.store = async (req, res) => {
  const { fullName, mobile, email, payMethod, package: pkgKey='silver',
          whatsapp, company, gst, address, city, state, country='India',
          pincode, transaction_id } = req.body;

  if (!fullName) return err(res, 'Full name is required.');
  if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) return err(res, 'Enter a valid 10-digit Indian mobile number.');
  if (!email || !/\S+@\S+\.\S+/.test(email)) return err(res, 'Enter a valid email address.');
  if (!payMethod) return err(res, 'Please select a payment method.');

  const [pkgName, amount] = PKG_MAP[pkgKey] || PKG_MAP.silver;
  const gstAmt  = Math.round(amount * 0.18);
  const total   = amount + gstAmt;
  const refId   = genRef('PAY');
  const ssUrl   = req.file ? `${process.env.BASE_URL}/uploads/payments/${req.file.filename}` : '';

  await Payment.create({
    ref_id: refId, full_name: fullName, mobile, whatsapp: whatsapp||'', email,
    company: company||'', gst: gst||'', address: address||'',
    city: city||'', state: state||'', country, pincode: pincode||'',
    package_key: pkgKey, package_name: pkgName,
    amount, gst_amount: gstAmt, total_amount: total,
    pay_method: payMethod, transaction_id: transaction_id||'', screenshot_url: ssUrl,
  });
  ok(res, { ref_id: refId }, 'Payment submitted successfully', 201);
};

exports.updateStatus = async (req, res) => {
  const { status, admin_notes } = req.body;
  if (!['pending','verified','rejected'].includes(status)) return err(res, 'Invalid status.');
  await Payment.findByIdAndUpdate(req.params.id, {
    status, admin_notes: admin_notes||'',
    verified_by: req.user.id, verified_at: new Date(),
  });
  await logActivity(req.user.id, `payment_${status}`, 'payments', req.params.id);
  ok(res, null, 'Payment status updated');
};

exports.destroy = async (req, res) => {
  await Payment.findByIdAndDelete(req.params.id);
  await logActivity(req.user.id, 'delete', 'payments', req.params.id);
  ok(res, null, 'Payment deleted');
};
