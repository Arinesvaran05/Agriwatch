# AgriWatch Project Structure

## Overview
AgriWatch is an IoT-based agricultural monitoring system with a systematic folder organization designed for scalability and maintainability.

## Project Structure

```
agriwatch/
├── frontend/                    # Angular Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/           # Core functionality (guards, services)
│   │   │   │   ├── auth.guard.ts
│   │   │   │   ├── admin.guard.ts
│   │   │   │   ├── auth.service.ts
│   │   │   │   └── data.service.ts
│   │   │   ├── features/       # Feature modules organized by user type
│   │   │   │   ├── auth/       # Authentication features
│   │   │   │   │   ├── admin-login/
│   │   │   │   │   ├── user-login/
│   │   │   │   │   ├── signup/
│   │   │   │   │   ├── forgot-password/
│   │   │   │   │   └── verify-email/
│   │   │   │   ├── user/       # User-specific features
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── humidity/
│   │   │   │   │   ├── temperature/
│   │   │   │   │   ├── soil-moisture/
│   │   │   │   │   ├── data-visualization/
│   │   │   │   │   ├── profile/
│   │   │   │   │   └── change-password/
│   │   │   │   ├── admin/       # Admin-specific features
│   │   │   │   │   ├── dashboard/
│   │   │   │   │   ├── humidity/
│   │   │   │   │   ├── temperature/
│   │   │   │   │   ├── soil-moisture/
│   │   │   │   │   ├── users/
│   │   │   │   │   ├── data-visualization/
│   │   │   │   │   ├── profile/
│   │   │   │   │   └── change-password/
│   │   │   │   └── shared/      # Shared components
│   │   │   │       └── footer/
│   │   │   ├── config/          # App configuration
│   │   │   │   └── app.routes.ts
│   │   │   ├── app.ts           # Main app component
│   │   │   ├── app.html         # Main app template
│   │   │   └── app.css          # Main app styles
│   │   ├── index.html           # Main HTML file
│   │   ├── main.ts              # Bootstrap file
│   │   └── styles.css           # Global styles
│   ├── package.json             # Frontend dependencies
│   ├── angular.json             # Angular configuration
│   ├── tsconfig.json            # TypeScript configuration
│   ├── node_modules/            # Frontend dependencies
│   ├── dist/                    # Built application
│   └── public/                  # Static assets
├── backend/                     # PHP Backend API
│   ├── api/                     # API endpoints organized by functionality
│   │   ├── auth/               # Authentication APIs
│   │   │   ├── admin-login.php
│   │   │   ├── user-login.php
│   │   │   ├── signup.php
│   │   │   ├── forgot-password.php
│   │   │   ├── verify-email.php
│   │   │   ├── change-password.php
│   │   │   ├── reset-password.php
│   │   │   └── resend-verification.php
│   │   ├── user/               # User-specific APIs
│   │   │   └── update.php
│   │   ├── admin/              # Admin-specific APIs
│   │   │   └── users.php
│   │   ├── device/             # IoT device APIs
│   │   │   ├── discover.php
│   │   │   ├── status.php
│   │   │   ├── upload.php
│   │   │   ├── test.php
│   │   │   ├── humidity.php
│   │   │   ├── temperature.php
│   │   │   └── soil-moisture.php
│   │   └── sensors/            # Sensor data APIs
│   │       ├── humidity/
│   │       │   ├── current.php
│   │       │   ├── log.php
│   │       │   └── download.php
│   │       ├── temperature/
│   │       │   ├── current.php
│   │       │   ├── log.php
│   │       │   └── download.php
│   │       └── soil-moisture/
│   │           ├── current.php
│   │           ├── log.php
│   │           └── download.php
│   ├── config/                 # Configuration files
│   │   ├── cors.php
│   │   ├── database.php
│   │   ├── device.php
│   │   └── email.php
│   ├── database/               # Database schemas and migrations
│   │   ├── schema.sql
│   │   ├── enhanced_schema.sql
│   │   ├── complete-database-setup.sql
│   │   ├── update-database-iot.sql
│   │   ├── reset-database.sql
│   │   └── fix-admin.sql
│   ├── vendor/                 # Third-party libraries
│   │   └── phpmailer/
│   ├── fix-admin.php           # Admin setup utilities
│   ├── fix-admin-direct.php
│   ├── fix-admin.html
│   ├── monitor-device-status.php
│   ├── verify-email.html
│   ├── view_emails.php
│   ├── reset-database.php
│   └── email_log.txt
├── iot/                        # IoT Device Code
│   ├── esp8266/               # ESP8266 Arduino code
│   │   └── AgriWatch_ESP8266.ino
│   ├── sketch_aug22b/         # Additional Arduino sketches
│   │   └── sketch_aug22b.ino
│   └── documentation/         # IoT setup guides
├── docs/                      # Project Documentation
│   ├── README.md
│   ├── SETUP_GUIDE.md
│   ├── DEMO_GUIDE.md
│   ├── ARDUINO_SETUP.md
│   ├── ESP8266_SETUP_GUIDE.md
│   ├── ESP8266_COMPILATION_GUIDE.md
│   ├── DYNAMIC_IP_SETUP.md
│   ├── database-setup-guide.md
│   ├── quick-start.md
│   ├── setup-tutorial.md
│   ├── EMAIL_FIXES.md
│   ├── FINAL_EMAIL_FIXES.md
│   ├── NAVIGATION_AND_UI_FIXES.md
│   ├── FINAL_NAVIGATION_FIXES.md
│   ├── ADMIN_PROFILE_FIXES.md
│   ├── FINAL_STATUS.md
│   └── FINAL_STATUS_COMPLETE.md
├── scripts/                   # Build and Deployment Scripts
│   ├── start-agriwatch.bat    # Windows startup script
│   └── start-agriwatch.sh     # Linux/Mac startup script
├── tests/                     # Test Files
│   ├── test-db-connection.php
│   ├── test-device-api.php
│   ├── test-login-endpoints.php
│   ├── test-login.html
│   └── test-users-simple.html
└── PROJECT_STRUCTURE.md       # This file
```

## Architecture Overview

### Frontend (Angular)
- **Core**: Contains guards, services, and core functionality
- **Features**: Organized by user type (auth, user, admin, shared)
- **Config**: Application configuration and routing
- **Modular Design**: Each feature is self-contained with its own components

### Backend (PHP)
- **API**: RESTful endpoints organized by functionality
- **Config**: Database, CORS, email, and device configurations
- **Database**: SQL schemas and migration files
- **Vendor**: Third-party libraries (PHPMailer)

### IoT (Arduino/ESP8266)
- **ESP8266**: Main IoT device code
- **Documentation**: Setup and configuration guides

### Documentation
- **Comprehensive Guides**: Setup, demo, and troubleshooting
- **Architecture Documentation**: System design and structure

## Benefits of This Structure

1. **Scalability**: Easy to add new features and user types
2. **Maintainability**: Clear separation of concerns
3. **Team Collaboration**: Different teams can work on different modules
4. **Documentation**: Comprehensive guides for setup and maintenance
5. **Testing**: Dedicated test directory with organized test files
6. **Deployment**: Scripts for different environments

## Getting Started

1. **Frontend**: Navigate to `frontend/` and run `npm install && npm start`
2. **Backend**: Ensure PHP and MySQL are running, configure database in `backend/config/`
3. **IoT**: Upload Arduino code to ESP8266 device
4. **Documentation**: Start with `docs/README.md` and `docs/SETUP_GUIDE.md`

## Development Guidelines

- Follow the established folder structure
- Add new features in appropriate directories
- Update documentation when adding new functionality
- Test changes in the `tests/` directory
- Use the provided scripts for deployment
