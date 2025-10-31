#!/bin/bash

echo "========================================"
echo "           AgriWatch Startup Script"
echo "========================================"
echo

echo "Starting XAMPP Services..."
echo

# Start XAMPP Apache and MySQL
echo "[1/4] Starting Apache..."
sudo /opt/lampp/lampp start apache

echo "[2/4] Starting MySQL..."
sudo /opt/lampp/lampp start mysql

echo
echo "Waiting for XAMPP services to start..."
sleep 5

echo
echo "[3/4] Starting Angular Development Server..."
echo

# Navigate to project directory and start Angular
cd "$(dirname "$0")"
npm start &

echo
echo "[4/4] Opening browser..."
sleep 10

# Open browser to the application (Linux)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:4200
elif command -v open &> /dev/null; then
    open http://localhost:4200
fi

echo
echo "========================================"
echo "           Setup Complete!"
echo "========================================"
echo
echo "Frontend: http://localhost:4200"
echo "Backend API: http://localhost/agriwatch/api"
echo "phpMyAdmin: http://localhost/phpmyadmin"
echo
echo "Default Admin Login:"
echo "Email: admin@agriwatch.com"
echo "Password: admin123"
echo
echo "Press Ctrl+C to stop all services"
echo

# Keep script running
wait
