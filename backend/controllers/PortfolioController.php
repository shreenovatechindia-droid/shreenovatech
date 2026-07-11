<?php
class PortfolioController {

    public function index(): void {
        $db       = getDB();
        $category = clean($_GET['category'] ?? '');
        $active   = isset($_GET['all']) ? '' : ' AND is_active = 1';
        $where    = $category ? " AND category = '$category'" : '';

        $rows = $db->query("SELECT * FROM portfolio WHERE 1=1 $active $where ORDER BY sort_order ASC, id ASC")
                   ->fetch_all(MYSQLI_ASSOC);

        foreach ($rows as &$r) {
            $r['features'] = json_decode($r['features'] ?? '[]');
            $r['tech']     = json_decode($r['tech']     ?? '[]');
        }
        ok($rows);
    }

    public function show(int $id): void {
        $db   = getDB();
        $stmt = $db->prepare('SELECT * FROM portfolio WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if (!$row) err('Project not found', 404);
        $row['features'] = json_decode($row['features'] ?? '[]');
        $row['tech']     = json_decode($row['tech']     ?? '[]');
        ok($row);
    }

    public function store(): void {
        $payload = requireRole('super_admin', 'admin', 'editor');
        $b = body();

        $title    = clean($b['title']    ?? '');
        $category = clean($b['category'] ?? '');
        if (!$title || !$category) err('Title and category are required.');

        $badge      = clean($b['badge']      ?? '');
        $industry   = clean($b['industry']   ?? '');
        $desc       = clean($b['description']?? '');
        $features   = json_encode($b['features'] ?? []);
        $tech       = json_encode($b['tech']     ?? []);
        $image_url  = clean($b['image_url']  ?? '');
        $live_url   = clean($b['live_url']   ?? '');
        $github_url = clean($b['github_url'] ?? '');
        $client     = clean($b['client_name']?? '');
        $comp_date  = clean($b['completion_date'] ?? '');
        $featured   = (int)($b['is_featured'] ?? 0);
        $sort       = (int)($b['sort_order']  ?? 0);
        $active     = (int)($b['is_active']   ?? 1);

        $db   = getDB();
        $stmt = $db->prepare('INSERT INTO portfolio (title,category,badge,industry,description,features,tech,image_url,live_url,github_url,client_name,completion_date,is_featured,sort_order,is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->bind_param('ssssssssssssiiii', $title,$category,$badge,$industry,$desc,$features,$tech,$image_url,$live_url,$github_url,$client,$comp_date,$featured,$sort,$active);

        // fix param count
        $stmt = $db->prepare('INSERT INTO portfolio (title,category,badge,industry,description,features,tech,image_url,live_url,github_url,client_name,completion_date,is_featured,sort_order,is_active) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->bind_param('sssssssssssssii', $title,$category,$badge,$industry,$desc,$features,$tech,$image_url,$live_url,$github_url,$client,$comp_date,$featured,$sort,$active);
        if (!$stmt->execute()) err('Failed to create project');

        logActivity($payload['id'], 'create', 'portfolio', $db->insert_id);
        ok(['id' => $db->insert_id], 'Project created', 201);
    }

    public function update(int $id): void {
        $payload = requireRole('super_admin', 'admin', 'editor');
        $b = body();

        $title    = clean($b['title']    ?? '');
        $category = clean($b['category'] ?? '');
        if (!$title || !$category) err('Title and category are required.');

        $badge      = clean($b['badge']      ?? '');
        $industry   = clean($b['industry']   ?? '');
        $desc       = clean($b['description']?? '');
        $features   = json_encode($b['features'] ?? []);
        $tech       = json_encode($b['tech']     ?? []);
        $image_url  = clean($b['image_url']  ?? '');
        $live_url   = clean($b['live_url']   ?? '');
        $github_url = clean($b['github_url'] ?? '');
        $client     = clean($b['client_name']?? '');
        $comp_date  = clean($b['completion_date'] ?? '');
        $featured   = (int)($b['is_featured'] ?? 0);
        $sort       = (int)($b['sort_order']  ?? 0);
        $active     = (int)($b['is_active']   ?? 1);

        $db   = getDB();
        $stmt = $db->prepare('UPDATE portfolio SET title=?,category=?,badge=?,industry=?,description=?,features=?,tech=?,image_url=?,live_url=?,github_url=?,client_name=?,completion_date=?,is_featured=?,sort_order=?,is_active=? WHERE id=?');
        $stmt->bind_param('sssssssssssssiii', $title,$category,$badge,$industry,$desc,$features,$tech,$image_url,$live_url,$github_url,$client,$comp_date,$featured,$sort,$active,$id);
        if (!$stmt->execute()) err('Failed to update project');

        logActivity($payload['id'], 'update', 'portfolio', $id);
        ok(null, 'Project updated');
    }

    public function destroy(int $id): void {
        $payload = requireRole('super_admin', 'admin');
        $db   = getDB();
        $stmt = $db->prepare('DELETE FROM portfolio WHERE id = ?');
        $stmt->bind_param('i', $id);
        if (!$stmt->execute()) err('Failed to delete project');
        logActivity($payload['id'], 'delete', 'portfolio', $id);
        ok(null, 'Project deleted');
    }
}
