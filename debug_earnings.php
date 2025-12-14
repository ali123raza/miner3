<?php
require_once __DIR__ . '/api/config/database.php';

$db = Database::getInstance();

// Get the user by email
$user = $db->selectOne("SELECT * FROM users WHERE email = 'user@test.com'");
if (!$user) {
    echo "User user@test.com not found, trying first user...\n";
    $user = $db->selectOne("SELECT * FROM users LIMIT 1");
}
$userId = $user['id'];

echo "User ID: " . $userId . "\n";
echo "Current Balance: " . $user['balance'] . "\n";
echo "Last Mined At: " . ($user['last_mined_at'] ?? 'NULL') . "\n";

// Active Rigs
$activeRigs = $db->select("SELECT * FROM user_rigs WHERE user_id = ? AND status = 'active'", [$userId]);
echo "Active Rigs Count: " . count($activeRigs) . "\n";

foreach ($activeRigs as $rig) {
    echo " - Rig: {$rig['name']}, Daily: {$rig['daily_earning']}, Status: {$rig['status']}\n";
}

// Calculate Daily Earnings
$dailyData = $db->selectOne(
    "SELECT COALESCE(SUM(daily_earning), 0) as total FROM user_rigs WHERE user_id = ? AND status = 'active'",
    [$userId]
);
$dailyEarnings = floatval($dailyData['total'] ?? 0);
echo "Total Daily Earnings: " . $dailyEarnings . "\n";

// Time Logic
$lastMined = strtotime($user['created_at']);
if (!empty($user['last_mined_at'])) {
    $lastMined = strtotime($user['last_mined_at']);
}
$now = time();
$secondsDiff = $now - $lastMined;

echo "Now: $now\n";
echo "Last Mined Timestamp: $lastMined\n";
echo "Seconds Diff: $secondsDiff\n";

// Calculation
$earnedParams = ($dailyEarnings / 86400) * $secondsDiff;
$earned = round($earnedParams, 6);

echo "Raw Earned: $earnedParams\n";
echo "Rounded Earned: $earned\n";

// Check Timezone Diff
$db->query("UPDATE users SET last_mined_at = NOW() WHERE id = ?", [$userId]);
$user = $db->selectOne("SELECT last_mined_at FROM users WHERE id = ?", [$userId]);
$dbTime = strtotime($user['last_mined_at']);
$phpTime = time();

echo "PHP Time: $phpTime\n";
echo "DB Time: $dbTime\n";
echo "Diff: " . ($phpTime - $dbTime) . " seconds\n";

if ($phpTime < $dbTime) {
    echo "CRITICAL: PHP time is behind DB time. Earnings will be 0.\n";
} else {
    echo "Time sync looks OK.\n";
}
