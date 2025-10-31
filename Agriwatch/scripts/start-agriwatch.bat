@echo off
echo ========================================
echo           AgriWatch Startup Script
echo ========================================
echo.

echo Starting XAMPP Services...
echo.

REM Start XAMPP Apache and MySQL
echo [1/4] Starting Apache...
start "" "C:\xampp\xampp_start.exe" apache

echo [2/4] Starting MySQL...
start "" "C:\xampp\xampp_start.exe" mysql

echo.
echo Waiting for XAMPP services to start...
timeout /t 5 /nobreak > nul

echo.
echo [3/4] Starting Angular Development Server...
echo.

REM Navigate to project directory and start Angular
cd /d "%~dp0"
start "Angular Dev Server" cmd /k "ng serve --port 4201"

echo.
echo [4/4] Opening browser...
timeout /t 10 /nobreak > nul

REM Open browser to the application
start http://localhost:4201

echo.
echo ========================================
echo           Setup Complete!
echo ========================================
echo.
echo Frontend: http://localhost:4201
echo Backend API: http://localhost/agriwatch/api
echo phpMyAdmin: http://localhost/phpmyadmin
echo.
echo Login Pages:
echo User Login: http://localhost:4201/login/user
echo Admin Login: http://localhost:4201/login/admin
echo.
echo Default Admin Login:
echo Email: admin@agriwatch.com
echo Password: admin123
echo.
echo ========================================
echo        Latest Updates & Fixes
echo ========================================
echo.
echo ✓ Fixed user name update issues
echo ✓ Smart email validation (only checks when email changes)
echo ✓ Partial updates support
echo ✓ Visual change indicators in forms
echo ✓ Better error handling and user feedback
echo ✓ Changes summary before submission
echo ✓ Simplified profile update logic
echo ✓ Admin setup script created
echo.
echo ========================================
echo        User Management Features
echo ========================================
echo.
echo • Edit users with smart validation
echo • Change names without email conflicts
echo • Visual feedback for form changes
echo • Partial updates (only changed fields)
echo • Better error messages
echo.
echo ========================================
echo        Setup Instructions
echo ========================================
echo.
echo If you can't login with admin@agriwatch.com:
echo 1. First, test the endpoints: double-click test-login.html
echo 2. If still having issues, RESET DATABASE: http://localhost/agriwatch/reset-database.php
echo 3. This will create a completely fresh database with admin user
echo 4. Then try logging in with:
echo    Email: admin@agriwatch.com
echo    Password: admin123
echo.
echo Test Page: test-login.html (double-click to open)
echo Database Test: test-db-connection.php (run in browser)
echo Complete Setup: complete-database-setup.sql (import in phpMyAdmin)
echo Database Reset: reset-database.php (run in browser)
echo.
echo Press any key to exit...
pause > nul
