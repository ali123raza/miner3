<?php

// Prevent direct access for CLI (migrations)
if (php_sapi_name() === 'cli') {
    return;
}

// Load CORS headers first
require_once __DIR__ . '/config/cors.php';
require_once __DIR__ . '/config/config.php';
require_once __DIR__ . '/config/database.php';
require_once __DIR__ . '/utils/Response.php';

// Get request info
$method = $_SERVER['REQUEST_METHOD'];
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

// Remove /api prefix if exists (for subdomain setup)
$uri = preg_replace('#^/api#', '', $uri);

// Remove trailing slash
$uri = rtrim($uri, '/');

// Router
try {
    // Auth routes (public)
    if ($uri === '/auth/register' && $method === 'POST') {
        require_once __DIR__ . '/controllers/AuthController.php';
        (new AuthController())->register();
    }
    elseif ($uri === '/auth/login' && $method === 'POST') {
        require_once __DIR__ . '/controllers/AuthController.php';
        (new AuthController())->login();
    }
    elseif ($uri === '/auth/admin-login' && $method === 'POST') {
        require_once __DIR__ . '/controllers/AuthController.php';
        (new AuthController())->adminLogin();
    }
    elseif ($uri === '/auth/me' && $method === 'GET') {
        require_once __DIR__ . '/controllers/AuthController.php';
        (new AuthController())->me();
    }
    elseif ($uri === '/plans' && $method === 'GET') {
        require_once __DIR__ . '/controllers/PublicController.php';
        (new PublicController())->getPlans();
    }

    // User routes
    elseif ($uri === '/user/dashboard' && $method === 'GET') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->dashboard();
    }
    elseif ($uri === '/user/rigs' && $method === 'GET') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->getRigs();
    }
    elseif ($uri === '/user/rigs/purchase' && $method === 'POST') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->purchaseRig();
    }
    elseif ($uri === '/user/collect-earnings' && $method === 'POST') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->collectEarnings();
    }
    elseif ($uri === '/user/deposits' && $method === 'GET') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->getDeposits();
    }
    elseif ($uri === '/user/deposits' && $method === 'POST') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->createDeposit();
    }
    elseif ($uri === '/user/withdrawals' && $method === 'GET') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->getWithdrawals();
    }
    elseif ($uri === '/user/withdrawals' && $method === 'POST') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->createWithdrawal();
    }
    elseif ($uri === '/user/transactions' && $method === 'GET') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->getTransactions();
    }
    elseif ($uri === '/user/notifications' && $method === 'GET') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->getNotifications();
    }
    elseif ($uri === '/user/notifications/read-all' && $method === 'PUT') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->markAllNotificationsRead();
    }
    elseif (preg_match('#^/user/notifications/(\d+)/read$#', $uri, $matches) && $method === 'PUT') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->markNotificationRead($matches[1]);
    }
    elseif ($uri === '/user/profile' && $method === 'PUT') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->updateProfile();
    }
    elseif ($uri === '/payment-methods' && $method === 'GET') {
        require_once __DIR__ . '/controllers/UserController.php';
        (new UserController())->getPaymentMethods();
    }

    // Ticket routes
    elseif ($uri === '/tickets' && $method === 'GET') {
        require_once __DIR__ . '/controllers/TicketController.php';
        (new TicketController())->index();
    }
    elseif ($uri === '/tickets' && $method === 'POST') {
        require_once __DIR__ . '/controllers/TicketController.php';
        (new TicketController())->create();
    }
    elseif (preg_match('#^/tickets/(\d+)$#', $uri, $matches) && $method === 'GET') {
        require_once __DIR__ . '/controllers/TicketController.php';
        (new TicketController())->show($matches[1]);
    }
    elseif (preg_match('#^/tickets/(\d+)/messages$#', $uri, $matches) && $method === 'POST') {
        require_once __DIR__ . '/controllers/TicketController.php';
        (new TicketController())->addMessage($matches[1]);
    }
    elseif (preg_match('#^/tickets/(\d+)/close$#', $uri, $matches) && $method === 'PUT') {
        require_once __DIR__ . '/controllers/TicketController.php';
        (new TicketController())->close($matches[1]);
    }
    elseif (preg_match('#^/tickets/(\d+)/reopen$#', $uri, $matches) && $method === 'PUT') {
        require_once __DIR__ . '/controllers/TicketController.php';
        (new TicketController())->reopen($matches[1]);
    }

    // Admin routes
    elseif ($uri === '/admin/dashboard' && $method === 'GET') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->dashboard();
    }
    elseif ($uri === '/admin/users' && $method === 'GET') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->getUsers();
    }
    elseif (preg_match('#^/admin/users/(\d+)$#', $uri, $matches) && $method === 'PUT') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->updateUser($matches[1]);
    }
    elseif ($uri === '/admin/rigs' && $method === 'GET') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->getRigs();
    }
    elseif ($uri === '/admin/rigs' && $method === 'POST') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->createRig();
    }
    elseif (preg_match('#^/admin/rigs/(\d+)$#', $uri, $matches) && $method === 'PUT') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->updateRig($matches[1]);
    }
    elseif (preg_match('#^/admin/rigs/(\d+)$#', $uri, $matches) && $method === 'DELETE') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->deleteRig($matches[1]);
    }
    elseif ($uri === '/admin/deposits' && $method === 'GET') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->getDeposits();
    }
    elseif (preg_match('#^/admin/deposits/(\d+)/approve$#', $uri, $matches) && $method === 'PUT') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->approveDeposit($matches[1]);
    }
    elseif (preg_match('#^/admin/deposits/(\d+)/reject$#', $uri, $matches) && $method === 'PUT') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->rejectDeposit($matches[1]);
    }
    elseif ($uri === '/admin/withdrawals' && $method === 'GET') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->getWithdrawals();
    }
    elseif (preg_match('#^/admin/withdrawals/(\d+)/approve$#', $uri, $matches) && $method === 'PUT') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->approveWithdrawal($matches[1]);
    }
    elseif (preg_match('#^/admin/withdrawals/(\d+)/reject$#', $uri, $matches) && $method === 'PUT') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->rejectWithdrawal($matches[1]);
    }
    elseif ($uri === '/admin/transactions' && $method === 'GET') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->getTransactions();
    }
    elseif ($uri === '/admin/payment-methods' && $method === 'GET') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->getPaymentMethods();
    }
    elseif ($uri === '/admin/payment-methods' && $method === 'POST') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->createPaymentMethod();
    }
    elseif (preg_match('#^/admin/payment-methods/(\d+)$#', $uri, $matches) && $method === 'PUT') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->updatePaymentMethod($matches[1]);
    }
    elseif (preg_match('#^/admin/payment-methods/(\d+)$#', $uri, $matches) && $method === 'DELETE') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->deletePaymentMethod($matches[1]);
    }
    elseif ($uri === '/admin/settings' && $method === 'GET') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->getSettings();
    }
    elseif ($uri === '/admin/settings' && $method === 'PUT') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->updateSettings();
    }
    elseif ($uri === '/admin/notifications' && $method === 'GET') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->getNotifications();
    }
    elseif ($uri === '/admin/notifications/read-all' && $method === 'PUT') {
        require_once __DIR__ . '/controllers/AdminController.php';
        (new AdminController())->markAllNotificationsRead();
    }

    // Health check
    elseif ($uri === '/health' || $uri === '' || $uri === '/') {
        Response::success(['status' => 'ok', 'version' => '1.0.0', 'db' => DB_CONNECTION]);
    }

    // 404
    else {
        Response::notFound("Endpoint not found: $method $uri");
    }

} catch (Exception $e) {
    Response::error($e->getMessage(), 500);
}
