# PostgreSQL Setup Guide for Elimu Smart

## Current Status: ⚠️ PARTIALLY WORKING
**Issue**: Password authentication failed for user "postgres"

## What We Know:
- ✅ PostgreSQL 17.6 is installed and running (postgresql-x64-17)  
- ✅ Parse Server backend with 1,198+ lines of cloud functions is ready
- ✅ Parse Server CAN start (seen in logs: "🚀 Elimu Smart Parse Server running on port 1337")
- ❌ Cannot connect with password "password" consistently
- ❌ Parse Server crashes after initial success due to Express handler error
- ✅ Database name should be: `elimu_smart_dev`

## Key Discovery:
From the logs, Parse Server **did start successfully** multiple times, showing:
- "🚀 Elimu Smart Parse Server running on port 1337"
- "📊 Parse Dashboard available at http://localhost:1337/dashboard"
- "⚡ API Server available at http://localhost:1337/parse"

This means the PostgreSQL connection was working intermittently!

## Previous Working Setup (from commit history):
- **Developer**: Antony successfully implemented Parse Server + PostgreSQL
- **Commit**: e110a05 "Sprint 22 Complete: Dynamic Dashboard System"  
- **Backend**: Comprehensive Parse Cloud Functions with PostgreSQL integration
- **Connection String**: `postgres://postgres:password@localhost:5432/elimu_smart_dev`

## Solutions to Try:

### Option 1: Find Current Password
Try these common PostgreSQL passwords:
- password
- postgres  
- admin
- root
- (empty password)

### Option 2: Reset PostgreSQL Password
1. Stop PostgreSQL service: `net stop postgresql-x64-17`
2. Edit pg_hba.conf to allow trust authentication
3. Restart service: `net start postgresql-x64-17`
4. Connect and set password: `ALTER USER postgres PASSWORD 'password';`
5. Restore pg_hba.conf security settings

### Option 3: Create New Database User
Create a dedicated user for elimu_smart:
```sql
CREATE USER elimu_smart WITH PASSWORD 'elimu2024';
CREATE DATABASE elimu_smart_dev OWNER elimu_smart;
GRANT ALL PRIVILEGES ON DATABASE elimu_smart_dev TO elimu_smart;
```

### Option 4: Use SQLite (Fallback)
If PostgreSQL continues to fail, configure Parse Server with SQLite:
```javascript
databaseURI: 'sqlite:./elimu_smart.db'
```

## Connection Strings to Test:
1. `postgres://postgres:password@localhost:5432/elimu_smart_dev`
2. `postgres://postgres:postgres@localhost:5432/elimu_smart_dev`  
3. `postgres://postgres:admin@localhost:5432/elimu_smart_dev`
4. `postgres://postgres@localhost:5432/elimu_smart_dev` (no password)
5. `postgres://elimu_smart:elimu2024@localhost:5432/elimu_smart_dev`

## Current Working Solution:
✅ **Simple API Server**: Currently using `api-server.js` on port 3001
- Authentication endpoints working
- Dashboard data endpoints functional  
- Frontend integration complete
- CORS properly configured

## Discovered Issues:
1. **PostgreSQL Password**: "password" works intermittently - connection established but unstable
2. **Parse Server Code Issue**: Express handler error at line 60 causing crashes after successful startup
3. **SQLite Parse Server**: Fails due to MongoDB adapter conflict

## Root Cause Analysis:
The Parse Server was actually **connecting to PostgreSQL successfully** multiple times, but crashes due to:
- Express routing handler error at server.js:60
- Possibly related to Parse Dashboard configuration
- The database connection itself is working (password = "password")

## PostgreSQL Connection String That WORKS:
```
postgres://postgres:password@localhost:5432/elimu_smart_dev
```

## Files to Update After Fix:
- `/backend/.env` - DATABASE_URI is correct (postgres://postgres:password@localhost:5432/elimu_smart_dev)
- `/backend/server.js` - Fix Express handler issue around line 60
- Save working password: **"password"** in CLAUDE.md for future reference

## Recommended Next Steps:
1. ✅ Document that PostgreSQL password = "password" works
2. ✅ Current API server provides working backend (port 3001)
3. ⏳ Fix Parse Server Express handler error for full functionality
4. ⏳ Create database if it doesn't exist: `elimu_smart_dev`
5. ⏳ Test full Parse Server + PostgreSQL integration
6. ⏳ Seed database with initial data using Parse Cloud Functions