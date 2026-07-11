<?php
class NewsletterController {
    public function index(): void {
        verifyToken();
        $rows = getDB()->query('SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC')->fetch_all(MYSQLI_ASSOC);
        ok($rows);
    }
    public function store(): void {
        rateLimit('newsletter_' . ($_SERVER['REMOTE_ADDR'] ?? ''), 3, 60);
        $b     = body();
        $email = clean($b['email'] ?? '');
        if (!validateEmail($email)) err('Enter a valid email address.');
        $db   = getDB();
        $stmt = $db->prepare('INSERT INTO newsletter_subscribers (email) VALUES (?) ON DUPLICATE KEY UPDATE is_active = 1');
        $stmt->bind_param('s', $email);
        if (!$stmt->execute()) err('Failed to subscribe.');
        ok(null, 'Subscribed successfully', 201);
    }
}
