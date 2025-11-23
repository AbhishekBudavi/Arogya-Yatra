# Backend Server Connection Issue - Setup Guide

## Problem
Frontend getting "Status 0" error when trying to connect to `http://localhost:5000/api/appointments/patient`

This means the backend server is not running or not responding.

## Solution

### Step 1: Ensure Backend Dependencies are Installed
```bash
cd Backend
npm install
```

### Step 2: Create/Check .env File
Create a `.env` file in the Backend directory with:

```env
# Database Configuration
DB_USER=postgres
DB_HOST=localhost
DB_NAME=arogya_yatra
DB_PASS=your_password
DB_PORT=5432

# Server
PORT=5000
NODE_ENV=development

# JWT
JWT_SECRET=your_jwt_secret_key_here
```

**Important:** Replace `your_password` with your actual PostgreSQL password

### Step 3: Ensure PostgreSQL is Running
Make sure PostgreSQL database service is running on your system.

For Windows:
- Check Services: Services.msc → Look for PostgreSQL
- Or restart: `net start postgresql-x64-15` (or your version)

### Step 4: Start the Backend Server

**Option A: Development Mode (with auto-reload)**
```bash
cd Backend
npm run dev
```

**Option B: Production Mode**
```bash
cd Backend
npm start
```

### Step 5: Verify Server is Running
Check that you see:
```
🚀 Server running on http://localhost:5000
Database connected successfully
✓ All migrations completed successfully!
```

### Step 6: Test the Connection
Open in browser: `http://localhost:5000/whoami`

Should return:
```json
{
  "cookies": {}
}
```

## Common Issues & Fixes

### Issue: "connect ECONNREFUSED 127.0.0.1:5432"
**Cause:** PostgreSQL is not running
**Fix:** Start PostgreSQL service

### Issue: "password authentication failed"
**Cause:** Wrong DB_PASS in .env
**Fix:** Update .env with correct PostgreSQL password

### Issue: "listen EADDRINUSE :::5000"
**Cause:** Port 5000 is already in use
**Fix:** 
- Kill process: `lsof -ti:5000 | xargs kill -9` (Mac/Linux)
- Or change PORT in .env to 5001

### Issue: "Error: ENOENT: no such file or directory"
**Cause:** Migration SQL files not found
**Fix:** Ensure you're in Backend directory when starting server

## Verify Full Setup

### Terminal 1: Backend
```bash
cd Backend
npm run dev
# Should show: 🚀 Server running on http://localhost:5000
```

### Terminal 2: Frontend  
```bash
cd FrontEnd
npm run dev
# Should show: ▲ Next.js running on http://localhost:3000
```

### Terminal 3: Check APIs work
```bash
curl http://localhost:5000/whoami
# Should return: {"cookies":{}}
```

## CORS Configuration (Already Set)

The backend is already configured to accept requests from:
- http://localhost:3000 (Frontend)
- http://localhost:3001
- http://localhost:8080

With credentials enabled for JWT cookies.

## Troubleshooting Checklist

- [ ] PostgreSQL service is running
- [ ] .env file exists with correct DB credentials
- [ ] Backend dependencies installed (`npm install`)
- [ ] Backend server starts without errors (`npm run dev`)
- [ ] Server logs show "🚀 Server running on http://localhost:5000"
- [ ] `http://localhost:5000/whoami` returns valid JSON
- [ ] Frontend is running on port 3000
- [ ] No port conflicts (check with `netstat -an | grep 5000`)

## After Backend is Running

Once backend is successfully running, the frontend should:
1. Connect to `/api/appointments/patient` successfully
2. Display patient appointments in Recent Appointments page
3. Show real-time notifications in navbar
4. No more "Status 0" errors

---

**Quick Start Commands:**

```bash
# Terminal 1: Start Backend
cd Backend && npm run dev

# Terminal 2: Start Frontend
cd FrontEnd && npm run dev

# Terminal 3: Verify
curl http://localhost:5000/whoami
```

---

**Status:** Backend setup guide complete
