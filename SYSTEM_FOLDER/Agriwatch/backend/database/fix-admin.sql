-- ========================================
-- AgriWatch Admin User Fix Script
-- ========================================
-- Run this in phpMyAdmin to fix your admin user
-- ========================================

-- Step 1: Check if admin user already exists
SELECT 'Checking for existing admin user...' as status;
SELECT id, name, email, role, is_email_verified, created_at 
FROM users 
WHERE email = 'admin@agriwatch.com';

-- Step 2: Delete existing admin user (if any)
DELETE FROM users WHERE email = 'admin@agriwatch.com';

-- Step 3: Create new admin user with correct credentials
INSERT INTO users (name, email, password, role, is_email_verified, created_at) 
VALUES (
    'Admin User', 
    'admin@agriwatch.com', 
    '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 
    'admin', 
    1, 
    NOW()
);

-- Step 4: Verify admin user was created successfully
SELECT 'Verifying admin user creation...' as status;
SELECT id, name, email, role, is_email_verified, created_at 
FROM users 
WHERE email = 'admin@agriwatch.com';

-- Step 5: Show all users for verification
SELECT 'All users in database:' as status;
SELECT id, name, email, role, is_email_verified, created_at 
FROM users 
ORDER BY id;

-- ========================================
-- Login Credentials After Fix:
-- Email: admin@agriwatch.com
-- Password: admin123
-- ========================================
