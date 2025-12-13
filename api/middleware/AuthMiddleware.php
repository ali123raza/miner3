<?php

require_once __DIR__ . '/../config/config.php';
require_once __DIR__ . '/../utils/JWT.php';
require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/User.php';

class AuthMiddleware {
    public static function authenticate() {
        $headers = getallheaders();
        $authHeader = $headers['Authorization'] ?? $headers['authorization'] ?? '';
        
        if (empty($authHeader)) {
            Response::unauthorized('No token provided');
        }
        
        $token = str_replace('Bearer ', '', $authHeader);
        $payload = JWT::decode($token);
        
        if (!$payload) {
            Response::unauthorized('Invalid or expired token');
        }
        
        $userModel = new User();
        $user = $userModel->findById($payload['id']);
        
        if (!$user) {
            Response::unauthorized('User not found');
        }
        
        if ($user['status'] !== 'active') {
            Response::unauthorized('Account suspended');
        }
        
        return $user;
    }

    public static function authenticateAdmin() {
        $user = self::authenticate();
        
        if ($user['role'] !== 'admin') {
            Response::error('Admin access required', 403);
        }
        
        return $user;
    }
}
