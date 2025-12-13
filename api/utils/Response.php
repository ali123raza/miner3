<?php

class Response {
    public static function json($data, $code = 200) {
        http_response_code($code);
        echo json_encode($data);
        exit;
    }

    public static function success($data = null, $message = 'Success') {
        self::json(['success' => true, 'message' => $message, 'data' => $data]);
    }

    public static function error($message, $code = 400) {
        self::json(['success' => false, 'error' => $message], $code);
    }

    public static function unauthorized($message = 'Unauthorized') {
        self::error($message, 401);
    }

    public static function notFound($message = 'Not found') {
        self::error($message, 404);
    }

    public static function validation($errors) {
        self::json(['success' => false, 'errors' => $errors], 422);
    }
}
