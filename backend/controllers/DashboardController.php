<?php
class DashboardController {

    public function index(): void {
        verifyToken();
        $db = getDB();

        // Counts
        $counts = [];
        $queries = [
            'total_bookings'   => "SELECT COUNT(*) FROM bookings",
            'pending_bookings' => "SELECT COUNT(*) FROM bookings WHERE status = 'new'",
            'completed'        => "SELECT COUNT(*) FROM bookings WHERE status = 'completed'",
            'total_payments'   => "SELECT COUNT(*) FROM payments",
            'pending_payments' => "SELECT COUNT(*) FROM payments WHERE status = 'pending'",
            'total_contacts'   => "SELECT COUNT(*) FROM contacts",
            'new_contacts'     => "SELECT COUNT(*) FROM contacts WHERE status = 'new'",
            'total_portfolio'  => "SELECT COUNT(*) FROM portfolio WHERE is_active = 1",
            'subscribers'      => "SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = 1",
            'today_visitors'   => "SELECT COUNT(*) FROM visitors WHERE visit_date = CURDATE()",
            'total_visitors'   => "SELECT COUNT(*) FROM visitors",
        ];
        foreach ($queries as $key => $sql) {
            $counts[$key] = (int)$db->query($sql)->fetch_row()[0];
        }

        // Revenue
        $rev = $db->query("SELECT COALESCE(SUM(total_amount),0) as total FROM payments WHERE status = 'verified'")->fetch_assoc();
        $counts['total_revenue'] = (float)$rev['total'];

        // Monthly bookings (last 6 months)
        $monthly = $db->query("
            SELECT DATE_FORMAT(created_at,'%b %Y') as month,
                   COUNT(*) as bookings,
                   SUM(CASE WHEN status='completed' THEN 1 ELSE 0 END) as completed
            FROM bookings
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(created_at,'%Y-%m')
            ORDER BY MIN(created_at)
        ")->fetch_all(MYSQLI_ASSOC);

        // Monthly revenue (last 6 months)
        $revenue = $db->query("
            SELECT DATE_FORMAT(created_at,'%b %Y') as month,
                   COALESCE(SUM(total_amount),0) as amount
            FROM payments
            WHERE status = 'verified' AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
            GROUP BY DATE_FORMAT(created_at,'%Y-%m')
            ORDER BY MIN(created_at)
        ")->fetch_all(MYSQLI_ASSOC);

        // Recent bookings
        $recent_bookings = $db->query("
            SELECT id, ref_id, full_name, email, mobile, project_type, status, created_at
            FROM bookings ORDER BY created_at DESC LIMIT 5
        ")->fetch_all(MYSQLI_ASSOC);

        // Recent contacts
        $recent_contacts = $db->query("
            SELECT id, name, email, phone, message, status, created_at
            FROM contacts ORDER BY created_at DESC LIMIT 5
        ")->fetch_all(MYSQLI_ASSOC);

        // Recent payments
        $recent_payments = $db->query("
            SELECT id, ref_id, full_name, email, package_name, total_amount, status, created_at
            FROM payments ORDER BY created_at DESC LIMIT 5
        ")->fetch_all(MYSQLI_ASSOC);

        // Activity log
        $activity = $db->query("
            SELECT al.*, au.full_name as admin_name
            FROM activity_log al
            LEFT JOIN admin_users au ON al.admin_id = au.id
            ORDER BY al.created_at DESC LIMIT 10
        ")->fetch_all(MYSQLI_ASSOC);

        ok([
            'counts'          => $counts,
            'monthly_bookings'=> $monthly,
            'monthly_revenue' => $revenue,
            'recent_bookings' => $recent_bookings,
            'recent_contacts' => $recent_contacts,
            'recent_payments' => $recent_payments,
            'activity'        => $activity,
        ]);
    }
}
