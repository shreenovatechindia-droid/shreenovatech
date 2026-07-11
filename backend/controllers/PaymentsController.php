<?php
class PaymentsController {

    public function index(): void {
        verifyToken();
        $db     = getDB();
        $page   = max(1, (int)($_GET['page']   ?? 1));
        $limit  = min(100, (int)($_GET['limit'] ?? 20));
        $offset = ($page - 1) * $limit;
        $status = clean($_GET['status']  ?? '');
        $pkg    = clean($_GET['package'] ?? '');
        $search = clean($_GET['search']  ?? '');

        $where = [];
        if ($status) $where[] = "status = '$status'";
        if ($pkg)    $where[] = "package_key = '$pkg'";
        if ($search) $where[] = "(full_name LIKE '%$search%' OR email LIKE '%$search%' OR ref_id LIKE '%$search%')";
        $whereSQL = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $total = (int)$db->query("SELECT COUNT(*) FROM payments $whereSQL")->fetch_row()[0];
        $rows  = $db->query("SELECT * FROM payments $whereSQL ORDER BY created_at DESC LIMIT $limit OFFSET $offset")
                    ->fetch_all(MYSQLI_ASSOC);

        ok(['payments' => $rows, 'pagination' => paginate($total, $page, $limit)]);
    }

    public function show(int $id): void {
        verifyToken();
        $db   = getDB();
        $stmt = $db->prepare('SELECT * FROM payments WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if (!$row) err('Payment not found', 404);
        ok($row);
    }

    public function store(): void {
        rateLimit('payment_' . ($_SERVER['REMOTE_ADDR'] ?? ''), 5, 300);

        // Support both JSON body and multipart form
        $b = !empty($_POST) ? $_POST : body();

        $fullName  = clean($b['fullName']  ?? '');
        $mobile    = clean($b['mobile']    ?? '');
        $email     = clean($b['email']     ?? '');
        $payMethod = clean($b['payMethod'] ?? '');
        $pkgKey    = clean($b['package']   ?? 'silver');

        if (!$fullName)                  err('Full name is required.');
        if (!validateMobile($mobile))    err('Enter a valid 10-digit Indian mobile number.');
        if (!validateEmail($email))      err('Enter a valid email address.');
        if (!$payMethod)                 err('Please select a payment method.');

        $pkgMap = [
            'silver'  => ['Silver Package',  9999],
            'golden'  => ['Golden Package',  14999],
            'diamond' => ['Diamond Package', 19999],
        ];
        if (!isset($pkgMap[$pkgKey])) $pkgKey = 'silver';
        [$pkgName, $amount] = $pkgMap[$pkgKey];
        $gst   = round($amount * 0.18);
        $total = $amount + $gst;

        $whatsapp = clean($b['whatsapp'] ?? '');
        $company  = clean($b['company']  ?? '');
        $gstNum   = clean($b['gst']      ?? '');
        $address  = clean($b['address']  ?? '');
        $city     = clean($b['city']     ?? '');
        $state    = clean($b['state']    ?? '');
        $country  = clean($b['country']  ?? 'India');
        $pincode  = clean($b['pincode']  ?? '');
        $txnId    = clean($b['transaction_id'] ?? '');
        $refId    = genRef('PAY');

        // Screenshot upload
        $screenshotUrl = '';
        if (!empty($_FILES['screenshot'])) {
            $screenshotUrl = uploadFile($_FILES['screenshot'], 'payments', ['jpg','jpeg','png','pdf']) ?: '';
        }

        $db   = getDB();
        $stmt = $db->prepare('INSERT INTO payments (ref_id,full_name,mobile,whatsapp,email,company,gst,address,city,state,country,pincode,package_key,package_name,amount,gst_amount,total_amount,pay_method,transaction_id,screenshot_url) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->bind_param('ssssssssssssssdddsss',
            $refId,$fullName,$mobile,$whatsapp,$email,$company,$gstNum,$address,
            $city,$state,$country,$pincode,$pkgKey,$pkgName,
            $amount,$gst,$total,$payMethod,$txnId,$screenshotUrl
        );
        if (!$stmt->execute()) err('Failed to submit payment. Please try again.');

        ok(['ref_id' => $refId], 'Payment submitted successfully', 201);
    }

    public function updateStatus(int $id): void {
        $payload = requireRole('super_admin', 'admin');
        $b      = body();
        $status = clean($b['status'] ?? '');
        $notes  = clean($b['admin_notes'] ?? '');
        if (!in_array($status, ['pending','verified','rejected'])) err('Invalid status.');

        $db   = getDB();
        $stmt = $db->prepare('UPDATE payments SET status=?, admin_notes=?, verified_by=?, verified_at=NOW() WHERE id=?');
        $stmt->bind_param('ssii', $status, $notes, $payload['id'], $id);
        $stmt->execute();
        logActivity($payload['id'], "payment_$status", 'payments', $id);
        ok(null, 'Payment status updated');
    }

    public function destroy(int $id): void {
        $payload = requireRole('super_admin', 'admin');
        $db   = getDB();
        $stmt = $db->prepare('DELETE FROM payments WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        logActivity($payload['id'], 'delete', 'payments', $id);
        ok(null, 'Payment deleted');
    }
}
