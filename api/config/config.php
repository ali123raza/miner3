<?php

// Load .env file
$envFile = __DIR__ . '/../.env';
if (file_exists($envFile)) {
    $lines = file($envFile, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        if (strpos($line, '#') === 0) continue;
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $_ENV[trim($key)] = trim($value);
        }
    }
}

// Database connection type
define('DB_CONNECTION', $_ENV['DB_CONNECTION'] ?? 'pgsql');

// PostgreSQL
define('PGSQL_HOST', $_ENV['PGSQL_HOST'] ?? 'localhost');
define('PGSQL_PORT', $_ENV['PGSQL_PORT'] ?? '5432');
define('PGSQL_DB', $_ENV['PGSQL_DB'] ?? 'postgres');
define('PGSQL_USER', $_ENV['PGSQL_USER'] ?? 'postgres');
define('PGSQL_PASS', $_ENV['PGSQL_PASS'] ?? '');

// MySQL
define('MYSQL_HOST', $_ENV['MYSQL_HOST'] ?? 'localhost');
define('MYSQL_PORT', $_ENV['MYSQL_PORT'] ?? '3306');
define('MYSQL_DB', $_ENV['MYSQL_DB'] ?? 'miner_app');
define('MYSQL_USER', $_ENV['MYSQL_USER'] ?? 'root');
define('MYSQL_PASS', $_ENV['MYSQL_PASS'] ?? '');

// JWT
define('JWT_SECRET', $_ENV['JWT_SECRET'] ?? 'default-secret');
define('JWT_EXPIRY', intval($_ENV['JWT_EXPIRY'] ?? 86400));

// App
define('APP_ENV', $_ENV['APP_ENV'] ?? 'development');
define('APP_URL', $_ENV['APP_URL'] ?? 'http://localhost:5173');

// Error reporting
if (APP_ENV === 'development') {
    ini_set('display_errors', 1);
    error_reporting(E_ALL);
} else {
    ini_set('display_errors', 0);
    error_reporting(0);
}
