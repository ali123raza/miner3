<?php
require_once __DIR__ . '/api/config/database.php';

$db = Database::getInstance();

try {
    echo "Attempting to add last_mined_at column...\n";
    $db->query("ALTER TABLE users ADD COLUMN last_mined_at TIMESTAMP NULL DEFAULT NULL");
    echo "Column added successfully (or query ran).\n";
} catch (Exception $e) {
    echo "Error adding column: " . $e->getMessage() . "\n";
}

try {
    // Check if it exists now
    $user = $db->selectOne("SELECT last_mined_at FROM users LIMIT 1");
    echo "Column access test: Success.\n";
} catch (Exception $e) {
    echo "Column access test: Failed.\n";
}
