<?php
class HostingController {

    public function index(): void {
        $type = clean($_GET['type'] ?? '');
        $db   = getDB();
        $where = $type ? "WHERE type = '$type' AND is_active = 1" : 'WHERE is_active = 1';
        $rows = $db->query("SELECT * FROM hosting_plans $where ORDER BY sort_order ASC")->fetch_all(MYSQLI_ASSOC);
        foreach ($rows as &$r) {
            $r['features'] = json_decode($r['features'] ?? '[]');
        }
        ok($rows);
    }

    public function store(): void {
        $payload = requireRole('super_admin', 'admin');
        $b = body();

        $type     = clean($b['type']     ?? 'shared');
        $name     = clean($b['name']     ?? '');
        $price    = clean($b['price']    ?? '');
        $priceNum = (float)($b['price_num'] ?? 0);
        if (!$name || !$price) err('Name and price are required.');

        $per       = clean($b['per']       ?? '/month');
        $desc      = clean($b['description'] ?? '');
        $storage   = clean($b['storage']   ?? '');
        $bandwidth = clean($b['bandwidth'] ?? '');
        $websites  = clean($b['websites']  ?? '');
        $emails    = clean($b['emails']    ?? '');
        $features  = json_encode($b['features'] ?? []);
        $featured  = (int)($b['is_featured'] ?? 0);
        $sort      = (int)($b['sort_order']  ?? 0);

        $db   = getDB();
        $stmt = $db->prepare('INSERT INTO hosting_plans (type,name,price,price_num,per,description,storage,bandwidth,websites,emails,features,is_featured,sort_order) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->bind_param('sssdsssssssii', $type,$name,$price,$priceNum,$per,$desc,$storage,$bandwidth,$websites,$emails,$features,$featured,$sort);
        if (!$stmt->execute()) err('Failed to create hosting plan');

        logActivity($payload['id'], 'create', 'hosting', $db->insert_id);
        ok(['id' => $db->insert_id], 'Hosting plan created', 201);
    }

    public function update(int $id): void {
        $payload = requireRole('super_admin', 'admin');
        $b = body();

        $name      = clean($b['name']     ?? '');
        $price     = clean($b['price']    ?? '');
        $priceNum  = (float)($b['price_num'] ?? 0);
        $per       = clean($b['per']       ?? '/month');
        $desc      = clean($b['description'] ?? '');
        $storage   = clean($b['storage']   ?? '');
        $bandwidth = clean($b['bandwidth'] ?? '');
        $websites  = clean($b['websites']  ?? '');
        $emails    = clean($b['emails']    ?? '');
        $features  = json_encode($b['features'] ?? []);
        $featured  = (int)($b['is_featured'] ?? 0);
        $sort      = (int)($b['sort_order']  ?? 0);
        $active    = (int)($b['is_active']   ?? 1);

        $db   = getDB();
        $stmt = $db->prepare('UPDATE hosting_plans SET name=?,price=?,price_num=?,per=?,description=?,storage=?,bandwidth=?,websites=?,emails=?,features=?,is_featured=?,sort_order=?,is_active=? WHERE id=?');
        $stmt->bind_param('ssdsssssssiiii', $name,$price,$priceNum,$per,$desc,$storage,$bandwidth,$websites,$emails,$features,$featured,$sort,$active,$id);
        if (!$stmt->execute()) err('Failed to update hosting plan');

        logActivity($payload['id'], 'update', 'hosting', $id);
        ok(null, 'Hosting plan updated');
    }

    public function destroy(int $id): void {
        $payload = requireRole('super_admin', 'admin');
        $db   = getDB();
        $stmt = $db->prepare('DELETE FROM hosting_plans WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        logActivity($payload['id'], 'delete', 'hosting', $id);
        ok(null, 'Hosting plan deleted');
    }
}
