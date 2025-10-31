
# Agriwatch
G03_42
=======
# 🌱 AgriWatch - Agriculture Monitoring System

A comprehensive agriculture monitoring system built with Angular frontend and PHP backend, designed to monitor temperature, humidity, and soil moisture levels in agricultural environments.

## 🚀 Features

### User Features
- **Authentication System**
  - User registration with email verification
  - Secure login/logout functionality
  - Password reset via email
  - Profile management

- **Real-time Monitoring**
  - Live temperature readings
  - Live humidity monitoring
  - Live soil moisture tracking
  - Auto-refresh every 30 seconds

- **Data Visualization**
  - Historical data charts
  - Trend analysis
  - Data export functionality
  - Interactive dashboards

- **User Management**
  - Profile editing
  - Password changes
  - Account settings

### Admin Features
- **User Management**
  - View all users
  - Edit user profiles
  - Delete users
  - Role management

- **System Monitoring**
  - Enhanced dashboard with system status
  - Sensor health monitoring
  - Data analytics

### Device Integration
- **IoT Device Support**
  - RESTful API endpoints for sensor data
  - Real-time data ingestion
  - Timestamp tracking
  - Data validation

## 🛠️ Technology Stack

### Frontend
- **Angular 20** - Modern web framework
- **TypeScript** - Type-safe JavaScript
- **Angular Material** - UI components
- **Chart.js** - Data visualization
- **RxJS** - Reactive programming

### Backend
- **PHP 8+** - Server-side scripting
- **MySQL** - Database management
- **XAMPP** - Local development environment
- **PDO** - Database abstraction layer

### Database
- **MySQL** - Relational database
- **phpMyAdmin** - Database administration

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

1. **Node.js** (v18 or higher)
2. **XAMPP** (Apache, MySQL, PHP)
3. **Git** (for version control)

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AgriWatch
```

### 2. Frontend Setup (Angular)

#### Install Dependencies
```bash
npm install
```

#### Start Development Server
```bash
npm start
```
The Angular application will be available at `http://localhost:4200`

### 3. Backend Setup (PHP)

#### Configure XAMPP
1. Start XAMPP Control Panel
2. Start Apache and MySQL services
3. Copy the `api` folder to `C:\xampp\htdocs\agriwatch\`

#### Database Setup
1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Create a new database named `agriwatch`
3. Import the database schema:
   ```sql
   -- Run the contents of database/schema.sql
   ```

#### Database Configuration
Update the database connection in `api/config/database.php`:
```php
private $host = "localhost";
private $db_name = "agriwatch";
private $username = "root";
private $password = "";
```

### 4. API Configuration

The API base URL is configured in the Angular services. Update if needed:
```typescript
// In src/app/services/auth.service.ts and data.service.ts
private apiUrl = 'http://localhost/agriwatch/api';
```

## 📊 Database Schema

### Users Table
- `id` - Primary key
- `name` - User's full name
- `email` - Unique email address
- `password` - Hashed password
- `role` - User role (user/admin)
- `verification_token` - Email verification token
- `reset_token` - Password reset token
- `is_email_verified` - Email verification status
- `created_at` - Account creation timestamp

### Sensor Data Tables
- `temperature_readings` - Temperature sensor data
- `humidity_readings` - Humidity sensor data
- `soil_moisture_readings` - Soil moisture sensor data

Each sensor table contains:
- `id` - Primary key
- `value` - Sensor reading value
- `timestamp` - Reading timestamp

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/signup.php` - User registration
- `POST /api/auth/login.php` - User login
- `POST /api/auth/verify-email.php` - Email verification
- `POST /api/auth/forgot-password.php` - Password reset request

### Sensor Data
- `GET /api/sensors/temperature/current.php` - Current temperature
- `GET /api/sensors/humidity/current.php` - Current humidity
- `GET /api/sensors/soil-moisture/current.php` - Current soil moisture
- `GET /api/sensors/temperature/log.php` - Temperature history
- `GET /api/sensors/humidity/log.php` - Humidity history
- `GET /api/sensors/soil-moisture/log.php` - Soil moisture history

### Device Integration
- `POST /api/device/temperature.php` - Submit temperature data
- `POST /api/device/humidity.php` - Submit humidity data
- `POST /api/device/soil-moisture.php` - Submit soil moisture data

## 👤 Default Credentials

### Admin Account
- **Email:** admin@agriwatch.com
- **Password:** admin123

## 🔒 Security Features

- **Password Hashing** - Bcrypt encryption
- **SQL Injection Prevention** - Prepared statements
- **CORS Configuration** - Cross-origin request handling
- **Input Validation** - Data sanitization
- **Email Verification** - Account activation required

## 📱 Device Integration

### IoT Device Setup
To integrate IoT devices, send POST requests to the device endpoints:

```bash
# Temperature data
curl -X POST http://localhost/agriwatch/api/device/temperature.php \
  -H "Content-Type: application/json" \
  -d '{"value": 25.5}'

# Humidity data
curl -X POST http://localhost/agriwatch/api/device/humidity.php \
  -H "Content-Type: application/json" \
  -d '{"value": 65.2}'

# Soil moisture data
curl -X POST http://localhost/agriwatch/api/device/soil-moisture.php \
  -H "Content-Type: application/json" \
  -d '{"value": 45.3}'
```

## 🎨 UI/UX Features

- **Responsive Design** - Works on all devices
- **Modern Interface** - Clean and intuitive design
- **Real-time Updates** - Live data refresh
- **Interactive Charts** - Data visualization
- **Loading States** - User feedback
- **Error Handling** - Graceful error messages

## 🚀 Deployment

### Production Setup
1. Build the Angular application:
   ```bash
   npm run build
   ```

2. Deploy the built files to your web server

3. Configure the PHP backend on your server

4. Update database configuration for production

5. Set up SSL certificates for secure communication

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v1.0.0** - Initial release with core features
- Authentication system
- Real-time monitoring
- Data visualization
- Device integration

---

**AgriWatch** - Empowering farmers with smart agriculture monitoring technology.
>>>>>>> master
