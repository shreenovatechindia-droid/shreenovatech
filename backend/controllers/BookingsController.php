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
        $b = body();

        $fullName = clean($b['fullName'] ?? '');
        $mobile   = clean($b['mobile']   ?? '');
        $email    = clean($b['email']    ?? '');

        if (!$fullName) err('Full name is required.');
        if (!validateMobile($mobile)) err('Enter a valid 10-digit Indian mobile number.');
        if (!validateEmail($email))   err('Enter a valid email address.');

        $whatsapp    = clean($b['whatsapp']    ?? '');
        $company     = clean($b['company']     ?? '');
        $business    = clean($b['business']    ?? '');
        $website     = clean($b['website']     ?? '');
        $city        = clean($b['city']        ?? '');
        $state       = clean($b['state']       ?? '');
        $country     = clean($b['country']     ?? 'India');
        $projectType = clean($b['projectType'] ?? '');
        $budget      = clean($b['budget']      ?? '');
        $timeline    = clean($b['timeline']    ?? '');
        $description = clean($b['description'] ?? '');
        $services    = json_encode($b['services'] ?? []);
        $refId       = genRef('BK');

        // Handle file uploads
        $logoUrl   = '';
        $imagesUrl = '';
        $docsUrl   = '';
        if (!empty($_FILES['logoFile']))   $logoUrl   = uploadFile($_FILES['logoFile'],   'logos')   ?: '';
        if (!empty($_FILES['imagesFile'])) $imagesUrl = uploadFile($_FILES['imagesFile'], 'portfolio') ?: '';
        if (!empty($_FILES['docsFile']))   $docsUrl   = uploadFile($_FILES['docsFile'],   'portfolio') ?: '';

        $db   = getDB();
        $stmt = $db->prepare('INSERT INTO bookings (ref_id,full_name,mobile,whatsapp,email,company,business,website,city,state,country,project_type,budget,timeline,description,services,logo_url,images_url,docs_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->bind_param('sssssssssssssssssss',
            $refId,$fullName,$mobile,$whatsapp,$email,$company,$business,$website,
            $city,$state,$country,$projectType,$budget,$timeline,$description,
            $services,$logoUrl,$imagesUrl,$docsUrl
        );
        if (!$stmt->execute()) err('Failed to submit booking. Please try again.');

        ok(['ref_id' => $refId], 'Booking submitted successfully', 201);
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
