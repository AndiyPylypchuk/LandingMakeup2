<?php
/**
 * Contact form API endpoint.
 * Endpoint: POST /api/contact.php
 * Accepts JSON or form-encoded payload: name, email, message, website (honeypot).
 * Sends email via PHP mail().
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: https://www.annapylypchuk.com');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['success'=>false,'message'=>'Method Not Allowed']); exit; }

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
if (!$data) { parse_str($raw, $data); }

$name    = trim($data['name'] ?? '');
$email   = trim($data['email'] ?? '');
$message = trim($data['message'] ?? '');
$website = trim($data['website'] ?? ''); // honeypot

if ($website !== '') { echo json_encode(['success'=>true,'message'=>'OK']); exit; }
if (!$name || !$email || !$message) { http_response_code(422); echo json_encode(['success'=>false,'message'=>'Заповніть всі поля.']); exit; }
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) { http_response_code(422); echo json_encode(['success'=>false,'message'=>'Невірний email.']); exit; }
if (strlen($message) < 10) { http_response_code(422); echo json_encode(['success'=>false,'message'=>'Повідомлення занадто коротке.']); exit; }

$to      = 'pylyp69de@gmail.com';
$subject = '=?UTF-8?B?' . base64_encode('Нове повідомлення від ' . $name) . '?=';
$body    = "Ім'я: $name\nEmail: $email\n\nПовідомлення:\n$message";
$headers = "From: noreply@annapylypchuk.com\r\nReply-To: $email\r\nContent-Type: text/plain; charset=UTF-8";

if (mail($to, $subject, $body, $headers)) {
    echo json_encode(['success'=>true,'message'=>'Повідомлення надіслано!']);
} else {
    http_response_code(500);
    echo json_encode(['success'=>false,'message'=>'Помилка відправки. Спробуйте пізніше.']);
}
