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

        return [
            'balance' => floatval($user['balance'] ?? 0),
            'total_deposits' => floatval($user['total_deposits'] ?? 0),
            'total_withdrawals' => floatval($user['total_withdrawals'] ?? 0),
            'total_earnings' => floatval($user['total_earnings'] ?? 0),
            'active_rigs' => intval($activeRigs['count'] ?? 0),
            'total_hash_rate' => floatval($totalHashRate['total'] ?? 0)
        ];
    }
}
