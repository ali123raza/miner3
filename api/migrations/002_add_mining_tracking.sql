<?php
// Migration: Add last_mined_at to users
// ALTER TABLE users ADD COLUMN last_mined_at DATETIME DEFAULT CURRENT_TIMESTAMP;

// Logic:
// 1. Get user's active rigs
// 2. Calculate sum(daily_earning)
// 3. Time diff = now() - last_mined_at
// 4. Earned = (Diff in seconds) * (Daily / 86400)
// 5. Update user balance += Earned
// 6. Update last_mined_at = now()
