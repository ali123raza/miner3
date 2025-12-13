<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';

echo "Seeding database...\n";

$db = Database::getInstance();
$pdo = $db->getConnection();

try {
    // Create admin user
    $existing = $db->selectOne("SELECT id FROM users WHERE email = ?", ['admin@cryptomine.com']);
    
    if (!$existing) {
        $adminPassword = password_hash('admin123', PASSWORD_DEFAULT);
        $pdo->exec("INSERT INTO users (name, email, password, role, admin_role, referral_code, status) VALUES ('Super Admin', 'admin@cryptomine.com', '$adminPassword', 'admin', 'super_admin', 'ADMIN001', 'active')");
        echo "Admin user created (admin@cryptomine.com / admin123)\n";
    } else {
        echo "Admin user already exists\n";
    }

    // Create test user
    $existingUser = $db->selectOne("SELECT id FROM users WHERE email = ?", ['user@test.com']);
    
    if (!$existingUser) {
        $userPassword = password_hash('user123', PASSWORD_DEFAULT);
        $pdo->exec("INSERT INTO users (name, email, password, role, balance, referral_code, status) VALUES ('John Doe', 'user@test.com', '$userPassword', 'user', 1000.00, 'USER0001', 'active')");
        echo "Test user created (user@test.com / user123)\n";
    } else {
        echo "Test user already exists\n";
    }

    // Create mining rigs
    $existingRigs = $db->selectOne("SELECT COUNT(*) as count FROM rigs");
    if ($existingRigs['count'] == 0) {
        $pdo->exec("INSERT INTO rigs (name, price, hash_rate, hash_unit, daily_earning, power_consumption, duration, duration_unit, is_free, is_active, icon, color, max_purchase) VALUES 
            ('Free Miner', 0, 10, 'MH/s', 0.50, 50, 30, 'days', true, true, '🆓', 'green', 1),
            ('Basic Rig', 100, 50, 'MH/s', 2.50, 100, 30, 'days', false, true, '⚡', 'cyan', 5),
            ('Pro Miner', 500, 150, 'MH/s', 8.00, 200, 60, 'days', false, true, '🔷', 'purple', 3),
            ('Elite Machine', 1000, 300, 'MH/s', 18.00, 350, 90, 'days', false, true, '💎', 'pink', 2),
            ('Ultimate Rig', 2500, 750, 'MH/s', 50.00, 600, 120, 'days', false, true, '🚀', 'yellow', 1)
        ");
        echo "Mining rigs created\n";
    } else {
        echo "Mining rigs already exist\n";
    }

    // Create payment methods
    $existingMethods = $db->selectOne("SELECT COUNT(*) as count FROM payment_methods");
    if ($existingMethods['count'] == 0) {
        $pdo->exec("INSERT INTO payment_methods (name, symbol, wallet_address, network, icon, color, min_deposit, min_withdrawal, deposit_fee, withdrawal_fee, is_active) VALUES 
            ('Bitcoin', 'BTC', 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh', 'Bitcoin', 'Bitcoin', 'orange', 50, 100, 0, 0.001, true),
            ('Ethereum', 'ETH', '0x742d35Cc6634C0532925a3b844Bc9e7595f8b3a2', 'ERC-20', 'Ethereum', 'purple', 25, 50, 0, 0.005, true),
            ('USDT TRC20', 'USDT', 'TKVx9Wj42m5bWs9KqMwT5CYzJsBSw9GJJL', 'TRC-20', 'Tether', 'green', 10, 20, 0, 1, true)
        ");
        echo "Payment methods created\n";
    } else {
        echo "Payment methods already exist\n";
    }

    // Create settings
    $existingSettings = $db->selectOne("SELECT COUNT(*) as count FROM settings");
    if ($existingSettings['count'] == 0) {
        $pdo->exec("INSERT INTO settings (setting_key, setting_value, description) VALUES 
            ('site_name', 'CryptoMine', 'Website Name'),
            ('mining_active', '1', 'Global Mining Status'),
            ('global_roi', '100', 'Global ROI Percentage'),
            ('min_deposit', '10', 'Minimum Deposit Amount'),
            ('min_withdrawal', '20', 'Minimum Withdrawal Amount'),
            ('referral_bonus', '5', 'Referral Bonus Percentage')
        ");
        echo "Settings created\n";
    } else {
        echo "Settings already exist\n";
    }

    echo "\nSeeding completed successfully!\n";

} catch (PDOException $e) {
    echo "Seeding error: " . $e->getMessage() . "\n";
    exit(1);
}
