<?php

require_once __DIR__ . '/../config/database.php';

class PaymentMethod {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll($activeOnly = false) {
        $sql = "SELECT * FROM payment_methods";
        if ($activeOnly) {
            $sql .= " WHERE is_active = true";
        }
        $sql .= " ORDER BY name ASC";
        return $this->db->select($sql);
    }

    public function findById($id) {
        return $this->db->selectOne("SELECT * FROM payment_methods WHERE id = ?", [$id]);
    }

    public function create($data) {
        return $this->db->insert('payment_methods', $data);
    }

    public function update($id, $data) {
        return $this->db->update('payment_methods', $data, 'id = ?', [$id]);
    }

    public function delete($id) {
        return $this->db->delete('payment_methods', 'id = ?', [$id]);
    }
}
