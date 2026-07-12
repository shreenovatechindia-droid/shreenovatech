<?php
class NotificationsController {

    private function ensureTable($db): void {
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

    public function index(): void {
        verifyToken();
        $db = getDB();
        $this->ensureTable($db);
        $rows  = $db->query("SELECT * FROM notifications ORDER BY created_at DESC LIMIT 50")->fetch_all(MYSQLI_ASSOC);
        $unread = (int)$db->query("SELECT COUNT(*) FROM notifications WHERE is_read = 0")->fetch_row()[0];
        ok(['notifications' => $rows, 'unread' => $unread]);
    }

    public function markRead(int $id): void {
        verifyToken();
        $db   = getDB();
        $this->ensureTable($db);
        $stmt = $db->prepare('UPDATE notifications SET is_read = 1 WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        ok(null, 'Marked as read');
    }

    public function markAllRead(): void {
        verifyToken();
        $db = getDB();
        $this->ensureTable($db);
        $db->query('UPDATE notifications SET is_read = 1');
        ok(null, 'All marked as read');
    }

    public function destroy(int $id): void {
        requireRole('super_admin', 'admin');
        $db   = getDB();
        $stmt = $db->prepare('DELETE FROM notifications WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        ok(null, 'Notification deleted');
    }
}
