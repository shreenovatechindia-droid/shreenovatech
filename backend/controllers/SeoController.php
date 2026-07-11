<?php
class SeoController {

    public function index(): void {
        $rows = getDB()->query('SELECT * FROM seo_pages ORDER BY page_slug ASC')->fetch_all(MYSQLI_ASSOC);
        ok($rows);
    }

    public function show(string $slug): void {
        $db   = getDB();
        $s    = clean($slug);
        $stmt = $db->prepare('SELECT * FROM seo_pages WHERE page_slug = ?');
        $stmt->bind_param('s', $s);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if (!$row) err('SEO page not found', 404);
        ok($row);
    }

    public function update(string $slug): void {
        $payload = requireRole('super_admin', 'admin');
        $b = body();
        $s = clean($slug);

        $metaTitle = clean($b['meta_title'] ?? '');
        $metaDesc  = clean($b['meta_desc']  ?? '');
        $metaKw    = clean($b['meta_keywords'] ?? '');
        $ogTitle   = clean($b['og_title']   ?? '');
        $ogDesc    = clean($b['og_desc']    ?? '');
        $ogImage   = clean($b['og_image']   ?? '');
        $robots    = clean($b['robots']     ?? 'index,follow');

        $db   = getDB();
        $stmt = $db->prepare('INSERT INTO seo_pages (page_slug,meta_title,meta_desc,meta_keywords,og_title,og_desc,og_image,robots) VALUES (?,?,?,?,?,?,?,?) ON DUPLICATE KEY UPDATE meta_title=VALUES(meta_title),meta_desc=VALUES(meta_desc),meta_keywords=VALUES(meta_keywords),og_title=VALUES(og_title),og_desc=VALUES(og_desc),og_image=VALUES(og_image),robots=VALUES(robots)');
        $stmt->bind_param('ssssssss', $s,$metaTitle,$metaDesc,$metaKw,$ogTitle,$ogDesc,$ogImage,$robots);
        $stmt->execute();

        logActivity($payload['id'], 'update', 'seo', null, $s);
        ok(null, 'SEO updated');
    }
}
