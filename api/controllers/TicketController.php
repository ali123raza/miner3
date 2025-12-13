<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/Ticket.php';

class TicketController {
    private $user;
    private $ticketModel;

    public function __construct() {
        $this->user = AuthMiddleware::authenticate();
        $this->ticketModel = new Ticket();
    }

    public function index() {
        if ($this->user['role'] === 'admin') {
            $tickets = $this->ticketModel->getAll();
        } else {
            $tickets = $this->ticketModel->getByUserId($this->user['id']);
        }
        Response::success($tickets);
    }

    public function show($id) {
        $ticket = $this->ticketModel->findById($id);
        
        if (!$ticket) {
            Response::notFound('Ticket not found');
        }

        // Check ownership for non-admin
        if ($this->user['role'] !== 'admin' && $ticket['user_id'] != $this->user['id']) {
            Response::error('Access denied', 403);
        }

        $messages = $this->ticketModel->getMessages($id);
        Response::success(['ticket' => $ticket, 'messages' => $messages]);
    }

    public function create() {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['subject']) || empty($data['message'])) {
            Response::error('Subject and message are required');
        }

        $data['user_id'] = $this->user['id'];
        $ticketId = $this->ticketModel->create($data);

        Response::success(['ticket_id' => $ticketId], 'Ticket created successfully');
    }

    public function addMessage($id) {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['message'])) {
            Response::error('Message is required');
        }

        $ticket = $this->ticketModel->findById($id);
        
        if (!$ticket) {
            Response::notFound('Ticket not found');
        }

        // Check ownership for non-admin
        if ($this->user['role'] !== 'admin' && $ticket['user_id'] != $this->user['id']) {
            Response::error('Access denied', 403);
        }

        $sender = $this->user['role'] === 'admin' ? 'admin' : 'user';
        $this->ticketModel->addMessage($id, $sender, $data['message']);

        Response::success(null, 'Message sent');
    }

    public function close($id) {
        if ($this->user['role'] !== 'admin') {
            Response::error('Admin access required', 403);
        }

        $this->ticketModel->updateStatus($id, 'closed');
        Response::success(null, 'Ticket closed');
    }

    public function reopen($id) {
        if ($this->user['role'] !== 'admin') {
            Response::error('Admin access required', 403);
        }

        $this->ticketModel->updateStatus($id, 'open');
        Response::success(null, 'Ticket reopened');
    }
}
