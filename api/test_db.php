<?php

require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';

echo "Testing database connection...\n";
echo "DB_CONNECTION: " . DB_CONNECTION . "\n";
echo "PGSQL_HOST: " . PGSQL_HOST . "\n";
echo "PGSQL_DB: " . PGSQL_DB . "\n";
echo "PGSQL_USER: " . PGSQL_USER . "\n";

try {
    $db = Database::getInstance();
    echo "\nConnection successful!\n";
    
    // Try to list tables
    $tables = $db->select("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
    
    echo "\nTables in public schema:\n";
    if (empty($tables)) {
        echo "No tables found!\n";
    } else {
        foreach ($tables as $table) {
            echo "- " . $table['table_name'] . "\n";
        }
    }
    
} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
