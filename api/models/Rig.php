<?php

require_once __DIR__ . '/../config/database.php';

class Rig {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll($activeOnly = false) {
        $sql = "SELECT * FROM rigs";
        if ($activeOnly) {
            $sql .= " WHERE is_active = true";
        }
        $sql .= " ORDER BY price ASC";
        return $this->db->select($sql);
    }

    public function findById($id) {
        return $this->db->selectOne("SELECT * FROM rigs WHERE id = ?", [$id]);
    }

    public function create($data) {
        return $this->db->insert('rigs', $data);
    }

    public function update($id, $data) {
        return $this->db->update('rigs', $data, 'id = ?', [$id]);
    }

    public function delete($id) {
        return $this->db->delete('rigs', 'id = ?', [$id]);
    }

    public function getUserRigs($userId) {
        return $this->db->select(
            "SELECT ur.*, r.hash_rate, r.hash_unit, r.icon, r.color FROM user_rigs ur JOIN rigs r ON ur.rig_id = r.id WHERE ur.user_id = ? ORDER BY ur.purchased_at DESC",
            [$userId]
        );
    }

    public function purchaseRig($userId, $rigId) {
        $rig = $this->findById($rigId);
        if (!$rig) return ['error' => 'Rig not found'];

        // Check how many of this rig the user already owns
        $existingCount = $this->db->selectOne(
            "SELECT COUNT(*) as count FROM user_rigs WHERE user_id = ? AND rig_id = ?",
            [$userId, $rigId]
        );
        $userRigCount = intval($existingCount['count'] ?? 0);

        // Enforce max_purchase limit
        $maxPurchase = intval($rig['max_purchase'] ?? 10);
        if ($userRigCount >= $maxPurchase) {
            if ($rig['is_free']) {
                return ['error' => 'You have already claimed this free rig'];
            }
            return ['error' => "You can only purchase up to {$maxPurchase} of this rig"];
        }

        $user = $this->db->selectOne("SELECT balance FROM users WHERE id = ?", [$userId]);
        
        if (!$rig['is_free'] && $user['balance'] < $rig['price']) {
            return ['error' => 'Insufficient balance'];
        }

        // Calculate expiry date
        $expiresAt = date('Y-m-d H:i:s', strtotime("+{$rig['duration']} {$rig['duration_unit']}"));

        // Insert user rig
        $userRigId = $this->db->insert('user_rigs', [
            'user_id' => $userId,
            'rig_id' => $rigId,
            'name' => $rig['name'],
            'price' => $rig['price'],
            'daily_earning' => $rig['daily_earning'],
            'expires_at' => $expiresAt
        ]);

        // Deduct balance if not free
        if (!$rig['is_free']) {
            $this->db->query("UPDATE users SET balance = balance - ? WHERE id = ?", [$rig['price'], $userId]);
            
            // Create transaction
            $this->db->insert('transactions', [
                'user_id' => $userId,
                'type' => 'purchase',
                'amount' => -$rig['price'],
                'description' => "Purchased {$rig['name']} mining rig",
                'reference_id' => $userRigId
            ]);
        }

        return ['success' => true, 'user_rig_id' => $userRigId];
    }
}
