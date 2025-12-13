<?php

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

echo "Running direct migration test...\n";

$db = Database::getInstance();
$pdo = $db->getConnection();

$migrationFile = __DIR__ . '/migrations/001_schema_pgsql.sql';
echo "Migration file: $migrationFile\n";

if (!file_exists($migrationFile)) {
    die("Migration file not found!\n");
}

$sql = file_get_contents($migrationFile);
echo "SQL length: " . strlen($sql) . " bytes\n\n";

// Split by semicolon and execute each statement
$statements = array_filter(array_map('trim', explode(';', $sql)));
echo "Found " . count($statements) . " statements\n\n";

$count = 0;
foreach ($statements as $statement) {
    if (!empty($statement) && !preg_match('/^--/', trim($statement))) {
        $count++;
        // Get first 50 chars
        $preview = substr(trim($statement), 0, 60);
        echo "[$count] Executing: $preview...\n";
        
        try {
            $pdo->exec($statement);
            echo "    ✓ Success\n";
        } catch (PDOException $e) {
            echo "    ✗ Error: " . $e->getMessage() . "\n";
        }
    }
}

echo "\nDone! Checking tables...\n";
$tables = $db->select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
echo "Tables created: " . count($tables) . "\n";
foreach ($tables as $table) {
    echo "- " . $table['table_name'] . "\n";
}
