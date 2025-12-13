<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/JWT.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/User.php';

class AuthController {
    private $userModel;

    public function __construct() {
        $this->userModel = new User();
    }

    public function register() {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['name']) || empty($data['email']) || empty($data['password'])) {
            Response::error('Name, email and password are required');
        }

        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            Response::error('Invalid email format');
        }

        if (strlen($data['password']) < 6) {
            Response::error('Password must be at least 6 characters');
        }

        if ($this->userModel->findByEmail($data['email'])) {
            Response::error('Email already exists', 409);
        }

        $userId = $this->userModel->create($data);
        $user = $this->userModel->findById($userId);

        $token = JWT::encode(['id' => $userId, 'email' => $user['email'], 'role' => $user['role']]);

        Response::success(['token' => $token, 'user' => $user], 'Registration successful');
    }

    public function login() {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['email']) || empty($data['password'])) {
            Response::error('Email and password are required');
        }

        $user = $this->userModel->findByEmail($data['email']);

        if (!$user || !password_verify($data['password'], $user['password'])) {
            Response::error('Invalid credentials', 401);
        }

        if ($user['status'] !== 'active') {
            Response::error('Account suspended', 403);
        }

        unset($user['password']);
        $token = JWT::encode(['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role']]);

        Response::success(['token' => $token, 'user' => $user], 'Login successful');
    }

    public function adminLogin() {
        $data = json_decode(file_get_contents('php://input'), true);

        if (empty($data['email']) || empty($data['password'])) {
            Response::error('Email and password are required');
        }

        $user = $this->userModel->findByEmail($data['email']);

        if (!$user || !password_verify($data['password'], $user['password'])) {
            Response::error('Invalid credentials', 401);
        }

        if ($user['role'] !== 'admin') {
            Response::error('Admin access required', 403);
        }

        unset($user['password']);
        $token = JWT::encode(['id' => $user['id'], 'email' => $user['email'], 'role' => $user['role']]);

        Response::success(['token' => $token, 'user' => $user], 'Admin login successful');
    }

    public function me() {
        require_once __DIR__ . '/../middleware/AuthMiddleware.php';
        $user = AuthMiddleware::authenticate();
        Response::success(['user' => $user]);
    }
}
