<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

echo "Running migrations...\n";

$db = Database::getInstance();
$pdo = $db->getConnection();

// Choose the right migration file based on DB type
$migrationFile = DB_CONNECTION === 'pgsql' 
    ? __DIR__ . '/001_schema_pgsql.sql' 
    : __DIR__ . '/001_schema_mysql.sql';

if (!file_exists($migrationFile)) {
    die("Migration file not found: $migrationFile\n");
}

$sql = file_get_contents($migrationFile);

try {
    // Split by semicolon and execute each statement
    $statements = array_filter(array_map('trim', explode(';', $sql)));
    
    foreach ($statements as $statement) {
        if (!empty($statement) && !preg_match('/^--/', $statement)) {
            $pdo->exec($statement);
        }
    }
    
    echo "Migration completed successfully!\n";
} catch (PDOException $e) {
    echo "Migration error: " . $e->getMessage() . "\n";
    exit(1);
}
