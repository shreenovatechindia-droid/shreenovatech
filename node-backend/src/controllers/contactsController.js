const { Contact } = require('../models');
const { ok, err, paginate, logActivity } = require('../middleware/helpers');
const nodemailer = require('nodemailer');

const mailer = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

async function sendEnquiryEmail({ name, email, phone, message }) {
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden">
      <div style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:28px 32px;text-align:center">
        <h2 style="color:#fff;margin:0;font-size:22px">📋 New Enquiry Received</h2>
        <p style="color:rgba(255,255,255,.85);margin:6px 0 0;font-size:14px">ShreeNova Tech — Website Enquiry Popup</p>
      </div>
      <div style="padding:28px 32px;background:#fff">
        <table style="width:100%;border-collapse:collapse">
          <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px;width:120px">👤 Name</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827">${name}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px">✉️ Email</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827">${email}</td></tr>
          <tr><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;color:#6b7280;font-size:13px">📱 Phone</td><td style="padding:10px 0;border-bottom:1px solid #f3f4f6;font-weight:600;color:#111827">${phone || '—'}</td></tr>
          <tr><td style="padding:10px 0;color:#6b7280;font-size:13px;vertical-align:top">💬 Message</td><td style="padding:10px 0;color:#111827">${message}</td></tr>
        </table>
      </div>
      <div style="background:#f9fafb;padding:16px 32px;text-align:center;font-size:12px;color:#9ca3af">
        © ${new Date().getFullYear()} ShreeNova Tech | shreenovatech.in
      </div>
    </div>
  `;
  await mailer.sendMail({
    from: `"${process.env.SMTP_FROM_NAME || 'ShreeNova Tech'}" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_TO || process.env.SMTP_USER,
    replyTo: email,
    subject: `📋 New Enquiry from ${name}`,
    html,
  });
}

exports.index = async (req, res) => {
  const page  = Math.max(1, parseInt(req.query.page)  || 1);
  const limit = Math.min(100, parseInt(req.query.limit) || 20);
  const { status, search } = req.query;

  const filter = {};
  if (status) filter.status = status;
  if (search) filter.$or = [
    { name: new RegExp(search, 'i') },
    { email: new RegExp(search, 'i') },
    { message: new RegExp(search, 'i') },
  ];

  const total = await Contact.countDocuments(filter);
  const rows  = await Contact.find(filter).sort({ created_at: -1 }).skip((page-1)*limit).limit(limit);
  ok(res, { contacts: rows, pagination: paginate(total, page, limit) });
};

exports.show = async (req, res) => {
  const contact = await Contact.findByIdAndUpdate(
    req.params.id, { $set: { status: 'read' } }, { new: true }
  );
  if (!contact) return err(res, 'Contact not found', 404);
  ok(res, contact);
};

exports.store = async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name)    return err(res, 'Name is required.');
  if (!email || !/\S+@\S+\.\S+/.test(email)) return err(res, 'Enter a valid email address.');
  if (!message) return err(res, 'Message is required.');

  const contact = await Contact.create({ name, email, phone: phone||'', message, ip_address: req.ip||'' });
  sendEnquiryEmail({ name, email, phone: phone||'', message }).catch(() => {});
  ok(res, null, 'Message sent successfully', 201);
};

exports.reply = async (req, res) => {
  const { reply } = req.body;
  if (!reply) return err(res, 'Reply text is required.');
  await Contact.findByIdAndUpdate(req.params.id, {
    status: 'replied', reply_text: reply,
    replied_by: req.user.id, replied_at: new Date(),
  });
  await logActivity(req.user.id, 'reply', 'contacts', req.params.id);
  ok(res, null, 'Reply saved');
};

exports.update = async (req, res) => {
  const { status } = req.body;
  if (!['new','read','replied'].includes(status)) return err(res, 'Invalid status.');
  await Contact.findByIdAndUpdate(req.params.id, { status });
  await logActivity(req.user.id, `contact_${status}`, 'contacts', req.params.id);
  ok(res, null, 'Status updated');
};

exports.destroy = async (req, res) => {
  await Contact.findByIdAndDelete(req.params.id);
  await logActivity(req.user.id, 'delete', 'contacts', req.params.id);
  ok(res, null, 'Contact deleted');
};
