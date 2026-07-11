<?php
class BlogController {

    public function index(): void {
        $db     = getDB();
        $status = clean($_GET['status'] ?? 'published');
        $catId  = (int)($_GET['category'] ?? 0);
        $page   = max(1, (int)($_GET['page']  ?? 1));
        $limit  = min(50,  (int)($_GET['limit'] ?? 10));
        $offset = ($page - 1) * $limit;

        $where = [];
        if ($status && $status !== 'all') $where[] = "bp.status = '$status'";
        if ($catId) $where[] = "bp.category_id = $catId";
        $whereSQL = $where ? 'WHERE ' . implode(' AND ', $where) : '';

        $total = (int)$db->query("SELECT COUNT(*) FROM blog_posts bp $whereSQL")->fetch_row()[0];
        $rows  = $db->query("
            SELECT bp.*, bc.name as category_name, au.full_name as author_name
            FROM blog_posts bp
            LEFT JOIN blog_categories bc ON bp.category_id = bc.id
            LEFT JOIN admin_users au ON bp.author_id = au.id
            $whereSQL ORDER BY bp.created_at DESC LIMIT $limit OFFSET $offset
        ")->fetch_all(MYSQLI_ASSOC);

        foreach ($rows as &$r) {
            $r['tags'] = json_decode($r['tags'] ?? '[]');
        }
        ok(['posts' => $rows, 'pagination' => paginate($total, $page, $limit)]);
    }

    public function show(int $id): void {
        $db   = getDB();
        $stmt = $db->prepare('SELECT bp.*, bc.name as category_name FROM blog_posts bp LEFT JOIN blog_categories bc ON bp.category_id = bc.id WHERE bp.id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if (!$row) err('Post not found', 404);
        $row['tags'] = json_decode($row['tags'] ?? '[]');
        // Increment views
        $db->query("UPDATE blog_posts SET views = views + 1 WHERE id = $id");
        ok($row);
    }

    public function store(): void {
        $payload = requireRole('super_admin', 'admin', 'editor');
        $b = body();

        $title   = clean($b['title']   ?? '');
        $content = $b['content'] ?? '';
        if (!$title) err('Title is required.');

        $slug     = strtolower(preg_replace('/[^a-z0-9]+/', '-', $title)) . '-' . time();
        $catId    = (int)($b['category_id'] ?? 0) ?: null;
        $excerpt  = clean($b['excerpt']  ?? '');
        $imageUrl = clean($b['image_url'] ?? '');
        $tags     = json_encode($b['tags'] ?? []);
        $metaT    = clean($b['meta_title'] ?? $title);
        $metaD    = clean($b['meta_desc']  ?? '');
        $metaK    = clean($b['meta_keywords'] ?? '');
        $status   = in_array($b['status'] ?? '', ['draft','published','archived']) ? $b['status'] : 'draft';
        $pubAt    = $status === 'published' ? date('Y-m-d H:i:s') : null;

        $db   = getDB();
        $stmt = $db->prepare('INSERT INTO blog_posts (category_id,title,slug,excerpt,content,image_url,tags,meta_title,meta_desc,meta_keywords,author_id,status,published_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)');
        $stmt->bind_param('isssssssssiss', $catId,$title,$slug,$excerpt,$content,$imageUrl,$tags,$metaT,$metaD,$metaK,$payload['id'],$status,$pubAt);
        if (!$stmt->execute()) err('Failed to create post');

        logActivity($payload['id'], 'create', 'blog', $db->insert_id);
        ok(['id' => $db->insert_id, 'slug' => $slug], 'Post created', 201);
    }

    public function update(int $id): void {
        $payload = requireRole('super_admin', 'admin', 'editor');
        $b = body();

        $title   = clean($b['title']   ?? '');
        $content = $b['content'] ?? '';
        if (!$title) err('Title is required.');

        $catId    = (int)($b['category_id'] ?? 0) ?: null;
        $excerpt  = clean($b['excerpt']  ?? '');
        $imageUrl = clean($b['image_url'] ?? '');
        $tags     = json_encode($b['tags'] ?? []);
        $metaT    = clean($b['meta_title'] ?? $title);
        $metaD    = clean($b['meta_desc']  ?? '');
        $metaK    = clean($b['meta_keywords'] ?? '');
        $status   = in_array($b['status'] ?? '', ['draft','published','archived']) ? $b['status'] : 'draft';

        $db   = getDB();
        $stmt = $db->prepare('UPDATE blog_posts SET category_id=?,title=?,excerpt=?,content=?,image_url=?,tags=?,meta_title=?,meta_desc=?,meta_keywords=?,status=? WHERE id=?');
        $stmt->bind_param('issssssssssi', $catId,$title,$excerpt,$content,$imageUrl,$tags,$metaT,$metaD,$metaK,$status,$id);
        if (!$stmt->execute()) err('Failed to update post');

        logActivity($payload['id'], 'update', 'blog', $id);
        ok(null, 'Post updated');
    }

    public function destroy(int $id): void {
        $payload = requireRole('super_admin', 'admin');
        $db   = getDB();
        $stmt = $db->prepare('DELETE FROM blog_posts WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        logActivity($payload['id'], 'delete', 'blog', $id);
        ok(null, 'Post deleted');
    }
}
