# Clinical Note Generation Integration Guide

## Overview

This guide explains how to integrate Ollama-powered clinical note generation into your Arogya Yatra medical system. The system accepts doctor's keywords/observations and automatically generates medically accurate, professionally formatted clinical notes using Ollama LLM.

## Architecture

```
Frontend (Doctor UI)
    ↓
    ↓ POST /api/doctor-notes/generate
    ↓
Backend (Express.js)
    ↓ Fetches clinical data
    ├→ Medical History
    ├→ Lab Reports
    ├→ Prescriptions
    └→ Patient Info
    ↓
    ↓ POST /api/generate-clinical-note
    ↓
MCP Server (HTTP Bridge)
    ↓ Creates prompt with medical context
    ↓
Ollama (LLM)
    ↓ Generates structured medical note
    ↓
MCP Server (parses & returns)
    ↓
Backend (saves to database)
    ↓
Frontend (displays structured note)
```

## Setup Requirements

### 1. Ollama Installation

**Windows:**
```powershell
# Download from: https://ollama.ai
# Or use Chocolatey:
choco install ollama
```

**macOS:**
```bash
brew install ollama
```

**Linux:**
```bash
curl https://ollama.ai/install.sh | sh
```

### 2. Start Ollama Service

```bash
ollama serve
# Ollama will start on http://localhost:11434
```

### 3. Pull Medical Model

```bash
# Pull a suitable medical model (llama2 is recommended for medical text)
ollama pull llama2

# Or use a more specialized model:
ollama pull mistral  # Faster, good for most use cases
```

### 4. Environment Variables

**Backend (.env):**
```env
MCP_SERVER_URL=http://localhost:3001
DATABASE_URL=postgresql://user:password@localhost:5432/arogyayatra
NODE_ENV=development
```

**MCP Server (.env):**
```env
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2
MCP_HTTP_PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/arogyayatra
BACKEND_BASE_URL=http://localhost:5000
```

### 5. Install Dependencies

**Backend:**
```bash
cd Backend
npm install express-validator  # For input validation
npm install
npm run dev
```

**MCP Server:**
```bash
cd MCP-Server
npm install
npm run dev
```

## API Endpoints

### 1. Generate Clinical Note

**Endpoint:** `POST /api/doctor-notes/generate`

**Authentication:** Bearer Token (Doctor JWT)

**Request Headers:**
```json
{
  "Authorization": "Bearer <doctor_jwt_token>",
  "Content-Type": "application/json"
}
```

**Request Body:**
```json
{
  "doctor_id": "doc_123",
  "patient_id": "pat_456",
  "raw_input": "58-year-old male, presenting with chest pain radiating to left arm for 2 hours. Shortness of breath, diaphoresis noted. BP 145/92, HR 102. Previous history of HTN, hyperlipidemia. Currently on Aspirin, Atorvastatin",
  "current_symptoms": "Severe chest pain (8/10), dyspnea on exertion, nausea",
  "additional_notes": "Patient appears anxious. O2 saturation 94% on room air. ECG pending."
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Clinical note generated and saved successfully",
  "note": {
    "id": 42,
    "patient_id": "pat_456",
    "doctor_id": "doc_123",
    "status": "pending_review",
    "presenting_complaints": "Acute chest pain radiating to left arm with associated dyspnea and diaphoresis",
    "clinical_interpretation": "Presentation highly suggestive of acute coronary syndrome. Patient demonstrates classic signs of myocardial ischemia with risk factors including hypertension and hyperlipidemia. Hemodynamic changes (tachycardia, hypertension) consistent with stress response to cardiac ischemia.",
    "relevant_medical_history": "Chronic hypertension, hyperlipidemia, current treatment with ASA and atorvastatin",
    "lab_report_summary": "Pending troponin levels and complete cardiac workup. Current vitals: BP 145/92 mmHg, HR 102 bpm, SpO2 94% on room air",
    "assessment_impression": "Rule out acute myocardial infarction. Differential diagnosis includes unstable angina, aortic dissection, pulmonary embolism. Requires urgent ECG interpretation and troponin analysis.",
    "full_structured_note": "58-year-old male with significant cardiovascular risk factors...[full note]",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response (400 Bad Request):**
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "field": "raw_input",
      "message": "raw_input must be at least 10 characters long"
    }
  ]
}
```

**Error Response (503 Service Unavailable):**
```json
{
  "success": false,
  "error": "MCP server (Ollama) is not running",
  "details": "Ensure the MCP server and Ollama are started",
  "solution": "npm run dev (in MCP-Server directory) and ollama serve"
}
```

### 2. Get All Notes for Patient

**Endpoint:** `GET /api/doctor-notes/:patient_id`

**Authentication:** Bearer Token (Doctor JWT)

**Response:**
```json
{
  "success": true,
  "notes": [
    {
      "id": 42,
      "patient_id": "pat_456",
      "doctor_id": "doc_123",
      "status": "pending_review",
      "full_structured_note": "...",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

### 3. Get Approved Notes Only

**Endpoint:** `GET /api/doctor-notes/approved/:patient_id`

**Response:** Returns only notes with status "approved"

### 4. Get Specific Note

**Endpoint:** `GET /api/doctor-notes/note/:note_id`

**Response:** Returns complete note details

### 5. Approve Note

**Endpoint:** `POST /api/doctor-notes/approve/:note_id`

**Request Body (optional):**
```json
{
  "reason": "Clinically accurate and complete"
}
```

**Response:** Note with status changed to "approved"

### 6. Reject Note

**Endpoint:** `POST /api/doctor-notes/reject/:note_id`

**Request Body (optional):**
```json
{
  "reason": "Requires additional clinical information"
}
```

### 7. Update Note

**Endpoint:** `PUT /api/doctor-notes/update/:note_id`

**Request Body:**
```json
{
  "full_structured_note": "Updated note content...",
  "status": "approved"
}
```

### 8. Delete/Archive Note

**Endpoint:** `DELETE /api/doctor-notes/:note_id`

**Response:** Note with status changed to "archived"

## Data Flow Details

### What Clinical Data is Fetched?

When generating a note, the system automatically fetches:

1. **Patient Basic Info**
   - Age, Blood Group
   - Arogya Yatra ID

2. **Medical History**
   - Chronic conditions
   - Past surgeries
   - Current medications
   - Blood pressure, blood sugar readings
   - Family history
   - Lifestyle factors (smoking, alcohol consumption)

3. **Lab Reports**
   - All document_type = 'labReport'
   - All document_type = 'testResult'
   - All document_type = 'diagnostic'

4. **Prescriptions**
   - Recent prescriptions (last 5)

5. **Vaccination Records**
   - Vaccination history

### Prompt Engineering

The system uses advanced prompt engineering to ensure:
- **Medical Accuracy**: Temperature set to 0.2 (low randomness)
- **Proper Terminology**: Instructions to use medical abbreviations (HTN, DM, etc.)
- **Structured Format**: JSON-based output format
- **Context Awareness**: Integrates all available patient data

### Generated Output Structure

Each generated note contains:

```
presenting_complaints
├─ Chief complaint(s) in medical terms
│  Example: "Acute chest pain with ST elevation"

clinical_interpretation
├─ Medical analysis and findings
│  Example: "Presentation consistent with STEMI..."

relevant_medical_history
├─ Pertinent past medical history
│  Example: "HTN, DM2, previous MI in 2019..."

lab_report_summary
├─ Clinical significance of abnormal findings
│  Example: "Troponin elevated to 2.5 ng/mL..."

assessment_impression
├─ Clinical assessment and differential diagnosis
│  Example: "Acute ST-elevation myocardial infarction..."

full_structured_note
└─ Complete professional medical note in narrative format
   Example: "58-year-old male presents with acute onset..."
```

## Database Schema

### doctor_notes Table

```sql
CREATE TABLE doctor_notes (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL,
  doctor_id VARCHAR(50) NOT NULL,
  note_type VARCHAR(50) DEFAULT 'structured_note',
  raw_input TEXT NOT NULL,
  presenting_complaints TEXT,
  clinical_interpretation TEXT,
  relevant_medical_history TEXT,
  lab_report_summary TEXT,
  assessment_impression TEXT,
  full_structured_note TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  lab_reports_used INTEGER[],
  medical_history_used INTEGER[],
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id)
);
```

**Status Values:**
- `draft`: Initial state, not yet submitted
- `pending_review`: Submitted for doctor review
- `approved`: Reviewed and approved by doctor
- `rejected`: Rejected by reviewer
- `archived`: Deleted/archived

## Testing with Postman

### Collection Setup

1. Import `Arogya Service.postman_collection.json`

2. Set up environment variables:
   - `{{backend_url}}` = `http://localhost:5000`
   - `{{mcp_url}}` = `http://localhost:3001`
   - `{{doctor_token}}` = [Your JWT token]

3. Test endpoint:
```
POST http://localhost:5000/api/doctor-notes/generate
```

## Troubleshooting

### "MCP server is not running"
```bash
# Terminal 1: Start Ollama
ollama serve

# Terminal 2: Start MCP Server
cd MCP-Server && npm run dev
```

### "Model not found"
```bash
# Pull the required model
ollama pull llama2

# Or check available models
ollama list
```

### "Timeout after 5 minutes"
- Ollama is processing slowly
- Try with a simpler prompt or fewer medical details
- Check Ollama logs for errors

### "Generated note is empty"
- Ollama may not be returning valid JSON
- Check the raw_response in the API response
- Verify Ollama model is properly loaded

### Database Connection Error
- Verify `DATABASE_URL` in .env
- Ensure PostgreSQL is running
- Check migration: `create_doctor_notes_table.sql` has been applied

## Frontend Integration Example

```javascript
// React/Next.js example

async function generateClinicalNote(doctorId, patientId, keywords) {
  const response = await fetch('/api/doctor-notes/generate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    },
    body: JSON.stringify({
      doctor_id: doctorId,
      patient_id: patientId,
      raw_input: keywords,
      current_symptoms: 'Patient reported symptoms...',
      additional_notes: 'Any additional clinical observations...'
    })
  });

  const data = await response.json();
  
  if (data.success) {
    // Display the generated note
    console.log('Generated Note:', data.note.full_structured_note);
    
    // Note is saved to database with ID: data.note.id
  } else {
    console.error('Error:', data.error);
  }
}
```

## Performance Considerations

- **Note Generation Time**: 30-60 seconds (Ollama processing)
- **Database Queries**: ~100ms (clinical data retrieval)
- **Total Request Time**: ~40-70 seconds

### Optimization Tips

1. **Use lower-end models for faster processing**
   ```bash
   ollama pull orca-mini  # Faster, smaller model
   ```

2. **Reduce clinical data** if not all fields are needed

3. **Implement request timeouts** on frontend to show progress

## Security Considerations

1. **JWT Authentication**: All endpoints require valid doctor token
2. **Database Access**: Only authorized doctors can access patient notes
3. **Validation**: All inputs validated with express-validator
4. **No PHI in logs**: Sensitive data not logged to stdout

## Monitoring

### MCP Server Health
```bash
curl http://localhost:3001/health
```

Expected response:
```json
{
  "status": "ok",
  "message": "MCP Server HTTP Bridge is running",
  "timestamp": "2024-01-15T10:30:00Z",
  "ollama": {
    "url": "http://localhost:11434",
    "model": "llama2"
  }
}
```

## Next Steps

1. Deploy backend with updated controllers
2. Configure and start MCP server
3. Install and run Ollama
4. Run migrations to create doctor_notes table
5. Test with provided Postman collection
6. Integrate frontend UI with new endpoints

## Support

For issues or questions:
1. Check logs in MCP Server terminal
2. Verify Ollama is running: `ollama list`
3. Test health endpoint
4. Review generated note raw_response for Ollama output quality
