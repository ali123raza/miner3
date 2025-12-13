<?php

require_once __DIR__ . '/../config/database.php';

class Withdrawal {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        return $this->db->select(
            "SELECT w.*, u.name as user_name, u.email as user_email FROM withdrawals w JOIN users u ON w.user_id = u.id ORDER BY w.created_at DESC"
        );
    }

    public function getByUserId($userId) {
        return $this->db->select(
            "SELECT * FROM withdrawals WHERE user_id = ? ORDER BY created_at DESC",
            [$userId]
        );
    }

    public function findById($id) {
        return $this->db->selectOne("SELECT * FROM withdrawals WHERE id = ?", [$id]);
    }

    public function create($data) {
        $user = $this->db->selectOne("SELECT balance FROM users WHERE id = ?", [$data['user_id']]);
        
        $totalAmount = $data['amount'] + ($data['fee'] ?? 0);
        if ($user['balance'] < $totalAmount) {
            return ['error' => 'Insufficient balance'];
        }

        // Deduct from balance immediately
        $this->db->query("UPDATE users SET balance = balance - ? WHERE id = ?", [$totalAmount, $data['user_id']]);

        return $this->db->insert('withdrawals', $data);
    }

    public function approve($id, $txHash = null) {
        $withdrawal = $this->findById($id);
        if (!$withdrawal) return ['error' => 'Withdrawal not found'];
        if ($withdrawal['status'] !== 'pending') return ['error' => 'Withdrawal already processed'];

        // Update withdrawal status
        $updateData = ['status' => 'approved'];
        if ($txHash) $updateData['tx_hash'] = $txHash;
        
        $this->db->update('withdrawals', $updateData, 'id = ?', [$id]);

        // Update user total withdrawals
        $this->db->query(
            "UPDATE users SET total_withdrawals = total_withdrawals + ? WHERE id = ?",
            [$withdrawal['amount'], $withdrawal['user_id']]
        );

        // Create transaction
        $this->db->insert('transactions', [
            'user_id' => $withdrawal['user_id'],
            'type' => 'withdrawal',
            'amount' => -$withdrawal['amount'],
            'description' => "Withdrawal approved",
            'reference_id' => $id
        ]);

        // Create notification
        $this->db->insert('notifications', [
            'user_id' => $withdrawal['user_id'],
            'type' => 'withdrawal',
            'title' => 'Withdrawal Approved',
            'message' => "Your withdrawal of $" . number_format($withdrawal['amount'], 2) . " has been processed."
        ]);

        return ['success' => true];
    }

    public function reject($id) {
        $withdrawal = $this->findById($id);
        if (!$withdrawal) return ['error' => 'Withdrawal not found'];

        // Refund balance
        $totalAmount = $withdrawal['amount'] + $withdrawal['fee'];
        $this->db->query("UPDATE users SET balance = balance + ? WHERE id = ?", [$totalAmount, $withdrawal['user_id']]);

        $this->db->update('withdrawals', ['status' => 'rejected'], 'id = ?', [$id]);

        // Create notification
        $this->db->insert('notifications', [
            'user_id' => $withdrawal['user_id'],
            'type' => 'withdrawal',
            'title' => 'Withdrawal Rejected',
            'message' => "Your withdrawal of $" . number_format($withdrawal['amount'], 2) . " has been rejected and refunded."
        ]);

        return ['success' => true];
    }
}
