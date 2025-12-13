<?php

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

echo "Running full PostgreSQL migration...\n\n";

$db = Database::getInstance();
$pdo = $db->getConnection();

$migrationFile = __DIR__ . '/migrations/001_schema_pgsql.sql';
$sql = file_get_contents($migrationFile);

// Remove comments
$sql = preg_replace('/--.*$/m', '', $sql);

// Split by semicolon
$statements = array_filter(array_map('trim', explode(';', $sql)));

echo "Executing " . count($statements) . " statements...\n\n";

foreach ($statements as $i => $statement) {
    if (empty(trim($statement))) continue;
    
    try {
        $pdo->exec($statement);
        // Get first line for display
        $firstLine = strtok(trim($statement), "\n");
        echo "[" . ($i+1) . "] ✓ " . substr($firstLine, 0, 50) . "...\n";
    } catch (PDOException $e) {
        echo "[" . ($i+1) . "] ✗ Error: " . $e->getMessage() . "\n";
    }
}

echo "\n\nChecking tables...\n";
$tables = $db->select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' ORDER BY table_name");
echo "Tables created: " . count($tables) . "\n";
foreach ($tables as $table) {
    echo "- " . $table['table_name'] . "\n";
}
