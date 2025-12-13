<?php

require_once __DIR__ . '/../config/database.php';

class Transaction {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        return $this->db->select(
            "SELECT t.*, u.name as user_name, u.email as user_email FROM transactions t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC"
        );
    }

    public function getByUserId($userId) {
        return $this->db->select(
            "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC",
            [$userId]
        );
    }

    public function create($data) {
        return $this->db->insert('transactions', $data);
    }
}
