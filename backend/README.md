# Elimu Smart Backend - Local Development

## Quick Start Guide

### 1. Prerequisites
- Node.js 18+ installed
- PostgreSQL 16+ installed and running
- Database `elimu_smart_dev` created

### 2. Environment Setup
```bash
# Copy .env.example to .env and update database credentials
cp .env.example .env

# Install dependencies
npm install

# Start development server
npm run dev
```

### 3. Verify Installation
- **Parse Server API**: http://localhost:1337/parse
- **Parse Dashboard**: http://localhost:1337/dashboard (admin/admin123)
- **Health Check**: http://localhost:1337/health

### 4. Database Configuration
Update `.env` file with your PostgreSQL credentials:
```env
DATABASE_URI=postgres://postgres:YOUR_PASSWORD@localhost:5432/elimu_smart_dev
```

### 5. Parse Dashboard Access
- **URL**: http://localhost:1337/dashboard  
- **Username**: admin
- **Password**: admin123

### 6. Available Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with auto-reload
- `npm test` - Run tests (not implemented yet)

### 7. Cloud Functions
Custom business logic functions are in `/cloud/main.js`:
- `hello` - Test function
- `calculateKUCCPSPoints` - KUCCPS cutoff calculator
- `updateCareerReadiness` - Student progress tracking
- `matchUniversityCourses` - University course matching

### 8. Troubleshooting

**Database Connection Issues:**
- Ensure PostgreSQL is running
- Check database exists: `psql -U postgres -l`
- Verify credentials in `.env`

**Parse Server Not Starting:**
- Check Node.js version: `node --version`
- Verify all dependencies installed: `npm list`
- Check logs for specific errors

**Parse Dashboard Access Issues:**
- Ensure server is running on http://localhost:1337
- Try different browser or incognito mode
- Check firewall/antivirus blocking port 1337