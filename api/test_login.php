<?php

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

echo "Testing login...\n\n";

$db = Database::getInstance();

// Get user
$email = 'user@test.com';
$password = 'user123';

$user = $db->selectOne("SELECT * FROM users WHERE email = ?", [$email]);

if (!$user) {
    echo "User not found!\n";
    exit(1);
}

echo "User found:\n";
echo "- ID: {$user['id']}\n";
echo "- Name: {$user['name']}\n";
echo "- Email: {$user['email']}\n";
echo "- Role: {$user['role']}\n";
echo "- Password Hash: " . substr($user['password'], 0, 20) . "...\n\n";

// Test password
echo "Testing password '$password'...\n";
if (password_verify($password, $user['password'])) {
    echo "✓ Password CORRECT!\n";
} else {
    echo "✗ Password INCORRECT!\n";
    echo "\nTrying to fix...\n";
    
    // Update with new password
    $newHash = password_hash($password, PASSWORD_DEFAULT);
    $db->getConnection()->exec("UPDATE users SET password = '$newHash' WHERE email = '$email'");
    echo "Password updated!\n";
}
