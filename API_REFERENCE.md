# Clinical Note API Reference Card

## Base URL
```
http://localhost:5000
Production: https://api.your-domain.com
```

## Authentication
All endpoints require JWT token in Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## 🟢 Endpoints

### 1. Generate Clinical Note
```http
POST /api/doctor-notes/generate
Content-Type: application/json

{
  "doctor_id": "DR001",
  "patient_id": "PAT001",
  "raw_input": "Patient symptoms and observations"
}

Response: 201 Created
{
  "success": true,
  "message": "Clinical note generated successfully",
  "note": {
    "id": 42,
    "patient_id": "PAT001",
    "status": "pending_review",
    "presenting_complaints": "...",
    "clinical_interpretation": "...",
    "relevant_medical_history": "...",
    "lab_report_summary": "...",
    "assessment_impression": "...",
    "full_structured_note": "...",
    "created_at": "2025-11-22T10:30:00Z"
  }
}
```

---

### 2. Get All Patient Notes
```http
GET /api/doctor-notes/:patient_id

Response: 200 OK
{
  "success": true,
  "notes": [
    {
      "id": 42,
      "patient_id": "PAT001",
      "status": "approved",
      "created_at": "2025-11-22T10:30:00Z"
    },
    {
      "id": 41,
      "patient_id": "PAT001",
      "status": "rejected",
      "created_at": "2025-11-21T14:20:00Z"
    }
  ],
  "count": 2
}
```

---

### 3. Get Approved Notes Only
```http
GET /api/doctor-notes/approved/:patient_id

Response: 200 OK
{
  "success": true,
  "notes": [
    {
      "id": 42,
      "patient_id": "PAT001",
      "status": "approved",
      "full_structured_note": "...",
      "created_at": "2025-11-22T10:30:00Z"
    }
  ],
  "count": 1
}
```

---

### 4. Get Specific Note
```http
GET /api/doctor-notes/note/:note_id

Response: 200 OK
{
  "success": true,
  "note": {
    "id": 42,
    "patient_id": "PAT001",
    "doctor_id": "DR001",
    "note_type": "structured_note",
    "raw_input": "...",
    "presenting_complaints": "...",
    "clinical_interpretation": "...",
    "relevant_medical_history": "...",
    "lab_report_summary": "...",
    "assessment_impression": "...",
    "full_structured_note": "...",
    "status": "approved",
    "lab_reports_used": [1, 2],
    "medical_history_used": [1],
    "created_at": "2025-11-22T10:30:00Z",
    "updated_at": "2025-11-22T10:30:00Z"
  }
}

Error: 404 Not Found
{
  "error": "Note not found"
}
```

---

### 5. Approve Note
```http
POST /api/doctor-notes/approve/:note_id

Response: 200 OK
{
  "success": true,
  "message": "Note approved successfully",
  "note": {
    "id": 42,
    "status": "approved",
    "updated_at": "2025-11-22T10:35:00Z"
  }
}
```

---

### 6. Reject Note
```http
POST /api/doctor-notes/reject/:note_id

Response: 200 OK
{
  "success": true,
  "message": "Note rejected successfully",
  "note": {
    "id": 42,
    "status": "rejected",
    "updated_at": "2025-11-22T10:35:00Z"
  }
}
```

---

### 7. Update Note Content
```http
PUT /api/doctor-notes/update/:note_id
Content-Type: application/json

{
  "presenting_complaints": "Updated complaint text",
  "clinical_interpretation": "Updated interpretation",
  "relevant_medical_history": "Updated history",
  "lab_report_summary": "Updated lab summary",
  "assessment_impression": "Updated assessment",
  "full_structured_note": "Updated full note",
  "status": "approved"
}

Response: 200 OK
{
  "success": true,
  "message": "Note updated successfully",
  "note": {
    "id": 42,
    "status": "approved",
    "presenting_complaints": "Updated complaint text",
    "updated_at": "2025-11-22T10:40:00Z"
  }
}
```

---

### 8. Delete/Archive Note
```http
DELETE /api/doctor-notes/:note_id

Response: 200 OK
{
  "success": true,
  "message": "Note archived successfully",
  "note": {
    "id": 42,
    "status": "archived",
    "updated_at": "2025-11-22T10:45:00Z"
  }
}
```

---

## 📊 Status Values

| Status | Meaning | Next Action |
|--------|---------|------------|
| `draft` | Initial creation | Approve or Reject |
| `pending_review` | Awaiting doctor approval | Approve, Reject, or Update |
| `approved` | Approved and saved | View or Update |
| `rejected` | Rejected by doctor | Regenerate or Update |
| `archived` | Deleted/archived | Cannot be used |

---

## 🔴 Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields: doctor_id, patient_id, raw_input"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid or missing authentication token"
}
```

### 404 Not Found
```json
{
  "error": "Note not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Failed to generate clinical note",
  "details": "Ollama connection timeout"
}
```

---

## 💻 JavaScript Client Examples

### Using fetch()

#### Generate Note
```javascript
const response = await fetch('http://localhost:5000/api/doctor-notes/generate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  credentials: 'include',
  body: JSON.stringify({
    doctor_id: 'DR001',
    patient_id: 'PAT001',
    raw_input: 'Fever, cough, fatigue'
  })
});

const data = await response.json();
console.log(data.note);
```

#### Get Notes
```javascript
const response = await fetch('http://localhost:5000/api/doctor-notes/PAT001', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  credentials: 'include'
});

const data = await response.json();
data.notes.forEach(note => console.log(note));
```

#### Approve Note
```javascript
const response = await fetch(`http://localhost:5000/api/doctor-notes/approve/${noteId}`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`
  },
  credentials: 'include'
});

const data = await response.json();
console.log('Note approved:', data.note.status);
```

---

### Using doctorNotesAPI Service

```javascript
import doctorNotesAPI from "@/app/utils/doctorNotesAPI";

// Generate
const result = await doctorNotesAPI.generateClinicalNote({
  doctor_id: "DR001",
  patient_id: "PAT001",
  raw_input: "Patient observations"
});
console.log(result.note.id);

// Get all notes
const notes = await doctorNotesAPI.getPatientNotes("PAT001");
console.log(notes.notes);

// Approve
await doctorNotesAPI.approveNote(noteId);

// Reject
await doctorNotesAPI.rejectNote(noteId);

// Get approved only
const approved = await doctorNotesAPI.getApprovedNotes("PAT001");
console.log(approved.notes);
```

---

## 🔑 Required Headers

```http
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

---

## ⏱️ Timeouts & Limits

| Item | Value |
|------|-------|
| Note Generation | 30 seconds |
| API Response | 60 seconds |
| Request Size | 10 MB |
| Max Notes per Query | 100 |
| Database Query | 5 seconds |

---

## 📈 Rate Limiting (Production)

```
Limit: 100 requests per minute per API key
Status: 429 Too Many Requests

X-RateLimit-Limit: 100
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1669101600
```

---

## 🧪 cURL Examples

### Generate Note
```bash
curl -X POST http://localhost:5000/api/doctor-notes/generate \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "doctor_id": "DR001",
    "patient_id": "PAT001",
    "raw_input": "Fever 3 days, headache"
  }'
```

### Get Patient Notes
```bash
curl -X GET http://localhost:5000/api/doctor-notes/PAT001 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Approve Note
```bash
curl -X POST http://localhost:5000/api/doctor-notes/approve/42 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Note
```bash
curl -X PUT http://localhost:5000/api/doctor-notes/update/42 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "presenting_complaints": "Updated text",
    "status": "approved"
  }'
```

---

## 📝 Note Structure

### Input
- `doctor_id`: String (required) - Doctor identifier
- `patient_id`: String (required) - Patient identifier  
- `raw_input`: String (required) - Doctor's keywords/observations

### Output Sections
- `presenting_complaints`: Main issue description
- `clinical_interpretation`: Detailed medical explanation
- `relevant_medical_history`: Past medical context
- `lab_report_summary`: Lab findings summary
- `assessment_impression`: Clinical impression
- `full_structured_note`: Complete professional note

---

## 🔒 Authentication Flow

```
1. Doctor logs in → Receives JWT token
2. Include token in Authorization header
3. API validates token
4. Request processed
5. Response returned
```

---

## 📞 Support

- Documentation: `CLINICAL_NOTES_MCP_GUIDE.md`
- Quick Start: `CLINICAL_NOTES_QUICK_START.md`
- Configuration: `CONFIGURATION_EXAMPLES.md`
- Repository: Your Git repository

---

**Last Updated:** November 22, 2025  
**API Version:** 1.0.0  
**Status:** Production Ready
