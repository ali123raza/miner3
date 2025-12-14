<?php

require_once __DIR__ . '/../utils/Response.php';
require_once __DIR__ . '/../models/Rig.php';

class PublicController {
    
    public function getPlans() {
        $rigModel = new Rig();
        $plans = $rigModel->getAll(true);
        Response::success($plans);
    }
}
