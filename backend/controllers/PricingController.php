<?php
class PricingController {

    public function index(): void {
        $db   = getDB();
        $rows = $db->query('SELECT * FROM pricing_plans WHERE is_active = 1 ORDER BY sort_order ASC')
                   ->fetch_all(MYSQLI_ASSOC);
        foreach ($rows as &$r) {
            $r['features'] = json_decode($r['features'] ?? '[]');
        }
        ok($rows);
    }

    public function update(int $id): void {
        $payload = requireRole('super_admin', 'admin');
        $b = body();

        $name     = clean($b['name']     ?? '');
        $desc     = clean($b['description'] ?? '');
        $price    = clean($b['price']    ?? '');
        $priceNum = (int)($b['price_num'] ?? 0);
        $renewal  = clean($b['renewal']  ?? '');
        $featured = (int)($b['is_featured'] ?? 0);
        $features = json_encode($b['features'] ?? []);
        $sort     = (int)($b['sort_order'] ?? 0);
        $active   = (int)($b['is_active'] ?? 1);

        $db   = getDB();
        $stmt = $db->prepare('UPDATE pricing_plans SET name=?,description=?,price=?,price_num=?,renewal=?,is_featured=?,features=?,sort_order=?,is_active=? WHERE id=?');
        $stmt->bind_param('sssisiisii', $name,$desc,$price,$priceNum,$renewal,$featured,$features,$sort,$active,$id);
        if (!$stmt->execute()) err('Failed to update plan');

        logActivity($payload['id'], 'update', 'pricing', $id);
        ok(null, 'Plan updated');
    }
}
