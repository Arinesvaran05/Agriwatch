# AgriWatch - IoT Agricultural Monitoring System

## 🌱 Overview
AgriWatch is a comprehensive IoT-based agricultural monitoring system that enables real-time tracking of environmental conditions including temperature, humidity, and soil moisture. The system provides both user and admin interfaces for monitoring and managing agricultural data.

## 🏗️ System Architecture

### Frontend (Angular)
- **Modern Angular Application** with TypeScript
- **Responsive Design** for desktop and mobile devices
- **Role-based Access Control** (User/Admin)
- **Real-time Data Visualization** with charts
- **Modular Architecture** for scalability

### Backend (PHP)
- **RESTful API** for data management
- **MySQL Database** for data storage
- **Email Integration** for notifications
- **IoT Device Communication** via HTTP endpoints
- **Security Features** with authentication and authorization

### IoT Device (ESP8266)
- **Arduino-based** sensor monitoring
- **WiFi Connectivity** for data transmission
- **Multiple Sensors** (Temperature, Humidity, Soil Moisture)
- **Real-time Data Upload** to backend

## 📁 Project Structure

```
agriwatch/
├── frontend/          # Angular Frontend
├── backend/           # PHP Backend API
├── iot/              # IoT Device Code
├── docs/             # Documentation
├── scripts/          # Deployment Scripts
├── tests/            # Test Files
└── PROJECT_STRUCTURE.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16+)
- PHP (v7.4+)
- MySQL (v8.0+)
- Arduino IDE
- ESP8266 Development Board

### Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd agriwatch
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Backend Setup**
   ```bash
   # Configure database in backend/config/database.php
   # Import database schema from backend/database/schema.sql
   ```

5. **IoT Device Setup**
   ```bash
   # Open iot/esp8266/AgriWatch_ESP8266.ino in Arduino IDE
   # Configure WiFi credentials
   # Upload to ESP8266 device
   ```

## 📚 Documentation

- **[Setup Guide](docs/SETUP_GUIDE.md)** - Complete installation guide
- **[Demo Guide](docs/DEMO_GUIDE.md)** - How to use the system
- **[Arduino Setup](docs/ARDUINO_SETUP.md)** - IoT device configuration
- **[Project Structure](PROJECT_STRUCTURE.md)** - Detailed folder organization

## 🔧 Features

### User Features
- **Dashboard** - Overview of sensor data
- **Real-time Monitoring** - Live sensor readings
- **Data Visualization** - Charts and graphs
- **Profile Management** - User account settings
- **Password Management** - Secure password changes

### Admin Features
- **User Management** - Add/edit/delete users
- **System Monitoring** - Device status tracking
- **Data Analytics** - Advanced data visualization
- **System Configuration** - Device and system settings

### IoT Features
- **Multi-sensor Support** - Temperature, humidity, soil moisture
- **WiFi Connectivity** - Automatic data transmission
- **Real-time Updates** - Continuous monitoring
- **Device Status** - Health monitoring

## 🛠️ Development

### Frontend Development
```bash
cd frontend
npm run build    # Production build
npm run test     # Run tests
npm run lint     # Code linting
```

### Backend Development
- Follow PSR-4 autoloading standards
- Use prepared statements for database queries
- Implement proper error handling
- Follow RESTful API conventions

### IoT Development
- Use Arduino IDE for development
- Follow ESP8266 best practices
- Implement proper error handling
- Use efficient data transmission

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test
```

### Backend Tests
```bash
cd tests
php test-db-connection.php
php test-device-api.php
php test-login-endpoints.php
```

### IoT Tests
- Use Arduino IDE serial monitor
- Test WiFi connectivity
- Verify sensor readings
- Test data transmission

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/forgot-password` - Password reset
- `POST /api/auth/verify-email` - Email verification

### Sensor Data
- `GET /api/sensors/temperature/current` - Current temperature
- `GET /api/sensors/humidity/current` - Current humidity
- `GET /api/sensors/soil-moisture/current` - Current soil moisture
- `GET /api/sensors/*/log` - Historical data

### Device Management
- `GET /api/device/status` - Device status
- `POST /api/device/upload` - Data upload
- `GET /api/device/discover` - Device discovery

## 🔒 Security Features

- **JWT Authentication** - Secure token-based auth
- **Password Hashing** - Bcrypt encryption
- **CORS Protection** - Cross-origin security
- **Input Validation** - Data sanitization
- **SQL Injection Prevention** - Prepared statements

## 🌐 Deployment

### Production Deployment
1. **Frontend**: Build and deploy to web server
2. **Backend**: Deploy PHP files to server
3. **Database**: Import schema and configure
4. **IoT**: Upload code to devices

### Environment Configuration
- Update API endpoints in frontend
- Configure database credentials
- Set up email SMTP settings
- Configure IoT device WiFi

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Check the documentation in `docs/`
- Review the test files in `tests/`
- Open an issue on GitHub

## 🔄 Version History

- **v1.0.0** - Initial release with basic monitoring
- **v1.1.0** - Added admin features and user management
- **v1.2.0** - Enhanced data visualization and reporting
- **v2.0.0** - Complete system reorganization and documentation

---

**AgriWatch** - Making agriculture smarter with IoT technology 🌱📊
