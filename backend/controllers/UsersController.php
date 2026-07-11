<?php
class UsersController {

    public function index(): void {
        requireRole('super_admin', 'admin');
        $rows = getDB()->query('SELECT id,username,email,full_name,role,is_active,last_login,created_at FROM admin_users ORDER BY created_at DESC')->fetch_all(MYSQLI_ASSOC);
        ok($rows);
    }

    public function show(int $id): void {
        requireRole('super_admin', 'admin');
        $db   = getDB();
        $stmt = $db->prepare('SELECT id,username,email,full_name,role,is_active,last_login,created_at FROM admin_users WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if (!$row) err('User not found', 404);
        ok($row);
    }

    public function store(): void {
        $payload = requireRole('super_admin');
        $b = body();

        $username = clean($b['username'] ?? '');
        $email    = clean($b['email']    ?? '');
        $password = $b['password'] ?? '';
        $fullName = clean($b['full_name'] ?? '');
        $role     = clean($b['role'] ?? 'admin');

        if (!$username || !$email || !$password) err('Username, email and password are required.');
        if (!validateEmail($email)) err('Invalid email.');
        if (strlen($password) < 8) err('Password must be at least 8 characters.');
        if (!in_array($role, ['super_admin','admin','editor','support'])) err('Invalid role.');

        $hash = password_hash($password, PASSWORD_BCRYPT, ['cost' => 12]);
        $db   = getDB();
        $stmt = $db->prepare('INSERT INTO admin_users (username,email,password_hash,full_name,role) VALUES (?,?,?,?,?)');
        $stmt->bind_param('sssss', $username,$email,$hash,$fullName,$role);
        if (!$stmt->execute()) err('Username or email already exists.');

        logActivity($payload['id'], 'create_user', 'users', $db->insert_id);
        ok(['id' => $db->insert_id], 'User created', 201);
    }

    public function update(int $id): void {
        $payload = requireRole('super_admin', 'admin');
        $b = body();

        $fullName = clean($b['full_name'] ?? '');
        $role     = clean($b['role']     ?? 'admin');
        $isActive = (int)($b['is_active'] ?? 1);

        $db   = getDB();
        $stmt = $db->prepare('UPDATE admin_users SET full_name=?,role=?,is_active=? WHERE id=?');
        $stmt->bind_param('ssii', $fullName,$role,$isActive,$id);
        $stmt->execute();

        if (!empty($b['password']) && strlen($b['password']) >= 8) {
            $hash  = password_hash($b['password'], PASSWORD_BCRYPT, ['cost' => 12]);
            $stmt2 = $db->prepare('UPDATE admin_users SET password_hash=? WHERE id=?');
            $stmt2->bind_param('si', $hash, $id);
            $stmt2->execute();
        }

        logActivity($payload['id'], 'update_user', 'users', $id);
        ok(null, 'User updated');
    }

    public function destroy(int $id): void {
        $payload = requireRole('super_admin');
        if ($payload['id'] === $id) err('Cannot delete your own account.');
        $db   = getDB();
        $stmt = $db->prepare('DELETE FROM admin_users WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        logActivity($payload['id'], 'delete_user', 'users', $id);
        ok(null, 'User deleted');
    }
}
