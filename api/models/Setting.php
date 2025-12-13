<?php

require_once __DIR__ . '/../config/database.php';

class Setting {
    private $db;

    public function __construct() {
        $this->db = Database::getInstance();
    }

    public function getAll() {
        return $this->db->select("SELECT * FROM settings ORDER BY setting_key ASC");
    }

    public function get($key) {
        $result = $this->db->selectOne("SELECT setting_value FROM settings WHERE setting_key = ?", [$key]);
        return $result ? $result['setting_value'] : null;
    }

    public function set($key, $value, $description = null) {
        $existing = $this->db->selectOne("SELECT id FROM settings WHERE setting_key = ?", [$key]);
        
        if ($existing) {
            return $this->db->update('settings', ['setting_value' => $value, 'updated_at' => date('Y-m-d H:i:s')], 'setting_key = ?', [$key]);
        } else {
            return $this->db->insert('settings', [
                'setting_key' => $key,
                'setting_value' => $value,
                'description' => $description
            ]);
        }
    }

    public function updateMultiple($settings) {
        foreach ($settings as $key => $value) {
            $this->set($key, $value);
        }
        return true;
    }
}
