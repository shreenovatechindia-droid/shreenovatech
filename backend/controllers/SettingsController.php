<?php
class SettingsController {
    public function index(): void {
        $group = clean($_GET['group'] ?? '');
        $db    = getDB();
        $where = $group ? "WHERE setting_group = '$group'" : '';
        $rows  = $db->query("SELECT setting_key, setting_value, setting_group FROM site_settings $where ORDER BY setting_group, id")
                    ->fetch_all(MYSQLI_ASSOC);
        // Return as key=>value map
        $map = [];
        foreach ($rows as $r) $map[$r['setting_key']] = $r['setting_value'];
        ok($map);
    }
    public function update(): void {
        $payload = requireRole('super_admin', 'admin');
        $b  = body();
        $db = getDB();
        $stmt = $db->prepare('UPDATE site_settings SET setting_value = ? WHERE setting_key = ?');
        foreach ($b as $key => $value) {
            $k = clean($key);
            $v = is_array($value) ? json_encode($value) : clean((string)$value);
            $stmt->bind_param('ss', $v, $k);
            $stmt->execute();
        }
        logActivity($payload['id'], 'update', 'settings');
        ok(null, 'Settings saved');
    }
}
