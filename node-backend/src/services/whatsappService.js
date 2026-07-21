const axios = require('axios');

// ── Meta WhatsApp Cloud API ───────────────────────────────────
const sendViaMetaAPI = async (to, message) => {
  const phoneId = process.env.WHATSAPP_PHONE_ID;
  const token   = process.env.WHATSAPP_TOKEN;

  if (!phoneId || !token) {
    console.warn('⚠️  WhatsApp env vars not set (WHATSAPP_PHONE_ID, WHATSAPP_TOKEN). Skipping.');
    return;
  }

  // Normalize number — remove +, spaces, dashes
  const number = to.replace(/[\s\-\+]/g, '');

  await axios.post(
    `https://graph.facebook.com/v19.0/${phoneId}/messages`,
    {
      messaging_product: 'whatsapp',
      to: number,
      type: 'text',
      text: { body: message },
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );
};

// ── Future: Twilio Support ────────────────────────────────────
// const sendViaTwilio = async (to, message) => {
//   const client = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
//   await client.messages.create({
//     from: `whatsapp:${process.env.TWILIO_WA_FROM}`,
//     to:   `whatsapp:${to}`,
//     body: message,
//   });
// };

// ── Message Templates ─────────────────────────────────────────
const approvalMessage = (p) =>
`Hello ${p.full_name} 👋

✅ Your payment has been verified successfully.

Booking ID:
${p.ref_id}

Package:
${p.package_name || '—'}

Amount:
₹${Number(p.total_amount || 0).toLocaleString('en-IN')}

Our team will contact you within 30 minutes.

Thank you for choosing ShreeNova Tech ❤️

Website
https://shreenovatech.in`;

const rejectionMessage = (p) =>
`Hello ${p.full_name} 👋

❌ Your payment could not be verified.

Booking ID:
${p.ref_id}

Please upload a valid payment screenshot.

Our team is here to help you.
Contact us on WhatsApp or visit our website.

ShreeNova Tech
https://shreenovatech.in`;

// ── Public API ────────────────────────────────────────────────
const sendApprovalWhatsApp = async (payment) => {
  const to = payment.whatsapp || payment.mobile;
  if (!to) return;
  await sendViaMetaAPI(`91${to}`, approvalMessage(payment));
};

const sendRejectionWhatsApp = async (payment) => {
  const to = payment.whatsapp || payment.mobile;
  if (!to) return;
  await sendViaMetaAPI(`91${to}`, rejectionMessage(payment));
};

module.exports = { sendApprovalWhatsApp, sendRejectionWhatsApp };
