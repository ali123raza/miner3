<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

echo "Resetting database...\n";

$db = Database::getInstance();
$pdo = $db->getConnection();

try {
    if (DB_CONNECTION === 'pgsql') {
        $pdo->exec("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
        echo "PostgreSQL schema reset successfully.\n";
    } else {
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 0");
        $tables = $pdo->query("SHOW TABLES")->fetchAll(PDO::FETCH_COLUMN);
        foreach ($tables as $table) {
            $pdo->exec("DROP TABLE IF EXISTS `$table`");
            echo "Dropped table: $table\n";
        }
        $pdo->exec("SET FOREIGN_KEY_CHECKS = 1");
        echo "MySQL tables reset successfully.\n";
    }
} catch (PDOException $e) {
    echo "Error resetting database: " . $e->getMessage() . "\n";
    exit(1);
}
