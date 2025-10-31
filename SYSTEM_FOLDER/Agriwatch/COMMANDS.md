# AgriWatch Project - Available Commands

## 🚀 Quick Start Commands (Run from root directory)

### Frontend Commands
```bash
npm start              # Start Angular development server
npm run build          # Build Angular application for production
npm run serve          # Alternative: Start Angular dev server
npm run dev            # Alternative: Start development server
npm install            # Install frontend dependencies
```

### Frontend Specific Commands
```bash
npm run frontend:start    # Start frontend development server
npm run frontend:build   # Build frontend for production
npm run frontend:install # Install frontend dependencies
```

### Backend Commands
```bash
npm run backend:test     # Test database connection
```

### Setup Commands
```bash
npm run setup           # Install all dependencies
```

## 📁 Project Structure

```
agriwatch/
├── frontend/          # Angular application
├── backend/           # PHP API
├── iot/              # Arduino code
├── docs/             # Documentation
├── scripts/          # Deployment scripts
├── tests/            # Test files
└── package.json      # Root package.json for convenience
```

## 🔧 Development Workflow

1. **Start Development**: `npm start`
2. **Build for Production**: `npm run build`
3. **Install Dependencies**: `npm install`
4. **Test Backend**: `npm run backend:test`

## 📚 Documentation

- **Main README**: `README.md`
- **Project Structure**: `PROJECT_STRUCTURE.md`
- **Setup Guide**: `docs/SETUP_GUIDE.md`
- **Verification Report**: `VERIFICATION_REPORT.md`

## 🌐 Access Points

- **Frontend**: http://localhost:4200 (when running `npm start`)
- **Backend API**: http://localhost/agriwatch/backend/api/
- **Database**: MySQL on localhost:3306

## ✅ Project Status

The project has been successfully reorganized and is 100% functional!
All commands now work from the root directory for convenience.
