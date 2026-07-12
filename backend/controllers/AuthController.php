<?php
class AuthController {

    public function login(): void {
        rateLimit('login_' . ($_SERVER['REMOTE_ADDR'] ?? ''), 10, 60);
        $b = body();
        $email    = clean($b['email']    ?? '');
        $password = $b['password'] ?? '';
        $remember = (bool)($b['remember'] ?? false);

        if (!$email || !$password) err('Email and password are required.');
        if (!validateEmail($email))  err('Invalid email format.');

        $db   = getDB();
        $stmt = $db->prepare('SELECT * FROM admin_users WHERE email = ? AND is_active = 1 LIMIT 1');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();

        if (!$user || !password_verify($password, $user['password_hash'])) {
            err('Invalid email or password.', 401);
        }

        $token = generateToken($user);

        $stmt2 = $db->prepare('UPDATE admin_users SET last_login = NOW() WHERE id = ?');
        $stmt2->bind_param('i', $user['id']);
        $stmt2->execute();

        if ($remember) {
            $remToken = bin2hex(random_bytes(32));
            $stmt3 = $db->prepare('UPDATE admin_users SET remember_token = ? WHERE id = ?');
            $stmt3->bind_param('si', $remToken, $user['id']);
            $stmt3->execute();
        }

        logActivity($user['id'], 'login', 'auth');

        ok([
            'token' => $token,
            'user'  => [
                'id'        => $user['id'],
                'username'  => $user['username'],
                'email'     => $user['email'],
                'full_name' => $user['full_name'],
                'role'      => $user['role'],
            ],
        ], 'Login successful');
    }

    public function logout(): void {
        $payload = verifyToken();
        logActivity($payload['id'], 'logout', 'auth');
        ok(null, 'Logged out successfully');
    }

    public function me(): void {
        $payload = verifyToken();
        $db   = getDB();
        $stmt = $db->prepare('SELECT id, username, email, full_name, role, last_login FROM admin_users WHERE id = ?');
        $stmt->bind_param('i', $payload['id']);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();
        if (!$user) err('User not found', 404);
        ok($user);
    }

    public function forgotPassword(): void {
        $b     = body();
        $email = clean($b['email'] ?? '');
        if (!validateEmail($email)) err('Invalid email.');

        $db   = getDB();
        $stmt = $db->prepare('SELECT id FROM admin_users WHERE email = ? AND is_active = 1');
        $stmt->bind_param('s', $email);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();

        // Always return success to prevent email enumeration
        if ($user) {
            $token   = bin2hex(random_bytes(32));
            $expires = date('Y-m-d H:i:s', time() + 3600);
            $stmt2   = $db->prepare('UPDATE admin_users SET reset_token = ?, reset_expires = ? WHERE id = ?');
            $stmt2->bind_param('ssi', $token, $expires, $user['id']);
            $stmt2->execute();
            // In production: send email with reset link
        }
        ok(null, 'If that email exists, a reset link has been sent.');
    }

    public function resetPassword(): void {
        $b        = body();
        $token    = clean($b['token']    ?? '');
        $password = $b['password'] ?? '';

        if (!$token || strlen($password) < 8) err('Token and password (min 8 chars) required.');

        $db   = getDB();
        $stmt = $db->prepare('SELECT id FROM admin_users WHERE reset_token = ? AND reset_expires > NOW()');
        $stmt->bind_param('s', $token);
        $stmt->execute();
        $user = $stmt->get_result()->fetch_assoc();
        if (!$user) err('Invalid or expired reset token.', 400);

        $hash  = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        $stmt2 = $db->prepare('UPDATE admin_users SET password_hash = ?, reset_token = NULL, reset_expires = NULL WHERE id = ?');
        $stmt2->bind_param('si', $hash, $user['id']);
        $stmt2->execute();

        ok(null, 'Password reset successfully.');
    }
}
