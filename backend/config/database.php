<?php
// ── Auto-detect environment ──────────────────────────────────
$isProduction = ($_SERVER['HTTP_HOST'] ?? '') === 'shreenovatech.in';

define('DB_HOST', 'localhost');
define('DB_USER', $isProduction ? 'shreenovatech_db_user' : 'root');
define('DB_PASS', $isProduction ? 'YOUR_DB_PASSWORD'      : '');
define('DB_NAME', 'shreenovatech_db');
define('JWT_SECRET', 'SNT_JWT_SECRET_KEY_2024_SHREENOVATECH');
define('JWT_EXPIRY', 86400); // 24 hours
define('UPLOAD_PATH', __DIR__ . '/../uploads/');
define('BASE_URL', $isProduction
    ? 'https://shreenovatech.in/api'
    : 'http://localhost/shreenovatech/backend');

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
