<?php
class BookingsController {

    public function index(): void {
        verifyToken();
        $db     = getDB();
        $page   = max(1, (int)($_GET['page']   ?? 1));
        $limit  = min(100, (int)($_GET['limit'] ?? 20));
        $offset = ($page - 1) * $limit;
        $status = clean($_GET['status'] ?? '');
        $search = clean($_GET['search'] ?? '');

        $where = [];
        if ($status) $where[] = "status = '$status'";
        if ($search) $where[] = "(full_name LIKE '%$search%' OR email LIKE '%$search%' OR mobile LIKE '%$search%' OR ref_id LIKE '%$search%')";
        $whereSQL = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $total = (int)$db->query("SELECT COUNT(*) FROM bookings $whereSQL")->fetch_row()[0];
        $rows  = $db->query("SELECT * FROM bookings $whereSQL ORDER BY created_at DESC LIMIT $limit OFFSET $offset")
                    ->fetch_all(MYSQLI_ASSOC);

        foreach ($rows as &$r) {
            $r['services'] = json_decode($r['services'] ?? '[]');
        }

        ok(['bookings' => $rows, 'pagination' => paginate($total, $page, $limit)]);
    }

    public function show(int $id): void {
        verifyToken();
        $db   = getDB();
        $stmt = $db->prepare('SELECT * FROM bookings WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if (!$row) err('Booking not found', 404);
        $row['services'] = json_decode($row['services'] ?? '[]');
        ok($row);
    }

    public function store(): void {
        rateLimit('booking_' . ($_SERVER['REMOTE_ADDR'] ?? ''), 5, 300);

        // Support both JSON and multipart/form-data
        $b = !empty($_POST) ? $_POST : body();

        $fullName = clean($b['fullName'] ?? '');
        $mobile   = clean($b['mobile']   ?? '');
        $email    = clean($b['email']    ?? '');

        if (!$fullName) err('Full name is required.');
        if (!validateMobile($mobile)) err('Enter a valid 10-digit Indian mobile number.');
        if (!validateEmail($email))   err('Enter a valid email address.');

        $whatsapp    = clean($b['whatsapp']    ?? $mobile);
        $company     = clean($b['company']     ?? '');
        $business    = clean($b['business']    ?? $company);
        $website     = clean($b['website']     ?? '');
        $city        = clean($b['city']        ?? '');
        $state       = clean($b['state']       ?? '');
        $country     = clean($b['country']     ?? 'India');
        $projectType = clean($b['projectType'] ?? '');
        $budget      = clean($b['budget']      ?? '');
        $timeline    = clean($b['timeline']    ?? 'Flexible');
        $description = clean($b['description'] ?? '');
        $rawServices = $b['services'] ?? [];
        if (is_string($rawServices)) $rawServices = json_decode($rawServices, true) ?? [];
        $services    = json_encode($rawServices);
        $refId       = genRef('BK');

        // File uploads
        $logoUrl   = '';
        $imagesUrl = '';
        $docsUrl   = '';
        if (!empty($_FILES['logoFile']))   $logoUrl   = uploadFile($_FILES['logoFile'],   'logos')     ?: '';
        if (!empty($_FILES['imagesFile'])) $imagesUrl = uploadFile($_FILES['imagesFile'], 'portfolio') ?: '';
        if (!empty($_FILES['docsFile']))   $docsUrl   = uploadFile($_FILES['docsFile'],   'portfolio') ?: '';

        $db   = getDB();
        $stmt = $db->prepare(
            'INSERT INTO bookings (ref_id,full_name,mobile,whatsapp,email,company,business,website,
             city,state,country,project_type,budget,timeline,description,services,logo_url,images_url,docs_url)
             VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)'
        );
        $stmt->bind_param('sssssssssssssssssss',
            $refId,$fullName,$mobile,$whatsapp,$email,$company,$business,$website,
            $city,$state,$country,$projectType,$budget,$timeline,$description,
            $services,$logoUrl,$imagesUrl,$docsUrl
        );
        if (!$stmt->execute()) err('Failed to submit booking. Please try again.');

        $bookingId = $db->insert_id;

        // ── Admin Notification ────────────────────────────────
        $this->createNotification($db, $bookingId, $refId, $fullName, $mobile, $email, $projectType, $budget);

        // ── Send Emails (non-blocking — ignore failures) ──────
        $this->sendUserEmail($email, $fullName, $refId, $projectType, $budget, $rawServices);
        $this->sendAdminEmail($db, $refId, $fullName, $mobile, $email, $projectType, $budget, $description, $rawServices);

        ok(['ref_id' => $refId], 'Booking submitted successfully', 201);
    }

    // ── Create admin notification ─────────────────────────────
    private function createNotification($db, int $bookingId, string $refId, string $name,
                                        string $mobile, string $email, string $project, string $budget): void {
        // Check if notifications table exists
        $check = $db->query("SHOW TABLES LIKE 'notifications'");
        if ($check->num_rows === 0) {
            $db->query("CREATE TABLE IF NOT EXISTS notifications (
                id          INT AUTO_INCREMENT PRIMARY KEY,
                type        VARCHAR(50) DEFAULT 'booking',
                title       VARCHAR(200) NOT NULL,
                message     TEXT,
                ref_id      VARCHAR(25),
                record_id   INT DEFAULT NULL,
                is_read     TINYINT(1) DEFAULT 0,
                created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                INDEX idx_read (is_read),
                INDEX idx_type (type),
                INDEX idx_created (created_at)
            ) ENGINE=InnoDB");
        }

        $title   = "New Booking: $name";
        $message = "Ref: $refId | Mobile: $mobile | Email: $email | Project: $project | Budget: $budget | Status: Pending | Estimated Contact: 30 Minutes";
        $stmt    = $db->prepare('INSERT INTO notifications (type, title, message, ref_id, record_id) VALUES (?,?,?,?,?)');
        $stmt->bind_param('ssssi', ...['booking', $title, $message, $refId, $bookingId]);
        $stmt->execute();
    }

    // ── Email to user ─────────────────────────────────────────
    private function sendUserEmail(string $email, string $name, string $refId,
                                   string $project, string $budget, array $services): void {
        $serviceList = $services ? '<ul style="margin:8px 0;padding-left:20px">' .
            implode('', array_map(fn($s) => "<li style='margin:4px 0'>$s</li>", $services)) . '</ul>' : '<p>—</p>';

        $html = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  <div style="background:linear-gradient(135deg,#16a34a,#22c55e);padding:36px 40px;text-align:center">
    <h1 style="color:#fff;margin:0;font-size:26px;font-weight:800">✅ Booking Confirmed!</h1>
    <p style="color:rgba(255,255,255,0.9);margin:8px 0 0;font-size:15px">ShreeNova Tech</p>
  </div>
  <div style="padding:36px 40px">
    <p style="font-size:16px;color:#0f172a;margin:0 0 20px">Dear <strong>$name</strong>,</p>
    <p style="font-size:14px;color:#475569;line-height:1.7;margin:0 0 24px">
      Thank you for choosing <strong>ShreeNova Tech</strong>! Your project booking has been received successfully.
      Our team will contact you within <strong>30 minutes</strong>.
    </p>

    <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:12px;padding:20px 24px;margin-bottom:24px">
      <p style="margin:0 0 12px;font-size:13px;font-weight:700;color:#15803d;text-transform:uppercase;letter-spacing:0.8px">Booking Details</p>
      <table style="width:100%;border-collapse:collapse">
        <tr><td style="padding:6px 0;font-size:13.5px;color:#64748b;width:140px">Reference ID</td><td style="padding:6px 0;font-size:13.5px;font-weight:700;color:#0f172a">$refId</td></tr>
        <tr><td style="padding:6px 0;font-size:13.5px;color:#64748b">Project Type</td><td style="padding:6px 0;font-size:13.5px;font-weight:600;color:#0f172a">$project</td></tr>
        <tr><td style="padding:6px 0;font-size:13.5px;color:#64748b">Budget</td><td style="padding:6px 0;font-size:13.5px;font-weight:600;color:#0f172a">$budget</td></tr>
        <tr><td style="padding:6px 0;font-size:13.5px;color:#64748b">Status</td><td style="padding:6px 0"><span style="background:#fef3c7;color:#d97706;border:1px solid #fde68a;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700">⏳ Pending</span></td></tr>
        <tr><td style="padding:6px 0;font-size:13.5px;color:#64748b">Est. Contact</td><td style="padding:6px 0;font-size:13.5px;font-weight:700;color:#16a34a">⏱ Within 30 Minutes</td></tr>
      </table>
    </div>

    <div style="margin-bottom:24px">
      <p style="font-size:13px;font-weight:700;color:#374151;margin:0 0 8px">Services Requested:</p>
      $serviceList
    </div>

    <div style="background:#eff6ff;border:1px solid #bfdbfe;border-radius:12px;padding:16px 20px;margin-bottom:28px">
      <p style="margin:0;font-size:13.5px;color:#1d4ed8;font-weight:600">
        📞 Need immediate help? WhatsApp us at <a href="https://wa.me/918987050207" style="color:#1d4ed8">+91 89870 50207</a>
      </p>
    </div>

    <p style="font-size:13px;color:#94a3b8;margin:0">
      Best regards,<br>
      <strong style="color:#0f172a">ShreeNova Tech Team</strong><br>
      <a href="https://www.shreenovatech.in" style="color:#16a34a">www.shreenovatech.in</a>
    </p>
  </div>
  <div style="background:#f8fafc;padding:20px 40px;text-align:center;border-top:1px solid #e2e8f0">
    <p style="margin:0;font-size:12px;color:#94a3b8">© 2024 ShreeNova Tech. All rights reserved.</p>
  </div>
</div>
</body>
</html>
HTML;
        @sendMail($email, $name, "✅ Booking Confirmed – Ref: $refId | ShreeNova Tech", $html);
    }

    // ── Email to admin ────────────────────────────────────────
    private function sendAdminEmail($db, string $refId, string $name, string $mobile,
                                    string $email, string $project, string $budget,
                                    string $description, array $services): void {
        // Get admin email from settings
        $row = $db->query("SELECT setting_value FROM site_settings WHERE setting_key = 'company_email' LIMIT 1")->fetch_assoc();
        $adminEmail = $row['setting_value'] ?? '';
        if (!$adminEmail) return;

        $serviceList = $services ? implode(', ', $services) : '—';
        $desc        = $description ?: '—';
        $now         = date('d M Y, h:i A');

        $html = <<<HTML
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Segoe UI',Arial,sans-serif">
<div style="max-width:600px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08)">
  <div style="background:linear-gradient(135deg,#0f172a,#1e293b);padding:28px 40px">
    <h1 style="color:#22c55e;margin:0;font-size:20px;font-weight:800">🔔 New Booking Received</h1>
    <p style="color:rgba(255,255,255,0.6);margin:6px 0 0;font-size:13px">ShreeNova Tech Admin Alert · $now</p>
  </div>
  <div style="padding:32px 40px">
    <div style="background:#fef3c7;border:1px solid #fde68a;border-radius:10px;padding:14px 18px;margin-bottom:24px">
      <p style="margin:0;font-size:14px;font-weight:700;color:#d97706">⏱ Action Required: Contact customer within 30 minutes</p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px">
      <tr style="background:#f8fafc"><td style="padding:10px 14px;font-size:13px;color:#64748b;font-weight:600;width:140px;border:1px solid #e2e8f0">Ref ID</td><td style="padding:10px 14px;font-size:13px;font-weight:700;color:#0f172a;border:1px solid #e2e8f0">$refId</td></tr>
      <tr><td style="padding:10px 14px;font-size:13px;color:#64748b;font-weight:600;border:1px solid #e2e8f0">Name</td><td style="padding:10px 14px;font-size:13px;color:#0f172a;border:1px solid #e2e8f0">$name</td></tr>
      <tr style="background:#f8fafc"><td style="padding:10px 14px;font-size:13px;color:#64748b;font-weight:600;border:1px solid #e2e8f0">Mobile</td><td style="padding:10px 14px;font-size:13px;color:#0f172a;border:1px solid #e2e8f0"><a href="tel:$mobile" style="color:#16a34a;font-weight:700">$mobile</a></td></tr>
      <tr><td style="padding:10px 14px;font-size:13px;color:#64748b;font-weight:600;border:1px solid #e2e8f0">Email</td><td style="padding:10px 14px;font-size:13px;color:#0f172a;border:1px solid #e2e8f0"><a href="mailto:$email" style="color:#16a34a">$email</a></td></tr>
      <tr style="background:#f8fafc"><td style="padding:10px 14px;font-size:13px;color:#64748b;font-weight:600;border:1px solid #e2e8f0">Project</td><td style="padding:10px 14px;font-size:13px;color:#0f172a;border:1px solid #e2e8f0">$project</td></tr>
      <tr><td style="padding:10px 14px;font-size:13px;color:#64748b;font-weight:600;border:1px solid #e2e8f0">Budget</td><td style="padding:10px 14px;font-size:13px;font-weight:700;color:#16a34a;border:1px solid #e2e8f0">$budget</td></tr>
      <tr style="background:#f8fafc"><td style="padding:10px 14px;font-size:13px;color:#64748b;font-weight:600;border:1px solid #e2e8f0">Services</td><td style="padding:10px 14px;font-size:13px;color:#0f172a;border:1px solid #e2e8f0">$serviceList</td></tr>
      <tr><td style="padding:10px 14px;font-size:13px;color:#64748b;font-weight:600;border:1px solid #e2e8f0">Status</td><td style="padding:10px 14px;border:1px solid #e2e8f0"><span style="background:#fef3c7;color:#d97706;border:1px solid #fde68a;border-radius:20px;padding:3px 12px;font-size:12px;font-weight:700">Pending</span></td></tr>
    </table>

    <div style="background:#f8fafc;border-radius:10px;padding:16px 18px;margin-bottom:24px">
      <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#64748b;text-transform:uppercase">Description</p>
      <p style="margin:0;font-size:13.5px;color:#374151;line-height:1.6">$desc</p>
    </div>

    <a href="http://localhost/shreenovatech/backend/admin/bookings.html"
       style="display:inline-block;background:linear-gradient(135deg,#16a34a,#22c55e);color:#fff;padding:13px 28px;border-radius:10px;font-size:14px;font-weight:700;text-decoration:none">
      View in Admin Panel →
    </a>
  </div>
</div>
</body>
</html>
HTML;
        @sendMail($adminEmail, 'ShreeNova Tech Admin', "🔔 New Booking: $name – $refId", $html);
    }

    public function update(int $id): void {
        $payload = requireRole('super_admin', 'admin', 'support');
        $b = body();
        $notes = clean($b['admin_notes'] ?? '');

        $db   = getDB();
        $stmt = $db->prepare('UPDATE bookings SET admin_notes = ? WHERE id = ?');
        $stmt->bind_param('si', $notes, $id);
        $stmt->execute();
        logActivity($payload['id'], 'update', 'bookings', $id);
        ok(null, 'Booking updated');
    }

    public function updateStatus(int $id): void {
        $payload = requireRole('super_admin', 'admin', 'support');
        $b      = body();
        $status = clean($b['status'] ?? '');
        $allowed = ['new','contacted','in_progress','completed','cancelled'];
        if (!in_array($status, $allowed)) err('Invalid status.');

        $db   = getDB();
        $stmt = $db->prepare('UPDATE bookings SET status = ? WHERE id = ?');
        $stmt->bind_param('si', $status, $id);
        $stmt->execute();
        logActivity($payload['id'], "status_$status", 'bookings', $id);
        ok(null, 'Status updated');
    }

    public function destroy(int $id): void {
        $payload = requireRole('super_admin', 'admin');
        $db   = getDB();
        $stmt = $db->prepare('DELETE FROM bookings WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        logActivity($payload['id'], 'delete', 'bookings', $id);
        ok(null, 'Booking deleted');
    }
}
