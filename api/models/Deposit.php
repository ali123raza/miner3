<?php

require_once __DIR__ . '/../config/database.php';

class Deposit {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        return $this->db->select(
            "SELECT d.*, u.name as user_name, u.email as user_email FROM deposits d JOIN users u ON d.user_id = u.id ORDER BY d.created_at DESC"
        );
    }

    public function getByUserId($userId) {
        return $this->db->select(
            "SELECT * FROM deposits WHERE user_id = ? ORDER BY created_at DESC",
            [$userId]
        );
    }

    public function findById($id) {
        return $this->db->selectOne("SELECT * FROM deposits WHERE id = ?", [$id]);
    }

    public function create($data) {
        return $this->db->insert('deposits', $data);
    }

    public function approve($id) {
        $deposit = $this->findById($id);
        if (!$deposit) return ['error' => 'Deposit not found'];
        if ($deposit['status'] !== 'pending') return ['error' => 'Deposit already processed'];

        // Update deposit status
        $this->db->update('deposits', ['status' => 'approved'], 'id = ?', [$id]);

        // Add balance to user
        $this->db->query(
            "UPDATE users SET balance = balance + ?, total_deposits = total_deposits + ? WHERE id = ?",
            [$deposit['amount'], $deposit['amount'], $deposit['user_id']]
        );

        // Create transaction
        $this->db->insert('transactions', [
            'user_id' => $deposit['user_id'],
            'type' => 'deposit',
            'amount' => $deposit['amount'],
            'description' => "Deposit approved",
            'reference_id' => $id
        ]);

        // Create notification
        $this->db->insert('notifications', [
            'user_id' => $deposit['user_id'],
            'type' => 'deposit',
            'title' => 'Deposit Approved',
            'message' => "Your deposit of $" . number_format($deposit['amount'], 2) . " has been approved."
        ]);

        return ['success' => true];
    }

    public function reject($id) {
        $deposit = $this->findById($id);
        if (!$deposit) return ['error' => 'Deposit not found'];

        $this->db->update('deposits', ['status' => 'rejected'], 'id = ?', [$id]);

        // Create notification
        $this->db->insert('notifications', [
            'user_id' => $deposit['user_id'],
            'type' => 'deposit',
            'title' => 'Deposit Rejected',
            'message' => "Your deposit of $" . number_format($deposit['amount'], 2) . " has been rejected."
        ]);

        return ['success' => true];
    }
}
