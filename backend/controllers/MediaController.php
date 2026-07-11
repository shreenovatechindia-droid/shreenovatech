<?php
class MediaController {

    public function index(): void {
        verifyToken();
        $folder = clean($_GET['folder'] ?? '');
        $db     = getDB();
        $where  = $folder ? "WHERE folder = '$folder'" : '';
        $rows   = $db->query("SELECT * FROM media_files $where ORDER BY created_at DESC")->fetch_all(MYSQLI_ASSOC);
        ok($rows);
    }

    public function upload(): void {
        $payload = requireRole('super_admin', 'admin', 'editor');
        if (empty($_FILES['file'])) err('No file uploaded.');

        $folder  = clean($_POST['folder'] ?? 'general');
        $allowed = ['jpg','jpeg','png','gif','webp','pdf','svg'];
        $url     = uploadFile($_FILES['file'], $folder, $allowed);
        if (!$url) err('Invalid file type or size exceeds 10MB.');

        $filename = basename($url);
        $origName = clean($_FILES['file']['name']);
        $fileType = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
        $fileSize = $_FILES['file']['size'];
        $filePath = UPLOAD_PATH . $folder . '/' . $filename;

        $db   = getDB();
        $stmt = $db->prepare('INSERT INTO media_files (filename,original_name,file_path,file_url,file_type,file_size,folder,uploaded_by) VALUES (?,?,?,?,?,?,?,?)');
        $stmt->bind_param('sssssiis', $filename,$origName,$filePath,$url,$fileType,$fileSize,$folder,$payload['id']);
        $stmt->execute();

        logActivity($payload['id'], 'upload', 'media', $db->insert_id);
        ok(['id' => $db->insert_id, 'url' => $url, 'filename' => $filename], 'File uploaded', 201);
    }

    public function destroy(int $id): void {
        $payload = requireRole('super_admin', 'admin');
        $db   = getDB();
        $stmt = $db->prepare('SELECT file_path FROM media_files WHERE id = ?');
        $stmt->bind_param('i', $id);
        $stmt->execute();
        $row = $stmt->get_result()->fetch_assoc();
        if ($row && file_exists($row['file_path'])) @unlink($row['file_path']);

        $stmt2 = $db->prepare('DELETE FROM media_files WHERE id = ?');
        $stmt2->bind_param('i', $id);
        $stmt2->execute();
        logActivity($payload['id'], 'delete', 'media', $id);
        ok(null, 'File deleted');
    }
}
