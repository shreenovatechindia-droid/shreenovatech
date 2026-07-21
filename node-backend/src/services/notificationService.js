const { Notification } = require('../models');

const createNotification = async ({ type, title, message, ref_id, record_id }) => {
  try {
    await Notification.create({ type, title, message, ref_id, record_id });
  } catch (e) {
    console.error('Notification create error:', e.message);
  }
};

const paymentApprovedNotif = (payment) =>
  createNotification({
    type:      'payment_approved',
    title:     `✅ Payment Approved — ${payment.full_name}`,
    message:   `Booking ${payment.ref_id} | ${payment.package_name} | ₹${Number(payment.total_amount||0).toLocaleString('en-IN')}`,
    ref_id:    payment.ref_id,
    record_id: String(payment._id),
  });

const paymentRejectedNotif = (payment) =>
  createNotification({
    type:      'payment_rejected',
    title:     `❌ Payment Rejected — ${payment.full_name}`,
    message:   `Booking ${payment.ref_id} could not be verified.`,
    ref_id:    payment.ref_id,
    record_id: String(payment._id),
  });

const newPaymentNotif = (payment) =>
  createNotification({
    type:      'new_payment',
    title:     `💳 New Payment Received — ${payment.full_name}`,
    message:   `${payment.package_name} | ₹${Number(payment.total_amount||0).toLocaleString('en-IN')}`,
    ref_id:    payment.ref_id,
    record_id: String(payment._id),
  });

module.exports = { paymentApprovedNotif, paymentRejectedNotif, newPaymentNotif };
