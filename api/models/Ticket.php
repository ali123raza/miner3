<?php

require_once __DIR__ . '/../config/database.php';

class Ticket {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        return $this->db->select(
            "SELECT t.*, u.name as user_name, u.email as user_email, 
             (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = t.id) as message_count
             FROM tickets t JOIN users u ON t.user_id = u.id ORDER BY t.updated_at DESC"
        );
    }

    public function getByUserId($userId) {
        return $this->db->select(
            "SELECT t.*, (SELECT COUNT(*) FROM ticket_messages WHERE ticket_id = t.id) as message_count
             FROM tickets t WHERE t.user_id = ? ORDER BY t.updated_at DESC",
            [$userId]
        );
    }

    public function findById($id) {
        return $this->db->selectOne("SELECT t.*, u.name as user_name, u.email as user_email FROM tickets t JOIN users u ON t.user_id = u.id WHERE t.id = ?", [$id]);
    }

    public function create($data) {
        $ticketId = $this->db->insert('tickets', [
            'user_id' => $data['user_id'],
            'subject' => $data['subject'],
            'category' => $data['category'] ?? 'general',
            'priority' => $data['priority'] ?? 'medium'
        ]);

        // Add first message
        if (isset($data['message'])) {
            $this->addMessage($ticketId, 'user', $data['message']);
        }

        // Create admin notification
        $this->db->insert('notifications', [
            'user_id' => null,
            'type' => 'ticket',
            'title' => 'New Support Ticket',
            'message' => "New ticket: {$data['subject']}",
            'is_admin' => true
        ]);

        return $ticketId;
    }

    public function getMessages($ticketId) {
        return $this->db->select(
            "SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC",
            [$ticketId]
        );
    }

    public function addMessage($ticketId, $sender, $message) {
        $this->db->insert('ticket_messages', [
            'ticket_id' => $ticketId,
            'sender' => $sender,
            'message' => $message
        ]);

        // Update ticket timestamp and status
        $status = $sender === 'admin' ? 'pending' : 'open';
        $this->db->update('tickets', ['status' => $status, 'updated_at' => date('Y-m-d H:i:s')], 'id = ?', [$ticketId]);

        // Notify user if admin replied
        if ($sender === 'admin') {
            $ticket = $this->findById($ticketId);
            $this->db->insert('notifications', [
                'user_id' => $ticket['user_id'],
                'type' => 'ticket',
                'title' => 'New Reply to Your Ticket',
                'message' => "Support has replied to: {$ticket['subject']}"
            ]);
        }

        return true;
    }

    public function updateStatus($id, $status) {
        return $this->db->update('tickets', ['status' => $status, 'updated_at' => date('Y-m-d H:i:s')], 'id = ?', [$id]);
    }
}
