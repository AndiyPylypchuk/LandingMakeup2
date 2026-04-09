<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://www.annapylypchuk.com');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

$slug = trim($_GET['slug'] ?? '');
if (!$slug || !preg_match('/^[a-z0-9\-]{1,80}$/', $slug)) { http_response_code(400); echo json_encode(['success'=>false,'message'=>'Invalid slug']); exit; }

$host = getenv('DB_HOST') ?: 'localhost';
$db   = getenv('DB_NAME') ?: 'your_db_name';
$user = getenv('DB_USER') ?: 'your_db_user';
$pass = getenv('DB_PASS') ?: 'your_db_pass';

try {
    $pdo = new PDO("mysql:host=$host;dbname=$db;charset=utf8mb4", $user, $pass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);
    $stmt = $pdo->prepare('SELECT slug, title, youtube_id, body_text, button_text, button_url, is_active FROM funnels WHERE slug = ? LIMIT 1');
    $stmt->execute([$slug]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);
    if (!$row || !$row['is_active']) { http_response_code(404); echo json_encode(['success'=>false,'message'=>'Not found']); exit; }
    $row['is_active'] = (bool)$row['is_active'];
    echo json_encode($row);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Database error']);
}
