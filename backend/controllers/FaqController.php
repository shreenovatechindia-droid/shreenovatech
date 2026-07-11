<?php
class FaqController {

    public function index(): void {
        $db       = getDB();
        $category = clean($_GET['category'] ?? '');
        $where    = $category ? "WHERE category = '$category' AND is_active = 1" : 'WHERE is_active = 1';
        $rows     = $db->query("SELECT * FROM faqs $where ORDER BY sort_order ASC")
                       ->fetch_all(MYSQLI_ASSOC);
        ok($rows);
    }

    public function store(): void {
        $payload  = requireRole('super_admin', 'admin', 'editor');
        $b        = body();
        $question = clean($b['question'] ?? '');
        $answer   = clean($b['answer']   ?? '');
        $category = clean($b['category'] ?? 'general');
        if (!$question || !$answer) err('Question and answer are required.');

        $sort   = (int)($b['sort_order'] ?? 0);
        $active = (int)($b['is_active']  ?? 1);

        $db   = getDB();
        $stmt = $db->prepare('INSERT INTO faqs (category,question,answer,sort_order,is_active) VALUES (?,?,?,?,?)');
        $stmt->bind_param('sssii', $category,$question,$answer,$sort,$active);
        if (!$stmt->execute()) err('Failed to create FAQ');

        logActivity($payload['id'], 'create', 'faq', $db->insert_id);
        ok(['id' => $db->insert_id], 'FAQ created', 201);
    }

    public function update(int $id): void {
        $payload  = requireRole('super_admin', 'admin', 'editor');
        $b        = body();
        $question = clean($b['question'] ?? '');
        $answer   = clean($b['answer']   ?? '');
        $category = clean($b['category'] ?? 'general');
        $sort     = (int)($b['sort_order'] ?? 0);
        $active   = (int)($b['is_active']  ?? 1);

        $db   = getDB();
        $stmt = $db->prepare('UPDATE faqs SET category=?,question=?,answer=?,sort_order=?,is_active=? WHERE id=?');
        $stmt->bind_param('sssiii', $category,$question,$answer,$sort,$active,$id);
        if (!$stmt->execute()) err('Failed to update FAQ');

        logActivity($payload['id'], 'update', 'faq', $id);
        ok(null, 'FAQ updated');
    }

    public function destroy(int $id): void {
        $payload = requireRole('super_admin', 'admin');
        $db   = getDB();
        $stmt = $db->prepare('DELETE FROM faqs WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        logActivity($payload['id'], 'delete', 'faq', $id);
        ok(null, 'FAQ deleted');
    }
}
