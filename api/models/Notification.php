<?php

require_once __DIR__ . '/../config/database.php';

class Notification {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getByUserId($userId) {
        return $this->db->select(
            "SELECT * FROM notifications WHERE user_id = ? AND is_admin = false ORDER BY created_at DESC LIMIT 50",
            [$userId]
        );
    }

    public function getAdminNotifications() {
        return $this->db->select(
            "SELECT * FROM notifications WHERE is_admin = true ORDER BY created_at DESC LIMIT 50"
        );
    }

    public function create($data) {
        return $this->db->insert('notifications', $data);
    }

    public function markAsRead($id) {
        return $this->db->update('notifications', ['is_read' => true], 'id = ?', [$id]);
    }

    public function markAllAsRead($userId) {
        return $this->db->query(
            "UPDATE notifications SET is_read = true WHERE user_id = ? AND is_admin = false",
            [$userId]
        );
    }

    public function markAllAdminAsRead() {
        return $this->db->query("UPDATE notifications SET is_read = true WHERE is_admin = true");
    }

    public function getUnreadCount($userId) {
        $result = $this->db->selectOne(
            "SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false AND is_admin = false",
            [$userId]
        );
        return $result['count'] ?? 0;
    }
}
