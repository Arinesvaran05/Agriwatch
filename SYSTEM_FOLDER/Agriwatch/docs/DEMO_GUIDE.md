# 🌱 AgriWatch - Demo Guide

## 🚀 Quick Start

Your AgriWatch application is now fully functional! Here's everything you need to know to test all features.

## 📋 Demo Account Credentials

### Admin Accounts
- **Email**: `admin@agriwatch.com` | **Password**: `admin123`
- **Email**: `demo@agriwatch.com` | **Password**: `admin123`

### User Accounts
- **Email**: `john@agriwatch.com` | **Password**: `user123`
- **Email**: `sarah@agriwatch.com` | **Password**: `user123`
- **Email**: `mike@agriwatch.com` | **Password**: `user123`

## 🎯 Testing Checklist

### ✅ Authentication Features
- [ ] **Login** - Test with both admin and user accounts
- [ ] **Sign Up** - Create new user accounts
- [ ] **Forgot Password** - Request password reset
- [ ] **Logout** - Sign out from any page

### ✅ User Dashboard Features
- [ ] **Dashboard Overview** - View current sensor readings
- [ ] **Temperature Monitoring** - View current and historical data
- [ ] **Humidity Monitoring** - View current and historical data
- [ ] **Soil Moisture Monitoring** - View current and historical data
- [ ] **Data Export** - Download CSV files
- [ ] **Profile Management** - View and edit profile
- [ ] **Change Password** - Update account password

### ✅ Admin Dashboard Features
- [ ] **Admin Dashboard** - Overview with system stats
- [ ] **User Management** - View, add, edit, delete users
- [ ] **Sensor Data Access** - Access all sensor readings
- [ ] **Admin Profile** - Manage admin account
- [ ] **Admin Change Password** - Update admin password

### ✅ Navigation Features
- [ ] **Responsive Design** - Test on different screen sizes
- [ ] **Route Protection** - Verify guards work correctly
- [ ] **Breadcrumb Navigation** - Easy navigation between pages

## 🔧 How to Test Each Feature

### 1. Authentication Testing

#### Login Test
1. Go to http://localhost:4200/
2. Click "Sign In"
3. Try logging in with different accounts:
   - Admin: `admin@agriwatch.com` / `admin123`
   - User: `john@agriwatch.com` / `user123`

#### Sign Up Test
1. Click "Sign Up" from login page
2. Fill in the form with new user details
3. Submit and verify account creation

#### Forgot Password Test
1. Click "Forgot Password?" from login page
2. Enter an existing email address
3. Submit and check for success message

### 2. User Dashboard Testing

#### Dashboard Overview
1. Login as a user account
2. View the dashboard with current sensor readings
3. Check the quick stats and recent activity

#### Sensor Monitoring
1. Navigate to Temperature, Humidity, or Soil Moisture pages
2. View current readings and historical data
3. Test the data visualization (if implemented)
4. Download CSV data files

#### Profile Management
1. Go to Profile page
2. Edit name and email
3. Save changes and verify updates

#### Change Password
1. Go to Change Password page
2. Enter current and new passwords
3. Submit and verify success

### 3. Admin Dashboard Testing

#### User Management
1. Login as admin account
2. Go to Users page
3. Test all CRUD operations:
   - **View Users**: See list of all users
   - **Add User**: Create new user account
   - **Edit User**: Modify user details
   - **Delete User**: Remove user (except admins)

#### Admin Profile
1. Go to Admin Profile page
2. Edit admin account details
3. Save and verify changes

#### Admin Change Password
1. Go to Admin Change Password page
2. Update admin password
3. Test login with new password

## 🎨 UI/UX Features to Test

### Design Elements
- [ ] **Modern UI** - Clean, professional design
- [ ] **Responsive Layout** - Works on mobile and desktop
- [ ] **Color Scheme** - Consistent purple gradient theme
- [ ] **Typography** - Readable fonts and sizing
- [ ] **Icons** - Appropriate emoji and visual elements

### User Experience
- [ ] **Loading States** - Spinners and loading messages
- [ ] **Error Handling** - Clear error messages
- [ ] **Success Messages** - Confirmation feedback
- [ ] **Form Validation** - Real-time validation
- [ ] **Navigation** - Intuitive menu structure

## 🔍 Troubleshooting

### Common Issues

#### Can't Login
- Verify credentials are correct
- Check if backend is running (Apache/MySQL)
- Clear browser cache and try again

#### Features Not Working
- Check browser console for errors (F12)
- Verify API endpoints are accessible
- Ensure database is properly configured

#### Data Not Loading
- Check if sensor data exists in database
- Verify API responses in Network tab
- Test API endpoints directly

### Backend Status Check
```bash
# Check if Apache is running
netstat -an | findstr :80

# Check if MySQL is running
netstat -an | findstr :3306

# Test API endpoint
curl http://localhost/agriwatch/api/auth/login.php
```

## 📊 Sample Data

The application comes with sample sensor data:
- **Temperature**: 24-26°C range
- **Humidity**: 65-68% range
- **Soil Moisture**: 45-48% range

Data is automatically generated with timestamps for realistic testing.

## 🚀 Next Steps

### For Development
1. **Add Data Visualization** - Implement charts and graphs
2. **Email Functionality** - Set up real email sending
3. **Real-time Updates** - Add WebSocket connections
4. **Mobile App** - Create React Native or Flutter app

### For Production
1. **Security Hardening** - Add rate limiting, HTTPS
2. **Database Optimization** - Indexing and query optimization
3. **Monitoring** - Add logging and error tracking
4. **Deployment** - Set up production environment

## 📞 Support

If you encounter any issues:
1. Check the browser console for errors
2. Verify all services are running
3. Test API endpoints directly
4. Review the setup documentation

---

**Enjoy testing your AgriWatch application! 🌱**
