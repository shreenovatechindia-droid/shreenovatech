const db = require('../config/db');
const { ok } = require('../middleware/helpers');

exports.index = async (req, res) => {
  const queries = {
    total_bookings:   'SELECT COUNT(*) as v FROM bookings',
    pending_bookings: "SELECT COUNT(*) as v FROM bookings WHERE status = 'new'",
    completed:        "SELECT COUNT(*) as v FROM bookings WHERE status = 'completed'",
    total_payments:   'SELECT COUNT(*) as v FROM payments',
    pending_payments: "SELECT COUNT(*) as v FROM payments WHERE status = 'pending'",
    total_contacts:   'SELECT COUNT(*) as v FROM contacts',
    new_contacts:     "SELECT COUNT(*) as v FROM contacts WHERE status = 'new'",
    total_portfolio:  'SELECT COUNT(*) as v FROM portfolio WHERE is_active = 1',
    subscribers:      'SELECT COUNT(*) as v FROM newsletter_subscribers WHERE is_active = 1',
    today_visitors:   'SELECT COUNT(*) as v FROM visitors WHERE visit_date = CURDATE()',
    total_visitors:   'SELECT COUNT(*) as v FROM visitors',
  };

  const counts = {};
  for (const [key, sql] of Object.entries(queries)) {
    const [[row]] = await db.execute(sql);
    counts[key] = Number(row.v);
  }

  const [[rev]] = await db.execute(
    "SELECT COALESCE(SUM(total_amount),0) as total FROM payments WHERE status = 'verified'"
  );
  counts.total_revenue = parseFloat(rev.total);

  const [monthly_bookings] = await db.execute(`
    SELECT DATE_FORMAT(created_at,'%b %Y') as month,
           COUNT(*) as bookings,
           SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) as completed
    FROM bookings
    WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(created_at,'%Y-%m')
    ORDER BY MIN(created_at)
  `);

  const [monthly_revenue] = await db.execute(`
    SELECT DATE_FORMAT(created_at,'%b %Y') as month,
           COALESCE(SUM(total_amount),0) as amount
    FROM payments
    WHERE status = 'verified' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
    GROUP BY DATE_FORMAT(created_at,'%Y-%m')
    ORDER BY MIN(created_at)
  `);

  const [recent_bookings] = await db.execute(
    'SELECT id,ref_id,full_name,email,mobile,project_type,status,created_at FROM bookings ORDER BY created_at DESC LIMIT 5'
  );
  const [recent_contacts] = await db.execute(
    'SELECT id,name,email,phone,message,status,created_at FROM contacts ORDER BY created_at DESC LIMIT 5'
  );
  const [recent_payments] = await db.execute(
    'SELECT id,ref_id,full_name,email,package_name,total_amount,status,created_at FROM payments ORDER BY created_at DESC LIMIT 5'
  );
  const [activity] = await db.execute(`
    SELECT al.*, au.full_name as admin_name
    FROM activity_log al
    LEFT JOIN admin_users au ON al.admin_id = au.id
    ORDER BY al.created_at DESC LIMIT 10
  `);

  ok(res, { counts, monthly_bookings, monthly_revenue, recent_bookings, recent_contacts, recent_payments, activity });
};
