<?php
class ContactController {

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
        if ($search) $where[] = "(name LIKE '%$search%' OR email LIKE '%$search%' OR message LIKE '%$search%')";
        $whereSQL = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $total = (int)$db->query("SELECT COUNT(*) FROM contacts $whereSQL")->fetch_row()[0];
        $rows  = $db->query("SELECT * FROM contacts $whereSQL ORDER BY created_at DESC LIMIT $limit OFFSET $offset")
                    ->fetch_all(MYSQLI_ASSOC);

        ok(['contacts' => $rows, 'pagination' => paginate($total, $page, $limit)]);
    }

    public function show(int $id): void {
        verifyToken();
        $db   = getDB();
        $stmt = $db->prepare('UPDATE contacts SET status = "read" WHERE id = ? AND status = "new"');
        $stmt->bind_param('i', $id);
        $stmt->execute();

        $stmt2 = $db->prepare('SELECT * FROM contacts WHERE id = ?');
        $stmt2->bind_param('i', $id);
        $stmt2->execute();
        $row = $stmt2->get_result()->fetch_assoc();
        if (!$row) err('Contact not found', 404);
        ok($row);
    }

    public function store(): void {
        rateLimit('contact_' . ($_SERVER['REMOTE_ADDR'] ?? ''), 5, 300);
        $b = body();

        $name    = clean($b['name']    ?? '');
        $email   = clean($b['email']   ?? '');
        $phone   = clean($b['phone']   ?? '');
        $message = clean($b['message'] ?? '');

        if (!$name)                  err('Name is required.');
        if (!validateEmail($email))  err('Enter a valid email address.');
        if (!$message)               err('Message is required.');

        $ip   = $_SERVER['REMOTE_ADDR'] ?? '';
        $db   = getDB();
        $stmt = $db->prepare('INSERT INTO contacts (name,email,phone,message,ip_address) VALUES (?,?,?,?,?)');
        $stmt->bind_param('sssss', $name,$email,$phone,$message,$ip);
        if (!$stmt->execute()) err('Failed to submit message.');

        ok(null, 'Message sent successfully', 201);
    }

    public function update(int $id): void {
        $payload = requireRole('super_admin', 'admin', 'support');
        $b      = body();
        $status = clean($b['status'] ?? '');
        if (!in_array($status, ['new','read','replied'])) err('Invalid status.');

        $db   = getDB();
        $stmt = $db->prepare('UPDATE contacts SET status = ? WHERE id = ?');
        $stmt->bind_param('si', $status, $id);
        $stmt->execute();
        logActivity($payload['id'], "contact_$status", 'contacts', $id);
        ok(null, 'Status updated');
    }

    public function reply(int $id): void {
        $payload = requireRole('super_admin', 'admin', 'support');
        $b     = body();
        $reply = clean($b['reply'] ?? '');
        if (!$reply) err('Reply text is required.');

        $db   = getDB();
        $stmt = $db->prepare('UPDATE contacts SET status="replied", reply_text=?, replied_by=?, replied_at=NOW() WHERE id=?');
        $stmt->bind_param('sii', $reply, $payload['id'], $id);
        $stmt->execute();
        logActivity($payload['id'], 'reply', 'contacts', $id);
        ok(null, 'Reply saved');
    }

    public function destroy(int $id): void {
        $payload = requireRole('super_admin', 'admin');
        $db   = getDB();
        $stmt = $db->prepare('DELETE FROM contacts WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        logActivity($payload['id'], 'delete', 'contacts', $id);
        ok(null, 'Contact deleted');
    }
}
