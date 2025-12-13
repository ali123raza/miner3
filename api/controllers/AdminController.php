<?php

require_once __DIR__ . '/../middleware/AuthMiddleware.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Rig.php';
require_once __DIR__ . '/../models/Deposit.php';
require_once __DIR__ . '/../models/Withdrawal.php';
require_once __DIR__ . '/../models/Transaction.php';
require_once __DIR__ . '/../models/Notification.php';
require_once __DIR__ . '/../models/PaymentMethod.php';
require_once __DIR__ . '/../models/Setting.php';

class AdminController {
    private $user;

    public function __construct() {
        $this->user = AuthMiddleware::authenticateAdmin();
    }

    // Dashboard
    public function dashboard() {
        $db = Database::getInstance();
        
        $totalUsers = $db->selectOne("SELECT COUNT(*) as count FROM users WHERE role = 'user'")['count'];
        $totalDeposits = $db->selectOne("SELECT COALESCE(SUM(amount), 0) as total FROM deposits WHERE status = 'approved'")['total'];
        $totalWithdrawals = $db->selectOne("SELECT COALESCE(SUM(amount), 0) as total FROM withdrawals WHERE status = 'approved'")['total'];
        $pendingDeposits = $db->selectOne("SELECT COUNT(*) as count FROM deposits WHERE status = 'pending'")['count'];
        $pendingWithdrawals = $db->selectOne("SELECT COUNT(*) as count FROM withdrawals WHERE status = 'pending'")['count'];
        $openTickets = $db->selectOne("SELECT COUNT(*) as count FROM tickets WHERE status IN ('open', 'pending')")['count'];

        Response::success([
            'total_users' => intval($totalUsers),
            'total_deposits' => floatval($totalDeposits),
            'total_withdrawals' => floatval($totalWithdrawals),
            'pending_deposits' => intval($pendingDeposits),
            'pending_withdrawals' => intval($pendingWithdrawals),
            'open_tickets' => intval($openTickets)
        ]);
    }

    // Users
    public function getUsers() {
        $userModel = new User();
        $users = $userModel->getAll();
        Response::success($users);
    }

    public function updateUser($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $userModel = new User();
        $userModel->update($id, $data);
        $user = $userModel->findById($id);
        Response::success(['user' => $user], 'User updated');
    }

    // Rigs
    public function getRigs() {
        $rigModel = new Rig();
        $rigs = $rigModel->getAll();
        Response::success($rigs);
    }

    public function createRig() {
        $data = json_decode(file_get_contents('php://input'), true);
        $rigModel = new Rig();
        $rigId = $rigModel->create($data);
        $rig = $rigModel->findById($rigId);
        Response::success(['rig' => $rig], 'Rig created');
    }

    public function updateRig($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $rigModel = new Rig();
        $rigModel->update($id, $data);
        $rig = $rigModel->findById($id);
        Response::success(['rig' => $rig], 'Rig updated');
    }

    public function deleteRig($id) {
        $rigModel = new Rig();
        $rigModel->delete($id);
        Response::success(null, 'Rig deleted');
    }

    // Deposits
    public function getDeposits() {
        $depositModel = new Deposit();
        $deposits = $depositModel->getAll();
        Response::success($deposits);
    }

    public function approveDeposit($id) {
        $depositModel = new Deposit();
        $result = $depositModel->approve($id);
        if (isset($result['error'])) {
            Response::error($result['error']);
        }
        Response::success(null, 'Deposit approved');
    }

    public function rejectDeposit($id) {
        $depositModel = new Deposit();
        $result = $depositModel->reject($id);
        if (isset($result['error'])) {
            Response::error($result['error']);
        }
        Response::success(null, 'Deposit rejected');
    }

    // Withdrawals
    public function getWithdrawals() {
        $withdrawalModel = new Withdrawal();
        $withdrawals = $withdrawalModel->getAll();
        Response::success($withdrawals);
    }

    public function approveWithdrawal($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $withdrawalModel = new Withdrawal();
        $result = $withdrawalModel->approve($id, $data['tx_hash'] ?? null);
        if (isset($result['error'])) {
            Response::error($result['error']);
        }
        Response::success(null, 'Withdrawal approved');
    }

    public function rejectWithdrawal($id) {
        $withdrawalModel = new Withdrawal();
        $result = $withdrawalModel->reject($id);
        if (isset($result['error'])) {
            Response::error($result['error']);
        }
        Response::success(null, 'Withdrawal rejected');
    }

    // Transactions
    public function getTransactions() {
        $transactionModel = new Transaction();
        $transactions = $transactionModel->getAll();
        Response::success($transactions);
    }

    // Payment Methods
    public function getPaymentMethods() {
        $paymentModel = new PaymentMethod();
        $methods = $paymentModel->getAll();
        Response::success($methods);
    }

    public function createPaymentMethod() {
        $data = json_decode(file_get_contents('php://input'), true);
        $paymentModel = new PaymentMethod();
        $methodId = $paymentModel->create($data);
        $method = $paymentModel->findById($methodId);
        Response::success(['method' => $method], 'Payment method created');
    }

    public function updatePaymentMethod($id) {
        $data = json_decode(file_get_contents('php://input'), true);
        $paymentModel = new PaymentMethod();
        $paymentModel->update($id, $data);
        $method = $paymentModel->findById($id);
        Response::success(['method' => $method], 'Payment method updated');
    }

    public function deletePaymentMethod($id) {
        $paymentModel = new PaymentMethod();
        $paymentModel->delete($id);
        Response::success(null, 'Payment method deleted');
    }

    // Settings
    public function getSettings() {
        $settingModel = new Setting();
        $settings = $settingModel->getAll();
        Response::success($settings);
    }

    public function updateSettings() {
        $data = json_decode(file_get_contents('php://input'), true);
        $settingModel = new Setting();
        $settingModel->updateMultiple($data);
        Response::success(null, 'Settings updated');
    }

    // Notifications
    public function getNotifications() {
        $notificationModel = new Notification();
        $notifications = $notificationModel->getAdminNotifications();
        Response::success($notifications);
    }

    public function markAllNotificationsRead() {
        $notificationModel = new Notification();
        $notificationModel->markAllAdminAsRead();
        Response::success(null, 'All notifications marked as read');
    }
}
