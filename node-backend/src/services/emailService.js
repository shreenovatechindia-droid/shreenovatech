const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host:   process.env.SMTP_HOST  || 'smtp.gmail.com',
  port:   parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = `"${process.env.SMTP_FROM_NAME || 'ShreeNova Tech'}" <${process.env.SMTP_USER}>`;
const SITE = 'https://shreenovatech.in';
const LOGO = `${SITE}/logo.png`;
const WA   = 'https://wa.me/919876543210';

function fmtDate(d) {
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}

function approvalTemplate(p) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Payment Verified</title></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:30px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <!-- Header -->
      <tr><td style="background:linear-gradient(135deg,#6c63ff 0%,#4f46e5 100%);padding:36px 40px;text-align:center;">
        <img src="${LOGO}" alt="ShreeNova Tech" height="50" style="margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;" onerror="this.style.display='none'">
        <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;letter-spacing:-0.5px;">ShreeNova Tech</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Premium Web Solutions</p>
      </td></tr>

      <!-- Success Banner -->
      <tr><td style="background:#f0fdf4;padding:24px 40px;text-align:center;border-bottom:1px solid #dcfce7;">
        <div style="display:inline-block;background:#22c55e;border-radius:50%;width:56px;height:56px;line-height:56px;text-align:center;font-size:28px;margin-bottom:12px;">✅</div>
        <h2 style="color:#15803d;margin:0;font-size:22px;">Payment Verified Successfully!</h2>
        <p style="color:#166534;margin:8px 0 0;font-size:14px;">Your payment has been confirmed by our team.</p>
      </td></tr>

      <!-- Greeting -->
      <tr><td style="padding:32px 40px 0;">
        <p style="font-size:16px;color:#1e293b;margin:0 0 8px;">Hello <strong>${p.full_name}</strong> 👋</p>
        <p style="font-size:14px;color:#64748b;margin:0;">Great news! Your payment has been verified successfully. Here are your booking details:</p>
      </td></tr>

      <!-- Details Card -->
      <tr><td style="padding:24px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f8fafc;border-radius:12px;border:1px solid #e2e8f0;overflow:hidden;">
          <tr><td colspan="2" style="background:#6c63ff;padding:14px 20px;">
            <span style="color:#fff;font-weight:600;font-size:14px;">📋 Booking Details</span>
          </td></tr>
          ${[
            ['Booking ID',    p.ref_id],
            ['Package',       p.package_name || '—'],
            ['Amount',        `₹${Number(p.amount||0).toLocaleString('en-IN')}`],
            ['GST (18%)',     `₹${Number(p.gst_amount||0).toLocaleString('en-IN')}`],
            ['Total Paid',    `₹${Number(p.total_amount||0).toLocaleString('en-IN')}`],
            ['Payment Method',p.pay_method || '—'],
            ['Approval Date', fmtDate(p.approved_at || new Date())],
          ].map(([k,v]) => `
          <tr>
            <td style="padding:12px 20px;font-size:13px;color:#64748b;font-weight:500;width:45%;border-bottom:1px solid #e2e8f0;">${k}</td>
            <td style="padding:12px 20px;font-size:13px;color:#1e293b;font-weight:600;border-bottom:1px solid #e2e8f0;">${v}</td>
          </tr>`).join('')}
        </table>
      </td></tr>

      <!-- Timeline -->
      <tr><td style="padding:0 40px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#eff6ff;border-radius:12px;border:1px solid #bfdbfe;padding:20px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0 0 12px;font-size:14px;font-weight:600;color:#1d4ed8;">🚀 What Happens Next?</p>
            <p style="margin:0 0 8px;font-size:13px;color:#1e40af;">✔ Our team will contact you within <strong>30 minutes</strong></p>
            <p style="margin:0 0 8px;font-size:13px;color:#1e40af;">✔ Project kickoff meeting will be scheduled</p>
            <p style="margin:0;font-size:13px;color:#1e40af;">✔ Work begins as per agreed timeline</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- CTA Buttons -->
      <tr><td style="padding:0 40px 32px;text-align:center;">
        <a href="${SITE}" style="display:inline-block;background:linear-gradient(135deg,#6c63ff,#4f46e5);color:#fff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;margin:0 8px 8px;">🌐 Visit Website</a>
        <a href="${WA}" style="display:inline-block;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;margin:0 8px 8px;">💬 WhatsApp Us</a>
      </td></tr>

      <!-- Support -->
      <tr><td style="padding:0 40px 24px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fefce8;border-radius:12px;border:1px solid #fde68a;padding:16px 20px;">
          <tr><td>
            <p style="margin:0 0 6px;font-size:13px;font-weight:600;color:#92400e;">📞 Support</p>
            <p style="margin:0;font-size:13px;color:#78350f;">Email: support@shreenovatech.in &nbsp;|&nbsp; Website: shreenovatech.in</p>
          </td></tr>
        </table>
      </td></tr>

      <!-- Footer -->
      <tr><td style="background:#1e293b;padding:24px 40px;text-align:center;">
        <p style="color:#94a3b8;font-size:13px;margin:0 0 6px;">Thank you for choosing <strong style="color:#fff;">ShreeNova Tech</strong> ❤️</p>
        <p style="color:#64748b;font-size:12px;margin:0;">© ${new Date().getFullYear()} ShreeNova Tech. All rights reserved.</p>
        <p style="color:#64748b;font-size:11px;margin:8px 0 0;">
          <a href="${SITE}" style="color:#6c63ff;text-decoration:none;">shreenovatech.in</a>
        </p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

function rejectionTemplate(p) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Payment Not Verified</title></head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:30px 0;">
  <tr><td align="center">
    <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

      <tr><td style="background:linear-gradient(135deg,#6c63ff 0%,#4f46e5 100%);padding:36px 40px;text-align:center;">
        <img src="${LOGO}" alt="ShreeNova Tech" height="50" style="margin-bottom:12px;display:block;margin-left:auto;margin-right:auto;" onerror="this.style.display='none'">
        <h1 style="color:#fff;margin:0;font-size:26px;font-weight:700;">ShreeNova Tech</h1>
        <p style="color:rgba(255,255,255,0.85);margin:6px 0 0;font-size:14px;">Premium Web Solutions</p>
      </td></tr>

      <tr><td style="background:#fff7f7;padding:24px 40px;text-align:center;border-bottom:1px solid #fee2e2;">
        <div style="display:inline-block;background:#ef4444;border-radius:50%;width:56px;height:56px;line-height:56px;text-align:center;font-size:28px;margin-bottom:12px;">❌</div>
        <h2 style="color:#b91c1c;margin:0;font-size:22px;">Payment Could Not Be Verified</h2>
        <p style="color:#991b1b;margin:8px 0 0;font-size:14px;">We were unable to verify your payment screenshot.</p>
      </td></tr>

      <tr><td style="padding:32px 40px 0;">
        <p style="font-size:16px;color:#1e293b;margin:0 0 8px;">Hello <strong>${p.full_name}</strong>,</p>
        <p style="font-size:14px;color:#64748b;margin:0;">Unfortunately, we could not verify your payment for Booking ID <strong>${p.ref_id}</strong>. Please re-upload a valid payment screenshot.</p>
      </td></tr>

      <tr><td style="padding:24px 40px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#fef2f2;border-radius:12px;border:1px solid #fecaca;padding:20px;">
          <tr><td style="padding:16px 20px;">
            <p style="margin:0 0 10px;font-size:14px;font-weight:600;color:#b91c1c;">⚠️ What To Do Next?</p>
            <p style="margin:0 0 8px;font-size:13px;color:#991b1b;">1. Take a clear screenshot of your payment confirmation</p>
            <p style="margin:0 0 8px;font-size:13px;color:#991b1b;">2. Make sure the amount, date and transaction ID are visible</p>
            <p style="margin:0;font-size:13px;color:#991b1b;">3. Re-submit via our website or contact us on WhatsApp</p>
          </td></tr>
        </table>
      </td></tr>

      <tr><td style="padding:0 40px 32px;text-align:center;">
        <a href="${SITE}" style="display:inline-block;background:linear-gradient(135deg,#6c63ff,#4f46e5);color:#fff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;margin:0 8px 8px;">🌐 Visit Website</a>
        <a href="${WA}" style="display:inline-block;background:linear-gradient(135deg,#25d366,#128c7e);color:#fff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;margin:0 8px 8px;">💬 WhatsApp Us</a>
      </td></tr>

      <tr><td style="background:#1e293b;padding:24px 40px;text-align:center;">
        <p style="color:#94a3b8;font-size:13px;margin:0 0 6px;">Thank you for choosing <strong style="color:#fff;">ShreeNova Tech</strong> ❤️</p>
        <p style="color:#64748b;font-size:12px;margin:0;">© ${new Date().getFullYear()} ShreeNova Tech. All rights reserved.</p>
      </td></tr>

    </table>
  </td></tr>
</table>
</body>
</html>`;
}

const sendApprovalEmail = async (payment) => {
  await transporter.sendMail({
    from:    FROM,
    to:      payment.email,
    subject: '✅ Payment Verified Successfully — ShreeNova Tech',
    html:    approvalTemplate(payment),
  });
};

const sendRejectionEmail = async (payment) => {
  await transporter.sendMail({
    from:    FROM,
    to:      payment.email,
    subject: '❌ Payment Could Not Be Verified — ShreeNova Tech',
    html:    rejectionTemplate(payment),
  });
};

module.exports = { sendApprovalEmail, sendRejectionEmail };
