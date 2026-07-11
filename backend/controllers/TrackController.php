<?php
class TrackController {
    public function track(): void {
        $b    = body();
        $page = clean($b['page'] ?? '/');
        $ref  = clean($b['referrer'] ?? '');
        $ua   = $_SERVER['HTTP_USER_AGENT'] ?? '';
        $ip   = $_SERVER['REMOTE_ADDR'] ?? '';
        $date = date('Y-m-d');

        $db   = getDB();
        $stmt = $db->prepare('INSERT INTO visitors (ip_address,page,user_agent,referrer,visit_date) VALUES (?,?,?,?,?)');
        $stmt->bind_param('sssss', $ip,$page,$ua,$ref,$date);
        $stmt->execute();
        ok(null, 'Tracked');
    }
}
