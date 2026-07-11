<?php
require_once __DIR__ . '/../config/database.php';

class JWT {
    public static function encode(array $payload): string {
        $header  = base64_encode(json_encode(['typ' => 'JWT', 'alg' => 'HS256']));
        $payload['iat'] = time();
        $payload['exp'] = time() + JWT_EXPIRY;
        $body    = base64_encode(json_encode($payload));
        $sig     = base64_encode(hash_hmac('sha256', "$header.$body", JWT_SECRET, true));
        return "$header.$body.$sig";
    }

    public static function decode(string $token): ?array {
        $parts = explode('.', $token);
        if (count($parts) !== 3) return null;
        [$header, $body, $sig] = $parts;
        $expected = base64_encode(hash_hmac('sha256', "$header.$body", JWT_SECRET, true));
        if (!hash_equals($expected, $sig)) return null;
        $payload = json_decode(base64_decode($body), true);
        if (!$payload || $payload['exp'] < time()) return null;
        return $payload;
    }
}

function generateToken(array $user): string {
    return JWT::encode([
        'id'   => $user['id'],
        'role' => $user['role'],
        'email'=> $user['email'],
    ]);
}

function verifyToken(): array {
    $headers = getallheaders();
    $auth    = $headers['Authorization'] ?? $headers['authorization'] ?? '';
    if (!preg_match('/Bearer\s+(.+)/i', $auth, $m)) {
        http_response_code(401);
        die(json_encode(['success' => false, 'message' => 'No token provided']));
    }
    $payload = JWT::decode($m[1]);
    if (!$payload) {
        http_response_code(401);
        die(json_encode(['success' => false, 'message' => 'Invalid or expired token']));
    }
    return $payload;
}

function requireRole(string ...$roles): array {
    $payload = verifyToken();
    if (!in_array($payload['role'], $roles)) {
        http_response_code(403);
        die(json_encode(['success' => false, 'message' => 'Insufficient permissions']));
    }
    return $payload;
}
