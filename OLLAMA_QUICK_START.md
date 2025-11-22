# Ollama Integration - Quick Start

## 5-Minute Setup

### Prerequisites
- Node.js installed
- PostgreSQL running
- Git repository updated

### Step 1: Install Ollama (2 minutes)

**Windows:**
- Download from https://ollama.ai
- Run installer
- Open PowerShell and verify: `ollama --version`

**macOS/Linux:**
```bash
curl https://ollama.ai/install.sh | sh
```

### Step 2: Start Ollama (1 minute)

```powershell
# PowerShell
ollama serve

# This will start Ollama on http://localhost:11434
# Leave this running in a terminal
```

In a new terminal, pull the model:
```powershell
ollama pull llama2
```

### Step 3: Start Backend & MCP Server (2 minutes)

**Terminal 1 - Backend:**
```bash
cd Backend
npm install  # Only needed first time
npm run dev
# Backend runs on http://localhost:5000
```

**Terminal 2 - MCP Server:**
```bash
cd MCP-Server
npm install  # Only needed first time
npm run dev
# MCP Server runs on http://localhost:3001
```

### Step 4: Test the Integration

```bash
# Check if everything is running
curl http://localhost:3001/health

# Expected response:
# {
#   "status": "ok",
#   "message": "MCP Server HTTP Bridge is running",
#   "ollama": {
#     "url": "http://localhost:11434",
#     "model": "llama2"
#   }
# }
```

## Generate Your First Clinical Note

### Using Postman

1. Open Postman
2. Create new POST request to:
   ```
   http://localhost:5000/api/doctor-notes/generate
   ```

3. Set headers:
   ```
   Authorization: Bearer <your_doctor_jwt_token>
   Content-Type: application/json
   ```

4. Send body:
   ```json
   {
     "doctor_id": "doc_123",
     "patient_id": "pat_456",
     "raw_input": "62-year-old female presenting with persistent cough for 3 weeks, low-grade fever, weight loss. Chest X-ray shows infiltrates in left lower lobe. History of TB contact. O2 sat 94%. Referred for TB screening.",
     "current_symptoms": "Chronic cough with minimal sputum, fatigue, night sweats",
     "additional_notes": "Patient is a healthcare worker. Lives with family."
   }
   ```

5. **Wait 30-60 seconds** for Ollama to generate the note

6. Response will contain structured clinical note with sections:
   - presenting_complaints
   - clinical_interpretation
   - relevant_medical_history
   - lab_report_summary
   - assessment_impression
   - full_structured_note

### Using cURL

```bash
curl -X POST http://localhost:5000/api/doctor-notes/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": "doc_123",
    "patient_id": "pat_456",
    "raw_input": "45-year-old male with severe abdominal pain, nausea, vomiting. Pain localized to RUQ. Fever 38.5C. Ultrasound shows gallstones with wall thickening. WBC elevated. No prior biliary surgery."
  }'
```

## File Changes Made

### Backend
✅ `/Backend/controllers/doctorNotes.controller.js` - Enhanced with data retrieval
✅ `/Backend/utils/clinicalDataRetrieval.js` - New utility for fetching medical data
✅ `/Backend/middlewares/validateDoctorNotes.js` - Input validation
✅ `/Backend/routes/doctorNotes.routes.js` - Updated with validation

### MCP Server
✅ `/MCP-Server/src/http-server.ts` - Enhanced prompt engineering and error handling

### Documentation
✅ `/OLLAMA_INTEGRATION_GUIDE.md` - Comprehensive integration guide
✅ `/OLLAMA_QUICK_START.md` - This file

## What Gets Generated

The system generates medically accurate notes with:

```
Input from Doctor:
"Patient complaining of severe headache, neck stiffness, fever"

Generated Output:
{
  "presenting_complaints": "Acute onset severe headache with nuchal rigidity and fever",
  "clinical_interpretation": "Presentation highly suggestive of bacterial meningitis. Nuchal rigidity and fever are cardinal signs requiring urgent evaluation for CNS infection.",
  "relevant_medical_history": "[Retrieved automatically from database]",
  "lab_report_summary": "[Latest lab values analyzed]",
  "assessment_impression": "Suspect bacterial meningitis. Requires immediate lumbar puncture and empiric antibiotic therapy.",
  "full_structured_note": "[Complete professional note]"
}
```

## Troubleshooting Quick Fixes

| Problem | Solution |
|---------|----------|
| "Cannot connect to Ollama" | Run `ollama serve` in a separate terminal |
| "Model not found" | Run `ollama pull llama2` |
| "Request timeout" | Ollama is processing - wait 1-2 more minutes |
| "MCP server not running" | Run `npm run dev` in MCP-Server directory |
| "Backend error" | Check DATABASE_URL in .env file |

## Terminal Setup (Recommended)

Keep 4 terminals open:

```
Terminal 1: Ollama Service
$ ollama serve

Terminal 2: Backend
$ cd Backend && npm run dev

Terminal 3: MCP Server
$ cd MCP-Server && npm run dev

Terminal 4: Testing/Development
$ # For testing and running commands
```

## Next: Connect Frontend

Once testing is complete, update your frontend to call:
```javascript
POST /api/doctor-notes/generate
```

See full guide in `/OLLAMA_INTEGRATION_GUIDE.md` for complete API reference and frontend examples.

## Monitor Ollama Performance

```bash
# Check what models are loaded
ollama list

# Check if Ollama is responsive
curl http://localhost:11434/api/tags

# View available endpoints
curl http://localhost:11434/api/show
```

## Performance Tips

- First request takes longer (model loading)
- Subsequent requests are faster (~30-45 seconds)
- Use simpler keywords for faster generation
- Medical models may be slower but more accurate

## Key Features

✅ Automatic medical history retrieval
✅ Lab reports and documents analyzed
✅ Medical terminology enforcement
✅ Structured JSON output
✅ Database persistence
✅ Doctor approval workflow
✅ Full audit trail
✅ Error handling and validation

## Need More Help?

1. See detailed guide: `OLLAMA_INTEGRATION_GUIDE.md`
2. Check MCP Server logs for Ollama issues
3. Review test collection: `MCP-Server/Arogya Service.postman_collection.json`
4. Verify all 4 services are running on expected ports
