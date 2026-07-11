<?php
class TestimonialsController {

    public function index(): void {
        $db   = getDB();
        $all  = isset($_GET['all']);
        $where = $all ? '' : 'WHERE is_active = 1';
        $rows = $db->query("SELECT * FROM testimonials $where ORDER BY sort_order ASC, id ASC")
                   ->fetch_all(MYSQLI_ASSOC);
        ok($rows);
    }

    public function store(): void {
        $payload = requireRole('super_admin', 'admin', 'editor');
        $b = body();
        $name   = clean($b['name']   ?? '');
        $role   = clean($b['role']   ?? '');
        $quote  = clean($b['quote']  ?? '');
        $rating = (int)($b['rating'] ?? 5);
        if (!$name || !$quote) err('Name and quote are required.');

        $initials = strtoupper(implode('', array_map(fn($w) => $w[0], explode(' ', $name))));
        $initials = substr($initials, 0, 2);
        $sort     = (int)($b['sort_order'] ?? 0);
        $active   = (int)($b['is_active']  ?? 1);

        $db   = getDB();
        $stmt = $db->prepare('INSERT INTO testimonials (name,role,initials,rating,quote,sort_order,is_active) VALUES (?,?,?,?,?,?,?)');
        $stmt->bind_param('sssisii', $name,$role,$initials,$rating,$quote,$sort,$active);
        if (!$stmt->execute()) err('Failed to create testimonial');

        logActivity($payload['id'], 'create', 'testimonials', $db->insert_id);
        ok(['id' => $db->insert_id], 'Testimonial created', 201);
    }

    public function update(int $id): void {
        $payload = requireRole('super_admin', 'admin', 'editor');
        $b = body();
        $name   = clean($b['name']   ?? '');
        $role   = clean($b['role']   ?? '');
        $quote  = clean($b['quote']  ?? '');
        $rating = (int)($b['rating'] ?? 5);
        $sort   = (int)($b['sort_order'] ?? 0);
        $active = (int)($b['is_active']  ?? 1);

        $db   = getDB();
        $stmt = $db->prepare('UPDATE testimonials SET name=?,role=?,rating=?,quote=?,sort_order=?,is_active=? WHERE id=?');
        $stmt->bind_param('ssissii', $name,$role,$rating,$quote,$sort,$active,$id);
        if (!$stmt->execute()) err('Failed to update testimonial');

        logActivity($payload['id'], 'update', 'testimonials', $id);
        ok(null, 'Testimonial updated');
    }

    public function destroy(int $id): void {
        $payload = requireRole('super_admin', 'admin');
        $db   = getDB();
        $stmt = $db->prepare('DELETE FROM testimonials WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        logActivity($payload['id'], 'delete', 'testimonials', $id);
        ok(null, 'Testimonial deleted');
    }
}
