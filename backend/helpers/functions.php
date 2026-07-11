<?php
// ── Response helpers ──────────────────────────────────────
function ok(mixed $data = null, string $message = 'Success', int $code = 200): void {
    http_response_code($code);
    echo json_encode(['success' => true, 'message' => $message, 'data' => $data]);
    exit;
}

function err(string $message, int $code = 400, mixed $errors = null): void {
    http_response_code($code);
    echo json_encode(['success' => false, 'message' => $message, 'errors' => $errors]);
    exit;
}

// ── Input sanitizer ───────────────────────────────────────
function clean(string $val): string {
    return htmlspecialchars(strip_tags(trim($val)), ENT_QUOTES, 'UTF-8');
}

function body(): array {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?? [];
}

// ── Validation ────────────────────────────────────────────
function validateEmail(string $email): bool {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validateMobile(string $mobile): bool {
    return preg_match('/^[6-9]\d{9}$/', $mobile);
}

// ── Reference ID generator ────────────────────────────────
function genRef(string $prefix = 'SNT'): string {
    return $prefix . '-' . strtoupper(base_convert(time(), 10, 36)) . '-' . strtoupper(substr(uniqid(), -4));
}

// ── File upload handler ───────────────────────────────────
function uploadFile(array $file, string $folder, array $allowed = ['jpg','jpeg','png','pdf','docx']): string|false {
    if ($file['error'] !== UPLOAD_ERR_OK) return false;
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($ext, $allowed)) return false;
    if ($file['size'] > 10 * 1024 * 1024) return false; // 10MB max

    $dir = UPLOAD_PATH . $folder . '/';
    if (!is_dir($dir)) mkdir($dir, 0755, true);

    $filename = uniqid() . '_' . time() . '.' . $ext;
    $dest     = $dir . $filename;
    if (!move_uploaded_file($file['tmp_name'], $dest)) return false;
    return BASE_URL . '/uploads/' . $folder . '/' . $filename;
}

// ── Log activity ──────────────────────────────────────────
function logActivity(int $adminId, string $action, string $module, ?int $recordId = null, ?string $details = null): void {
    $db = getDB();
    $ip = $_SERVER['REMOTE_ADDR'] ?? '';
    $stmt = $db->prepare('INSERT INTO activity_log (admin_id, action, module, record_id, details, ip_address) VALUES (?,?,?,?,?,?)');
    $stmt->bind_param('ississ', $adminId, $action, $module, $recordId, $details, $ip);
    $stmt->execute();
}

// ── Pagination helper ─────────────────────────────────────
function paginate(int $total, int $page, int $perPage): array {
    return [
        'total'       => $total,
        'per_page'    => $perPage,
        'current_page'=> $page,
        'last_page'   => (int)ceil($total / $perPage),
        'from'        => ($page - 1) * $perPage + 1,
        'to'          => min($page * $perPage, $total),
    ];
}

// ── Simple rate limiter (file-based) ─────────────────────
function rateLimit(string $key, int $max = 10, int $window = 60): void {
    $file = sys_get_temp_dir() . '/snt_rl_' . md5($key) . '.json';
    $now  = time();
    $data = file_exists($file) ? json_decode(file_get_contents($file), true) : ['count' => 0, 'start' => $now];
    if ($now - $data['start'] > $window) $data = ['count' => 0, 'start' => $now];
    $data['count']++;
    file_put_contents($file, json_encode($data));
    if ($data['count'] > $max) err('Too many requests. Please try again later.', 429);
}
