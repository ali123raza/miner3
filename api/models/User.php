<?php

require_once __DIR__ . '/../config/database.php';

class User {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function create($data) {
        $referralCode = strtoupper(substr(md5(uniqid()), 0, 8));
        
        return $this->db->insert('users', [
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => password_hash($data['password'], PASSWORD_DEFAULT),
            'referral_code' => $referralCode,
            'referred_by' => $data['referred_by'] ?? null,
            'role' => $data['role'] ?? 'user',
            'admin_role' => $data['admin_role'] ?? null
        ]);
    }

    public function findByEmail($email) {
        return $this->db->selectOne("SELECT * FROM users WHERE email = ?", [$email]);
    }

    public function findById($id) {
        return $this->db->selectOne(
            "SELECT id, name, email, role, admin_role, balance, total_deposits, total_withdrawals, total_earnings, referral_code, status, created_at FROM users WHERE id = ?",
            [$id]
        );
    }

    public function getAll() {
        return $this->db->select("SELECT id, name, email, role, balance, status, created_at FROM users ORDER BY created_at DESC");
    }

    public function update($id, $data) {
        return $this->db->update('users', $data, 'id = ?', [$id]);
    }

    public function updateBalance($id, $amount) {
        return $this->db->query("UPDATE users SET balance = balance + ? WHERE id = ?", [$amount, $id]);
    }

    public function getDashboardStats($userId) {
        $user = $this->findById($userId);
        
        $activeRigs = $this->db->selectOne(
            "SELECT COUNT(*) as count FROM user_rigs WHERE user_id = ? AND status = 'active'",
            [$userId]
        );
        
        $totalHashRate = $this->db->selectOne(
            "SELECT COALESCE(SUM(r.hash_rate), 0) as total FROM user_rigs ur JOIN rigs r ON ur.rig_id = r.id WHERE ur.user_id = ? AND ur.status = 'active'",
            [$userId]
        );

        // Calculate daily earnings from active rigs
        $dailyEarnings = $this->db->selectOne(
            "SELECT COALESCE(SUM(ur.daily_earning), 0) as total FROM user_rigs ur WHERE ur.user_id = ? AND ur.status = 'active'",
            [$userId]
        );

        return [
            'balance' => floatval($user['balance'] ?? 0),
            'total_deposits' => floatval($user['total_deposits'] ?? 0),
            'total_withdrawals' => floatval($user['total_withdrawals'] ?? 0),
            'total_earnings' => floatval($user['total_earnings'] ?? 0),
            'active_rigs' => intval($activeRigs['count'] ?? 0),
            'total_hash_rate' => floatval($totalHashRate['total'] ?? 0),
            'daily_earnings' => floatval($dailyEarnings['total'] ?? 0)
        ];
    }

    public function collectMiningEarnings($userId) {
        $user = $this->findById($userId);
        $lastMined = strtotime($user['created_at']); // Fallback to created_at
        
        // Use last_mined_at if available
        $result = $this->db->selectOne("SELECT last_mined_at FROM users WHERE id = ?", [$userId]);
        if (!empty($result['last_mined_at'])) {
            $lastMined = strtotime($result['last_mined_at']);
        }

        $now = time();
        $secondsDiff = $now - $lastMined;

        if ($secondsDiff <= 0) {
            return ['amount' => 0, 'new_balance' => $user['balance']];
        }

        // Calculate daily earnings
        $dailyData = $this->db->selectOne(
            "SELECT COALESCE(SUM(ur.daily_earning), 0) as total FROM user_rigs ur WHERE ur.user_id = ? AND ur.status = 'active'",
            [$userId]
        );
        $dailyEarnings = floatval($dailyData['total'] ?? 0);

        if ($dailyEarnings <= 0) {
            // Update timestamp even if no earnings to prevent huge accumulation if they buy a rig later
            $currentDate = date('Y-m-d H:i:s');
            $this->db->query("UPDATE users SET last_mined_at = ? WHERE id = ?", [$currentDate, $userId]);
            return ['amount' => 0, 'new_balance' => $user['balance']];
        }

        // Calculate earned amount: (Daily / 86400) * seconds
        $earnedParams = ($dailyEarnings / 86400) * $secondsDiff;
        $earned = round($earnedParams, 6); // 6 decimal precision for crypto

        if ($earned > 0) {
            $currentDate = date('Y-m-d H:i:s');
            // Update user balance and timestamps
            $this->db->query(
                "UPDATE users SET balance = balance + ?, total_earnings = total_earnings + ?, last_mined_at = ? WHERE id = ?", 
                [$earned, $earned, $currentDate, $userId]
            );
            
            // Log mining earning (optional: maybe too many logs, keep it simple for now or log only significant amounts)
            // For real-time frequent updates, we usually don't log every micro-transaction to 'transactions' table to avoid bloat
            // But user might want to see it. Let's create a 'mining' type transaction only if accumulated amount is > $0.01 or something.
            // For now, let's skip transaction log for every visual update to keep DB clean, 
            // OR we can just update the balance. The user asked for "bucket dump", so maybe log it?
            if ($earned >= 0.01) {
                $this->db->insert('transactions', [
                    'user_id' => $userId,
                    'type' => 'earning',
                    'amount' => $earned,
                    'description' => 'Mining rewards collected',
                    'status' => 'completed'
                ]);
            }
        } else {
             $currentDate = date('Y-m-d H:i:s');
             $this->db->query("UPDATE users SET last_mined_at = ? WHERE id = ?", [$currentDate, $userId]);
        }

        // Get fresh balance
        $freshUser = $this->findById($userId);
        
        return [
            'amount' => $earned,
            'new_balance' => floatval($freshUser['balance']),
            'total_earnings' => floatval($freshUser['total_earnings'])
        ];
    }
}
