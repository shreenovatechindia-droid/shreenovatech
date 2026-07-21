const { Booking, Payment, Contact, Portfolio, Newsletter, Visitor, Activity, AdminUser } = require('../models');
const { ok } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const [
    total_bookings, pending_bookings, completed,
    total_payments, pending_payments,
    total_contacts, new_contacts,
    total_portfolio, subscribers,
    today_visitors, total_visitors,
    revResult,
    monthly_bookings, monthly_revenue,
    recent_bookings, recent_contacts, recent_payments, activity,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'new' }),
    Booking.countDocuments({ status: 'completed' }),
    Payment.countDocuments(),
    Payment.countDocuments({ status: 'pending' }),
    Contact.countDocuments(),
    Contact.countDocuments({ status: 'new' }),
    Portfolio.countDocuments({ is_active: true }),
    Newsletter.countDocuments({ is_active: true }),
    Visitor.countDocuments({ visit_date: new Date().toISOString().slice(0,10) }),
    Visitor.countDocuments(),
    Payment.aggregate([{ $match: { status: 'verified' } }, { $group: { _id: null, total: { $sum: '$total_amount' } } }]),
    Booking.aggregate([
      { $match: { created_at: { $gte: new Date(Date.now() - 6*30*24*60*60*1000) } } },
      { $group: { _id: { $dateToString: { format: '%b %Y', date: '$created_at' } },
          bookings: { $sum: 1 },
          completed: { $sum: { $cond: [{ $eq: ['$status','completed'] }, 1, 0] } } } },
      { $sort: { _id: 1 } },
    ]),
    Payment.aggregate([
      { $match: { status: 'verified', created_at: { $gte: new Date(Date.now() - 6*30*24*60*60*1000) } } },
      { $group: { _id: { $dateToString: { format: '%b %Y', date: '$created_at' } }, amount: { $sum: '$total_amount' } } },
      { $sort: { _id: 1 } },
    ]),
    Booking.find().select('ref_id full_name email mobile project_type status created_at').sort({ created_at: -1 }).limit(5),
    Contact.find().select('name email phone message status created_at').sort({ created_at: -1 }).limit(5),
    Payment.find().select('ref_id full_name email package_name total_amount status created_at').sort({ created_at: -1 }).limit(5),
    Activity.find().sort({ created_at: -1 }).limit(10),
  ]);

  ok(res, {
    counts: {
      total_bookings, pending_bookings, completed,
      total_payments, pending_payments,
      total_contacts, new_contacts,
      total_portfolio, subscribers,
      today_visitors, total_visitors,
      total_revenue: revResult[0]?.total || 0,
    },
    monthly_bookings: monthly_bookings.map(r => ({ month: r._id, bookings: r.bookings, completed: r.completed })),
    monthly_revenue:  monthly_revenue.map(r => ({ month: r._id, amount: r.amount })),
    recent_bookings, recent_contacts, recent_payments, activity,
  });
};
