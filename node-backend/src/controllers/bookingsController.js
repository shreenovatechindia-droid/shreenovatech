const { Booking } = require('../models');
const { ok, err, paginate, genRef, logActivity } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const { status, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) filter.$or = [
    { full_name: new RegExp(search,'i') }, { email: new RegExp(search,'i') },
    { mobile: new RegExp(search,'i') },    { ref_id: new RegExp(search,'i') },
  ];

  const total = await Booking.countDocuments(filter);
  const rows  = await Booking.find(filter).sort({ created_at: -1 }).skip((page-1)*limit).limit(limit);
  ok(res, { bookings: rows, pagination: paginate(total, page, limit) });
};

exports.show = async (req, res) => {
  const b = await Booking.findById(req.params.id);
  if (!b) return err(res, 'Booking not found', 404);
  ok(res, b);
};

exports.store = async (req, res) => {
  const { fullName, mobile, email, whatsapp, company, business, website,
          city, state, country='India', projectType, budget, timeline,
          description, services=[] } = req.body;

  if (!fullName) return err(res, 'Full name is required.');
  if (!mobile || !/^[6-9]\d{9}$/.test(mobile)) return err(res, 'Enter a valid 10-digit Indian mobile number.');
  if (!email || !/\S+@\S+\.\S+/.test(email)) return err(res, 'Enter a valid email address.');

  const refId    = genRef('BK');
  const logoUrl  = req.files?.logoFile?.[0]   ? `${process.env.BASE_URL}/uploads/logos/${req.files.logoFile[0].filename}`   : '';
  const imgsUrl  = req.files?.imagesFile?.[0] ? `${process.env.BASE_URL}/uploads/portfolio/${req.files.imagesFile[0].filename}` : '';
  const docsUrl  = req.files?.docsFile?.[0]   ? `${process.env.BASE_URL}/uploads/portfolio/${req.files.docsFile[0].filename}`   : '';

  await Booking.create({
    ref_id: refId, full_name: fullName, mobile, whatsapp: whatsapp||'', email,
    company: company||'', business: business||'', website: website||'',
    city: city||'', state: state||'', country, project_type: projectType||'',
    budget: budget||'', timeline: timeline||'', description: description||'',
    services: Array.isArray(services) ? services : [],
    logo_url: logoUrl, images_url: imgsUrl, docs_url: docsUrl,
  });
  ok(res, { ref_id: refId }, 'Booking submitted successfully', 201);
};

exports.updateStatus = async (req, res) => {
  const { status } = req.body;
  if (!['new','contacted','in_progress','completed','cancelled'].includes(status))
    return err(res, 'Invalid status.');
  await Booking.findByIdAndUpdate(req.params.id, { status });
  await logActivity(req.user.id, `status_${status}`, 'bookings', req.params.id);
  ok(res, null, 'Status updated');
};

exports.update = async (req, res) => {
  await Booking.findByIdAndUpdate(req.params.id, { admin_notes: req.body.admin_notes||'' });
  await logActivity(req.user.id, 'update', 'bookings', req.params.id);
  ok(res, null, 'Booking updated');
};

exports.destroy = async (req, res) => {
  await Booking.findByIdAndDelete(req.params.id);
  await logActivity(req.user.id, 'delete', 'bookings', req.params.id);
  ok(res, null, 'Booking deleted');
};
