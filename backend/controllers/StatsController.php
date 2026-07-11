<?php
class StatsController {
    public function index(): void {
        $rows = getDB()->query('SELECT * FROM site_stats ORDER BY sort_order ASC')->fetch_all(MYSQLI_ASSOC);
        ok($rows);
    }
    public function update(int $id): void {
        $payload  = requireRole('super_admin', 'admin');
        $b        = body();
        $numValue = (float)($b['num_value'] ?? 0);
        $suffix   = clean($b['suffix'] ?? '');
        $label    = clean($b['label']  ?? '');
        $db   = getDB();
        $stmt = $db->prepare('UPDATE site_stats SET num_value=?,suffix=?,label=? WHERE id=?');
        $stmt->bind_param('dssi', $numValue,$suffix,$label,$id);
        $stmt->execute();
        logActivity($payload['id'], 'update', 'stats', $id);
        ok(null, 'Stat updated');
    }
}
