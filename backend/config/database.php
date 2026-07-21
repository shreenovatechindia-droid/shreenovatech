<?php
// ── Environment Detection ────────────────────────────────────
$host = $_SERVER['HTTP_HOST'] ?? 'localhost';

$isLocal      = in_array($host, ['localhost', '127.0.0.1']);
$isInfinity   = str_contains($host, '.rf.gd') || str_contains($host, '.infinityfreeapp.com');
$isProduction = !$isLocal && !$isInfinity;

if ($isLocal) {
    // ── LOCAL (XAMPP) ────────────────────────────────────────
    define('DB_HOST', 'localhost');
    define('DB_USER', 'root');
    define('DB_PASS', '');
    define('DB_NAME', 'shreenovatech_db');
    define('BASE_URL', 'http://localhost/shreenovatech/backend');

} elseif ($isInfinity) {
    // ── INFINITYFREE FREE HOSTING ────────────────────────────
    define('DB_HOST', 'sql307.infinityfree.com');
    define('DB_USER', 'if0_42430252');
    define('DB_PASS', 'YOUR_VPANEL_PASSWORD');   // <-- apna vPanel password yahan likho
    define('DB_NAME', 'if0_42430252_shreenovatech');
    define('BASE_URL', 'https://' . $host);

} else {
    // ── PRODUCTION (Custom Domain) ───────────────────────────
    define('DB_HOST', 'localhost');
    define('DB_USER', 'shreenovatech_db_user');
    define('DB_PASS', 'YOUR_DB_PASSWORD');
    define('DB_NAME', 'shreenovatech_db');
    define('BASE_URL', 'https://shreenovatech.in');
}

define('JWT_SECRET', 'SNT_JWT_SECRET_KEY_2024_SHREENOVATECH');
define('JWT_EXPIRY', 86400);
define('UPLOAD_PATH', __DIR__ . '/../uploads/');

function getDB() {
    static $conn = null;
    if ($conn === null) {
        $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
        if ($conn->connect_error) {
            http_response_code(500);
            die(json_encode(['success' => false, 'message' => 'Database connection failed']));
        }
        $conn->set_charset('utf8mb4');
    }
    return $conn;
}
