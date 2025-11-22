# Ollama Integration - Validation & Testing Guide

## Pre-Flight Checklist

Before testing, verify all services are running:

```bash
# Terminal 1: Ollama
ollama serve
# Should output: "Listening on 127.0.0.1:11434"

# Terminal 2: MCP Server
cd MCP-Server && npm run dev
# Should output: "✅ MCP HTTP Bridge is running on http://localhost:3001"

# Terminal 3: Backend
cd Backend && npm run dev
# Should output: "Server is running on port 5000"
```

## Service Health Checks

### 1. Ollama Service

```bash
# Check if Ollama is running
curl http://localhost:11434/api/tags

# Expected response:
# {"models":[{"name":"llama2:latest","details":...}]}
```

### 2. MCP Server

```bash
# Health check
curl http://localhost:3001/health

# Expected response:
{
  "status": "ok",
  "message": "MCP Server HTTP Bridge is running",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "ollama": {
    "url": "http://localhost:11434",
    "model": "llama2"
  }
}
```

### 3. Backend

```bash
# Check if backend is accepting requests
curl http://localhost:5000/health

# You may get 404 or 200, depending on your health endpoint
```

## Test Case 1: Valid Request

### Request
```bash
curl -X POST http://localhost:5000/api/doctor-notes/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": "doc_12345",
    "patient_id": "pat_67890",
    "raw_input": "48-year-old male presenting with acute onset chest pain, radiating to left shoulder. Associated with shortness of breath and mild diaphoresis. Patient reports similar episode 6 months ago. Vital signs: BP 142/88, HR 98, RR 16, Temp 98.6F, O2 sat 97% on RA.",
    "current_symptoms": "Severe chest pain (7/10), dyspnea on exertion",
    "additional_notes": "Known hypertension, on lisinopril. No recent medication changes."
  }'
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Clinical note generated and saved successfully",
  "note": {
    "id": 1,
    "patient_id": "pat_67890",
    "doctor_id": "doc_12345",
    "status": "pending_review",
    "presenting_complaints": "Acute onset chest pain with radiation to left shoulder and associated dyspnea",
    "clinical_interpretation": "Presentation consistent with acute coronary syndrome. Typical cardiac chest pain with characteristic radiation pattern and associated symptoms.",
    "relevant_medical_history": "Known hypertension managed with lisinopril. Similar episode 6 months prior.",
    "lab_report_summary": "Vital signs: BP 142/88 mmHg, HR 98 bpm, RR 16 /min, SpO2 97% on RA",
    "assessment_impression": "Acute chest pain suspicious for acute coronary syndrome. Requires urgent evaluation with ECG and troponin levels.",
    "full_structured_note": "[Complete note text]...",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### Validation Points
✓ Response status 201 (Created)
✓ success = true
✓ Note ID assigned
✓ Status = "pending_review"
✓ All sections populated
✓ Medical terminology used
✓ Contains information from input

---

## Test Case 2: Missing Required Field

### Request (missing patient_id)
```bash
curl -X POST http://localhost:5000/api/doctor-notes/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": "doc_12345",
    "raw_input": "Patient presenting with..."
  }'
```

### Expected Response (400 Bad Request)
```json
{
  "success": false,
  "error": "Validation failed",
  "errors": [
    {
      "field": "patient_id",
      "message": "patient_id is required and must be a string"
    }
  ]
}
```

### Validation Points
✓ Status 400
✓ Validation error returned
✓ Field name identified
✓ Clear error message

---

## Test Case 3: Input Too Short

### Request (raw_input < 10 characters)
```bash
curl -X POST http://localhost:5000/api/doctor-notes/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": "doc_12345",
    "patient_id": "pat_67890",
    "raw_input": "short"
  }'
```

### Expected Response (400 Bad Request)
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

---

## Test Case 4: Invalid JWT Token

### Request (invalid authorization)
```bash
curl -X POST http://localhost:5000/api/doctor-notes/generate \
  -H "Authorization: Bearer INVALID_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": "doc_12345",
    "patient_id": "pat_67890",
    "raw_input": "Valid clinical keywords here..."
  }'
```

### Expected Response (401 Unauthorized)
```json
{
  "error": "Unauthorized",
  "message": "Invalid or missing authorization token"
}
```

---

## Test Case 5: Ollama Service Down

### Request (with Ollama stopped)
```bash
curl -X POST http://localhost:5000/api/doctor-notes/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": "doc_12345",
    "patient_id": "pat_67890",
    "raw_input": "Valid clinical observation text here..."
  }'
```

### Expected Response (503 Service Unavailable)
```json
{
  "success": false,
  "error": "MCP server (Ollama) is not running",
  "details": "Ensure the MCP server and Ollama are started",
  "solution": "npm run dev (in MCP-Server directory) and ollama serve"
}
```

---

## Test Case 6: Get All Notes for Patient

### Request
```bash
curl -X GET http://localhost:5000/api/doctor-notes/pat_67890 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "notes": [
    {
      "id": 1,
      "patient_id": "pat_67890",
      "doctor_id": "doc_12345",
      "status": "pending_review",
      "full_structured_note": "...",
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

## Test Case 7: Get Specific Note

### Request
```bash
curl -X GET http://localhost:5000/api/doctor-notes/note/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "note": {
    "id": 1,
    "patient_id": "pat_67890",
    "doctor_id": "doc_12345",
    "status": "pending_review",
    "presenting_complaints": "...",
    "clinical_interpretation": "...",
    "full_structured_note": "...",
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

---

## Test Case 8: Approve Note

### Request
```bash
curl -X POST http://localhost:5000/api/doctor-notes/approve/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Clinically accurate and complete"
  }'
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Note approved successfully",
  "note": {
    "id": 1,
    "status": "approved",
    "updated_at": "2024-01-15T10:35:00Z",
    ...
  }
}
```

---

## Test Case 9: Get Approved Notes Only

### Request
```bash
curl -X GET http://localhost:5000/api/doctor-notes/approved/pat_67890 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "notes": [
    {
      "id": 1,
      "status": "approved",
      ...
    }
  ],
  "count": 1
}
```

---

## Test Case 10: Reject Note

### Request
```bash
curl -X POST http://localhost:5000/api/doctor-notes/reject/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "reason": "Requires more clinical detail"
  }'
```

### Expected Response (200 OK)
```json
{
  "success": true,
  "message": "Note rejected successfully",
  "note": {
    "id": 1,
    "status": "rejected",
    ...
  }
}
```

---

## Performance Testing

### Test Load Time

```bash
# Single request
time curl -X POST http://localhost:5000/api/doctor-notes/generate \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{...}'

# Expected output: real 0m45s (approximately)
```

### Monitor Ollama Performance

```bash
# During note generation, check Ollama in another terminal
while true; do 
  curl -s http://localhost:11434/api/tags | jq '.'; 
  sleep 2; 
done
```

---

## Data Validation Tests

### Test 1: Medical History Integration

**Setup:**
1. Create a patient with medical history (chronic conditions, medications)
2. Generate a note for this patient

**Validation:**
✓ Generated note mentions chronic conditions
✓ Current medications are listed
✓ Blood pressure/sugar values referenced

### Test 2: Lab Reports Integration

**Setup:**
1. Upload lab reports for a patient
2. Generate a note

**Validation:**
✓ Lab report values appear in note
✓ lab_report_summary populated
✓ Lab report IDs tracked in note

### Test 3: Multiple Generations

**Setup:**
1. Generate 3 different notes for same patient
2. Get all notes for patient

**Validation:**
✓ All 3 notes in database
✓ Different IDs
✓ Different timestamps
✓ Can distinguish by doctor_id

---

## Error Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| No network to Ollama | 503 Service Unavailable |
| Ollama crashes mid-request | Timeout after 5 minutes |
| Database connection lost | 500 Internal Server Error |
| Invalid JWT token | 401 Unauthorized |
| Missing authorization header | 401 Unauthorized |
| Concurrent requests | Queued by Ollama |
| Very long raw_input | Should still process |
| Special characters in input | Properly escaped |

---

## Postman Collection Testing

### Import & Setup

1. Import `MCP-Server/Arogya Service.postman_collection.json`
2. Create environment with:
   - `base_url`: http://localhost:5000
   - `mcp_url`: http://localhost:3001
   - `doctor_token`: [Your JWT]
   - `patient_id`: pat_67890
   - `doctor_id`: doc_12345

3. Run test collection:
   - Health Check
   - Generate Note
   - Get All Notes
   - Get Specific Note
   - Approve Note
   - Get Approved Notes
   - Reject Note (create new note first)

---

## Logging & Debugging

### Backend Console Output
```
📋 Generating clinical note for Patient: pat_67890, Doctor: doc_12345
📂 Fetching patient clinical data...
🤖 Calling MCP server (Ollama) to generate clinical note...
⏳ Processing with Ollama (this may take 30-60 seconds)...
✅ Ollama processing complete
💾 Saving generated note to database...
✅ Clinical note saved with ID: 1
```

### MCP Server Console Output
```
📥 Received request to generate clinical note
🔧 Building clinical context...
📝 Building prompt for Ollama with medical terminology guidelines...
⏳ Waiting for Ollama to generate note...
   Model is analyzing clinical data and generating medically accurate note...
📤 Initiating Ollama API call...
   Model: llama2
   URL: http://localhost:11434/api/generate
✅ Ollama response received successfully
🔄 Parsing structured note...
✅ Clinical note generated successfully
```

---

## Regression Testing

After any code changes, run these tests:

- [ ] Valid note generation
- [ ] Input validation errors
- [ ] Missing field errors
- [ ] Ollama connection errors
- [ ] Database persistence
- [ ] Note retrieval
- [ ] Approve workflow
- [ ] Reject workflow
- [ ] Concurrent requests
- [ ] Error messages are clear

---

## Performance Benchmarks

### Baseline Metrics

| Operation | Time | Status |
|-----------|------|--------|
| Single note generation | 45-70s | ✓ Expected |
| Data retrieval | 100ms | ✓ Good |
| Database save | 50ms | ✓ Good |
| Ollama processing | 30-60s | ✓ Normal |
| Get all notes | 10ms | ✓ Fast |
| Get single note | 5ms | ✓ Very fast |

### Optimization Opportunities

- Cache medical history for repeat patients
- Use connection pooling for database
- Implement note generation queuing
- Consider smaller Ollama models for speed

---

## Sign-Off Checklist

- [ ] All 10 test cases pass
- [ ] Health checks working
- [ ] Authentication verified
- [ ] Data persistence verified
- [ ] Error handling tested
- [ ] Performance acceptable
- [ ] Logging shows correct flow
- [ ] Database records created
- [ ] Medical terminology verified
- [ ] Ready for production

---

## Next Steps

After all tests pass:
1. Deploy to staging environment
2. Test with real doctor accounts
3. Validate generated notes with medical staff
4. Monitor Ollama performance in production
5. Set up alerts for service failures
6. Train doctors on the system
