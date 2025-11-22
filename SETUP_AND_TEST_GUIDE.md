# Arogya-Yatra Setup & Testing Guide

## System Overview

The application consists of three main services that work together:

```
┌─────────────────────────────────────────────────────────────┐
│                       Frontend (Next.js)                      │
│                        Port: 3000                             │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓ (HTTP)
┌─────────────────────────────────────────────────────────────┐
│                   Backend (Express.js)                        │
│                        Port: 5000                             │
│  - Handles authentication & patient data                     │
│  - Calls MCP Server for note generation                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓ (HTTP)
┌─────────────────────────────────────────────────────────────┐
│              MCP HTTP Bridge (Express.js)                     │
│                        Port: 3001                             │
│  - Bridges backend to Ollama AI                              │
│  - Generates clinical notes                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ↓ (HTTP)
┌─────────────────────────────────────────────────────────────┐
│                    Ollama (AI Model)                          │
│                     Port: 11434                               │
│  - Runs llama2 language model                                │
│  - Generates structured medical notes                        │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ Quick Service Verification Checklist

### 1. **Ollama Service** (Port 11434)
```bash
Invoke-WebRequest -Uri "http://localhost:11434/api/tags" | Select-Object StatusCode
# Expected: 200
```
Status: **[Check manually]**

### 2. **Backend Server** (Port 5000)
```bash
Invoke-WebRequest -Uri "http://localhost:5000/whoami" | Select-Object StatusCode
# Expected: 200
```
Status: **Currently Running** ✅

### 3. **MCP HTTP Bridge** (Port 3001)
```bash
Invoke-WebRequest -Uri "http://localhost:3001/health" | Select-Object StatusCode
# Expected: 200
```
Status: **[Check manually]**

---

## 📁 How to Start Services

### Option A: Manual Start (Recommended for Testing)

**Terminal 1 - Start Backend:**
```bash
cd C:\Users\Admin\Desktop\arogya-yatra\Backend
npm run dev
```
This starts the Express backend on port 5000 with hot-reload.

**Terminal 2 - Start MCP HTTP Bridge:**
```bash
cd C:\Users\Admin\Desktop\arogya-yatra\MCP-Server
npm run http
```
This starts the HTTP bridge on port 3001.

**Terminal 3 - Ensure Ollama is running:**
```bash
ollama serve
```
Ollama should be running on port 11434 with llama2 model loaded.

### Option B: Using npm scripts

**Backend:**
```bash
cd Backend
npm start    # starts on port 5000
```

**MCP Server:**
```bash
cd MCP-Server
npm run http # starts on port 3001
```

---

## 🧪 Testing the API

### Test 1: Health Check
```bash
$response = Invoke-WebRequest -Uri "http://localhost:3001/health" -Method Get
Write-Host $response.Content
```

Expected output:
```json
{
  "status": "ok",
  "message": "MCP Server HTTP Bridge is running",
  "timestamp": "2025-11-22T..."
}
```

### Test 2: Generate Clinical Note

**Request:**
```bash
$payload = @{
  doctor_keywords = "Patient has fever and headache for 3 days"
  current_symptoms = "Fever (102F), severe headache, body aches"
  medical_history = '{"allergies": ["Penicillin"], "conditions": ["Hypertension"]}'
} | ConvertTo-Json

$response = Invoke-WebRequest `
  -Uri "http://localhost:3001/api/generate-clinical-note" `
  -Method Post `
  -ContentType "application/json" `
  -Body $payload

Write-Host $response.Content
```

**Expected Response (Success):**
```json
{
  "success": true,
  "structured_output": {
    "presenting_complaints": "Patient presenting with fever and headache",
    "clinical_interpretation": "Fever with headache suggestive of viral or bacterial infection...",
    "relevant_medical_history": "Patient has history of hypertension and penicillin allergy...",
    "lab_report_summary": "No lab reports available",
    "assessment_impression": "Febrile illness with headache, likely infectious etiology...",
    "full_structured_note": "Complete medical note combining all sections..."
  },
  "raw_response": "..."
}
```

---

## 🔧 Configuration Files

### Backend (.env)
**Location:** `Backend/.env`
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=0707
DB_NAME=arogyayatra
MCP_SERVER_URL=http://localhost:3001  # ← Critical for API calls
PORT=5000
```

### MCP Server (.env)
**Location:** `MCP-Server/.env`
```env
DATABASE_URL=postgresql://postgres:0707@localhost:5432/arogyayatra
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2
MCP_HTTP_PORT=3001
BACKEND_BASE_URL=http://localhost:5000
```

---

## 📊 Complete End-to-End Flow

```
1. Frontend (port 3000)
   ↓ User enters doctor keywords in form
   ↓ POST to /api/doctor-notes/generate
   
2. Backend (port 5000)
   ↓ Validates JWT & user permissions
   ↓ Fetches patient medical history from DB
   ↓ Fetches lab reports from DB
   ↓ Constructs MCP request payload
   ↓ POST to http://localhost:3001/api/generate-clinical-note
   
3. MCP HTTP Bridge (port 3001)
   ↓ Receives doctor keywords + medical data
   ↓ Builds comprehensive clinical context
   ↓ Creates detailed prompt for AI
   ↓ POST to Ollama API (port 11434)
   
4. Ollama (port 11434)
   ↓ Processes prompt with llama2 model
   ↓ Generates structured clinical note
   ↓ Returns JSON response
   
5. MCP → Backend → Frontend
   ↓ Parses structured output
   ↓ Saves note to database
   ↓ Returns to frontend
   ↓ Displays note for doctor approval
```

---

## 🐛 Troubleshooting

### Issue: "Cannot connect to MCP Server on port 3001"
**Solution:**
```bash
# Check if service is running
Get-Process node | Select-Object Name, Id

# Check port availability
netstat -ano | findstr :3001

# Restart MCP Server
Stop-Process -Name node -Force
cd C:\Users\Admin\Desktop\arogya-yatra\MCP-Server
npm run http
```

### Issue: "Ollama API timeout or not responding"
**Solution:**
```bash
# Verify Ollama is running
Invoke-WebRequest -Uri "http://localhost:11434/api/tags"

# If not running, start it
ollama serve

# Check if llama2 model is available
ollama list
```

### Issue: "Database connection failed"
**Solution:**
```bash
# Verify PostgreSQL is running
Get-Process postgres

# Check connection string in .env files
# Should be: postgresql://postgres:0707@localhost:5432/arogyayatra
```

### Issue: "JWT verification failed"
**Solution:**
- Ensure you're logged in through the frontend first
- Check that the JWT token is being sent in the Authorization header
- Verify JWT_SECRET in Backend/.env

---

## 📝 API Endpoints

### MCP Server (Port 3001)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/health` | Health check |
| POST | `/api/generate-clinical-note` | Generate clinical note |

### Backend (Port 5000)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/doctor-notes/generate` | Generate structured clinical note (requires JWT) |
| GET | `/api/doctor-notes/:patient_id` | Get all notes for patient |
| POST | `/api/doctor-notes/approve/:note_id` | Approve a note |
| POST | `/api/doctor-notes/reject/:note_id` | Reject a note |

---

## 🚀 Getting Started Quickly

1. **Ensure all services are running:**
   ```bash
   # Terminal 1: Backend
   cd Backend && npm run dev
   
   # Terminal 2: MCP Server
   cd MCP-Server && npm run http
   
   # Terminal 3: Ollama (if not already running)
   ollama serve
   ```

2. **Test the health endpoints:**
   ```bash
   Invoke-WebRequest http://localhost:5000/whoami
   Invoke-WebRequest http://localhost:3001/health
   Invoke-WebRequest http://localhost:11434/api/tags
   ```

3. **Generate a test clinical note:**
   See "Testing the API" section above

4. **Open frontend:**
   ```bash
   cd FrontEnd && npm run dev
   # Then visit http://localhost:3000
   ```

---

## 📞 Support

If you encounter issues:
1. Check the service logs in respective terminals
2. Verify all environment variables in .env files
3. Ensure all ports are not blocked by firewall
4. Check database connection (PostgreSQL must be running)
5. Verify Ollama model is available: `ollama list`

