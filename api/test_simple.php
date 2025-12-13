<?php

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

echo "Direct table creation test...\n";

$db = Database::getInstance();
$pdo = $db->getConnection();

// Simple test table
$sql = "CREATE TABLE IF NOT EXISTS test_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100)
)";

echo "Executing: $sql\n\n";

try {
    $result = $pdo->exec($sql);
    echo "Result: $result\n";
    echo "Table created successfully!\n";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
}

// Check if it was created
$tables = $db->select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
echo "\nTables now: " . count($tables) . "\n";
foreach ($tables as $table) {
    echo "- " . $table['table_name'] . "\n";
}
