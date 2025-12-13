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

class UserController {
    private $user;

    public function __construct() {
        $this->user = AuthMiddleware::authenticate();
    }

    public function dashboard() {
        $userModel = new User();
        $stats = $userModel->getDashboardStats($this->user['id']);
        Response::success($stats);
    }

    public function getRigs() {
        $rigModel = new Rig();
        $rigs = $rigModel->getAll(true);
        $userRigs = $rigModel->getUserRigs($this->user['id']);
        Response::success(['rigs' => $rigs, 'user_rigs' => $userRigs]);
    }

    public function purchaseRig() {
        $data = json_decode(file_get_contents('php://input'), true);
        
        if (empty($data['rig_id'])) {
            Response::error('Rig ID is required');
        }

        $rigModel = new Rig();
        $result = $rigModel->purchaseRig($this->user['id'], $data['rig_id']);

        if (isset($result['error'])) {
            Response::error($result['error']);
        }

        Response::success($result, 'Rig purchased successfully');
    }

    public function getDeposits() {
        $depositModel = new Deposit();
        $deposits = $depositModel->getByUserId($this->user['id']);
        Response::success($deposits);
    }

    public function createDeposit() {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['amount']) || empty($data['method_id'])) {
            Response::error('Amount and payment method are required');
        }

        $paymentModel = new PaymentMethod();
        $method = $paymentModel->findById($data['method_id']);

        if (!$method) {
            Response::error('Invalid payment method');
        }

        if ($data['amount'] < $method['min_deposit']) {
            Response::error("Minimum deposit is $" . $method['min_deposit']);
        }

        $depositModel = new Deposit();
        $depositId = $depositModel->create([
            'user_id' => $this->user['id'],
            'amount' => $data['amount'],
            'method_id' => $data['method_id'],
            'method_name' => $method['name'],
            'wallet_address' => $method['wallet_address'],
            'proof_url' => $data['proof_url'] ?? null
        ]);

        Response::success(['deposit_id' => $depositId], 'Deposit submitted successfully');
    }

    public function getWithdrawals() {
        $withdrawalModel = new Withdrawal();
        $withdrawals = $withdrawalModel->getByUserId($this->user['id']);
        Response::success($withdrawals);
    }

    public function createWithdrawal() {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['amount']) || empty($data['method_id']) || empty($data['wallet_address'])) {
            Response::error('Amount, payment method and wallet address are required');
        }

        $paymentModel = new PaymentMethod();
        $method = $paymentModel->findById($data['method_id']);

        if (!$method) {
            Response::error('Invalid payment method');
        }

        if ($data['amount'] < $method['min_withdrawal']) {
            Response::error("Minimum withdrawal is $" . $method['min_withdrawal']);
        }

        $withdrawalModel = new Withdrawal();
        $result = $withdrawalModel->create([
            'user_id' => $this->user['id'],
            'amount' => $data['amount'],
            'method_id' => $data['method_id'],
            'method_name' => $method['name'],
            'wallet_address' => $data['wallet_address'],
            'fee' => $method['withdrawal_fee']
        ]);

        if (isset($result['error'])) {
            Response::error($result['error']);
        }

        Response::success(['withdrawal_id' => $result], 'Withdrawal submitted successfully');
    }

    public function getTransactions() {
        $transactionModel = new Transaction();
        $transactions = $transactionModel->getByUserId($this->user['id']);
        Response::success($transactions);
    }

    public function getNotifications() {
        $notificationModel = new Notification();
        $notifications = $notificationModel->getByUserId($this->user['id']);
        $unreadCount = $notificationModel->getUnreadCount($this->user['id']);
        Response::success(['notifications' => $notifications, 'unread_count' => $unreadCount]);
    }

    public function markNotificationRead($id) {
        $notificationModel = new Notification();
        $notificationModel->markAsRead($id);
        Response::success(null, 'Notification marked as read');
    }

    public function markAllNotificationsRead() {
        $notificationModel = new Notification();
        $notificationModel->markAllAsRead($this->user['id']);
        Response::success(null, 'All notifications marked as read');
    }

    public function getPaymentMethods() {
        $paymentModel = new PaymentMethod();
        $methods = $paymentModel->getAll(true);
        Response::success($methods);
    }

    public function updateProfile() {
        $data = json_decode(file_get_contents('php://input'), true);
        $userModel = new User();

        $updateData = [];
        if (isset($data['name'])) $updateData['name'] = $data['name'];
        
        if (!empty($updateData)) {
            $userModel->update($this->user['id'], $updateData);
        }

        $user = $userModel->findById($this->user['id']);
        Response::success(['user' => $user], 'Profile updated');
    }
}
