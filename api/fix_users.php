<?php

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

echo "Fixing users...\n";

$db = Database::getInstance();
$pdo = $db->getConnection();

// Delete existing users
$pdo->exec("DELETE FROM users");
echo "Deleted all users\n";

// Create admin
$adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
$pdo->exec("INSERT INTO users (name, email, password, role, admin_role, referral_code, status) VALUES ('Super Admin', 'admin@cryptomine.com', '$adminPassword', 'admin', 'super_admin', 'ADMIN001', 'active')");
echo "Admin created: admin@cryptomine.com / admin123\n";

// Create test user
$userPassword = password_hash('user123', PASSWORD_DEFAULT);
$pdo->exec("INSERT INTO users (name, email, password, role, balance, referral_code, status) VALUES ('John Doe', 'user@test.com', '$userPassword', 'user', 1000.00, 'USER0001', 'active')");
echo "User created: user@test.com / user123\n";

// Verify
$users = $db->select("SELECT id, name, email, role FROM users");
echo "\nUsers in database:\n";
foreach ($users as $u) {
    echo "- {$u['name']} ({$u['email']}) - {$u['role']}\n";
}
