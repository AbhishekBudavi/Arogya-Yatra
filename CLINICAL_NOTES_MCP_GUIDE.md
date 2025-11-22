# Clinical Note Generation System - MCP/Ollama Integration Guide

## Overview

This system integrates Ollama through an MCP (Model Context Protocol) Server to transform doctor's clinical keywords into structured, professionally formatted medical notes. The flow is:

**Doctor Input → Backend → MCP Server → Ollama AI → Structured Clinical Note → Database**

---

## Architecture

### Components

1. **Frontend** (`FrontEnd/app/...`)
   - Doctor Note Form UI (`note-form/page.jsx`)
   - API Service Client (`utils/doctorNotesAPI.js`)

2. **Backend** (`Backend/...`)
   - Doctor Notes Controller (`controllers/doctorNotes.controller.js`)
   - Doctor Notes Model (`models/doctorNotes.model.js`)
   - Doctor Notes Routes (`routes/doctorNotes.routes.js`)
   - Database Migrations (`migrations/create_doctor_notes_table.sql`)

3. **MCP Server** (`MCP-Server/...`)
   - Clinical Note Generation Tool
   - Ollama Integration
   - Patient Data Aggregation

---

## Setup Instructions

### 1. Database Setup

Execute the migration to create the `doctor_notes` table:

```bash
cd Backend
psql -U postgres -d arogya_yatra -f migrations/create_doctor_notes_table.sql
```

This creates:
- `doctor_notes` table with structured fields for different note sections
- Indexes for fast queries
- Auto-updated timestamp columns
- Foreign key relationships

### 2. Backend Setup

Install dependencies (if not already installed):

```bash
cd Backend
npm install
```

Set environment variables in `.env`:

```env
BACKEND_BASE_URL=http://localhost:5000
DATABASE_URL=postgresql://user:password@localhost:5432/arogya_yatra
JWT_SECRET=your_jwt_secret
MCP_SERVER_URL=http://localhost:3001
PORT=5000
```

### 3. MCP Server Setup

Install dependencies:

```bash
cd MCP-Server
npm install
```

Set environment variables in `.env`:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/arogya_yatra
BACKEND_BASE_URL=http://localhost:5000
BACKEND_API_KEY=your_api_key
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

Start the MCP Server:

```bash
npm run start
```

### 4. Ollama Installation

Install and run Ollama:

```bash
# Download from https://ollama.ai
ollama run llama2  # or your preferred model
```

Verify Ollama is running on `http://localhost:11434`

### 5. Frontend Setup

```bash
cd FrontEnd
npm install
```

Set environment variable:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

---

## Data Flow

### 1. Doctor Submits Input

Doctor enters keywords/notes in the frontend form:

```
"Patient presents with persistent fever for 3 days, headache, body aches, mild cough"
```

### 2. Frontend Makes API Call

```javascript
doctorNotesAPI.generateClinicalNote({
  doctor_id: "DR001",
  patient_id: "PAT001",
  raw_input: "Patient presents with..."
})
```

### 3. Backend Receives Request

**Endpoint:** `POST /api/doctor-notes/generate`

Backend controller:
- Fetches patient's medical history
- Fetches patient's lab reports
- Calls MCP Server with aggregated data

### 4. MCP Server Processes

The MCP server:
- Receives doctor keywords + medical history + lab reports
- Builds comprehensive clinical context
- Calls Ollama with structured prompt
- Parses Ollama's response into structured sections

### 5. Ollama Generates Note

Prompt structure:
```
DOCTOR'S KEYWORDS: [input]
CURRENT SYMPTOMS: [symptoms]
MEDICAL HISTORY: [history]
LAB REPORTS: [reports]

Generate structured JSON with:
- presenting_complaints
- clinical_interpretation
- relevant_medical_history
- lab_report_summary
- assessment_impression
- full_structured_note
```

### 6. Response Saved to Database

Backend saves the structured note with status `pending_review`

### 7. Frontend Displays for Review

Doctor sees formatted note with options:
- **Approve & Save** - Changes status to `approved` and saves to database
- **Reject** - Changes status to `rejected`
- **Regenerate** - Creates new version from same input

---

## API Endpoints

### Doctor Notes Endpoints

#### Generate Clinical Note
```
POST /api/doctor-notes/generate
Content-Type: application/json
Authorization: Bearer [doctor_token]

{
  "doctor_id": "DR001",
  "patient_id": "PAT001",
  "raw_input": "Patient symptoms and observations..."
}

Response:
{
  "success": true,
  "note": {
    "id": 1,
    "patient_id": "PAT001",
    "doctor_id": "DR001",
    "presenting_complaints": "...",
    "clinical_interpretation": "...",
    "relevant_medical_history": "...",
    "lab_report_summary": "...",
    "assessment_impression": "...",
    "full_structured_note": "...",
    "status": "pending_review",
    "created_at": "2025-11-22T10:30:00Z"
  }
}
```

#### Get Patient Notes
```
GET /api/doctor-notes/:patient_id
Authorization: Bearer [doctor_token]
```

#### Get Approved Notes Only
```
GET /api/doctor-notes/approved/:patient_id
Authorization: Bearer [doctor_token]
```

#### Get Specific Note
```
GET /api/doctor-notes/note/:note_id
Authorization: Bearer [doctor_token]
```

#### Approve Note
```
POST /api/doctor-notes/approve/:note_id
Authorization: Bearer [doctor_token]
```

#### Reject Note
```
POST /api/doctor-notes/reject/:note_id
Authorization: Bearer [doctor_token]
```

#### Update Note Content
```
PUT /api/doctor-notes/update/:note_id
Authorization: Bearer [doctor_token]

{
  "presenting_complaints": "Updated...",
  "clinical_interpretation": "Updated...",
  "status": "approved"
}
```

#### Delete/Archive Note
```
DELETE /api/doctor-notes/:note_id
Authorization: Bearer [doctor_token]
```

---

## Database Schema

### doctor_notes Table

| Column | Type | Description |
|--------|------|-------------|
| id | SERIAL | Primary key |
| patient_id | INTEGER | Foreign key to patients table |
| doctor_id | VARCHAR(50) | Doctor identifier |
| note_type | VARCHAR(50) | "raw_note" or "structured_note" |
| raw_input | TEXT | Original doctor input |
| presenting_complaints | TEXT | Generated: main presenting complaint |
| clinical_interpretation | TEXT | Generated: detailed interpretation |
| relevant_medical_history | TEXT | Generated: relevant past history |
| lab_report_summary | TEXT | Generated: summary of lab findings |
| assessment_impression | TEXT | Generated: clinical impression |
| full_structured_note | TEXT | Generated: complete formatted note |
| status | VARCHAR(50) | "draft", "pending_review", "approved", "rejected", "archived" |
| lab_reports_used | INTEGER[] | Array of lab report IDs used |
| medical_history_used | INTEGER[] | Array of medical history IDs used |
| created_at | TIMESTAMP | Creation timestamp |
| updated_at | TIMESTAMP | Last update timestamp |

---

## Frontend API Service

### Usage Example

```javascript
import doctorNotesAPI from "@/app/utils/doctorNotesAPI";

// Generate note
const response = await doctorNotesAPI.generateClinicalNote({
  doctor_id: "DR001",
  patient_id: "PAT001",
  raw_input: "Patient symptoms..."
});

// Approve note
await doctorNotesAPI.approveNote(noteId);

// Get patient notes
const notes = await doctorNotesAPI.getPatientNotes(patientId);

// Get approved notes only
const approvedNotes = await doctorNotesAPI.getApprovedNotes(patientId);
```

---

## Output Format

### Structured Clinical Note Response

```json
{
  "presenting_complaints": "Patient presents with a 3-day history of high-grade fever, headache, generalized body aches, and a mild persistent cough.",
  
  "clinical_interpretation": "The constellation of symptoms suggests a viral respiratory infection, possibly influenza or upper respiratory tract infection. The fever has been persistent for 3 days indicating ongoing infection. Associated headache and body aches are common in viral infections.",
  
  "relevant_medical_history": "No significant chronic conditions reported. Current medications include routine pain relievers as needed. Past medical history is unremarkable.",
  
  "lab_report_summary": "Recent lab reports show slightly elevated white blood cell count (11,500/μL) suggesting active infection. C-reactive protein elevated at 8 mg/L. Other parameters within normal limits.",
  
  "assessment_impression": "Clinical diagnosis consistent with acute viral respiratory infection, likely influenza. Patient is hemodynamically stable with no signs of respiratory distress.",
  
  "full_structured_note": "Complete professional medical note combining all sections in narrative format..."
}
```

---

## Important Notes

### Security & Compliance

1. **Patient Safety**: AI-generated notes should be reviewed by doctors before use in clinical practice
2. **No Hallucinations**: Prompt is designed to use only provided data
3. **Authentication**: All endpoints require JWT authentication
4. **Data Privacy**: Medical data is encrypted in transit and at rest

### Performance

- MCP Server caches Ollama model in memory
- Temperature set to 0.3 for consistent clinical output
- 30-second timeout for note generation
- Database indexes for fast queries

### Troubleshooting

**Ollama not responding:**
```bash
ollama serve  # Start Ollama service if not running
```

**MCP Server connection failed:**
- Check `MCP_SERVER_URL` environment variable
- Verify MCP Server is running: `npm run start`
- Check network connectivity

**Database errors:**
- Verify PostgreSQL is running
- Check `DATABASE_URL` format
- Run migration: `psql -d arogya_yatra -f migrations/create_doctor_notes_table.sql`

---

## File Structure

```
Backend/
├── controllers/
│   └── doctorNotes.controller.js      # API handlers
├── models/
│   └── doctorNotes.model.js           # Database operations
├── routes/
│   └── doctorNotes.routes.js          # Route definitions
├── migrations/
│   └── create_doctor_notes_table.sql  # Database schema
└── server.js                          # Added: doctorNotes routes

FrontEnd/
├── app/
│   ├── (dashboard)/
│   │   └── dashboard/patient/records/doctor-notes/
│   │       └── note-form/
│   │           └── page.jsx           # Updated: MCP integration
│   └── utils/
│       └── doctorNotesAPI.js          # API client service
└── .env.local                         # NEXT_PUBLIC_API_URL

MCP-Server/
├── src/
│   ├── index.ts                       # Updated: generateClinicalNote tool
│   └── types/
│       └── mcp.d.ts
├── .env                               # Ollama + Backend config
└── package.json
```

---

## Next Steps

1. **Test the Integration**
   - Start all services
   - Submit a test note
   - Verify output in database

2. **Monitor Performance**
   - Track AI response times
   - Monitor database queries
   - Check Ollama resource usage

3. **Customize Prompts**
   - Modify `buildPromptForClinicialNote()` in MCP-Server/src/index.ts
   - Adjust temperature/model based on needs
   - Add specialized prompts for different medical domains

4. **Implement Analytics**
   - Track note generation frequency
   - Monitor approval rates
   - Analyze doctor feedback

---

## Support

For issues or questions:
1. Check logs in terminal
2. Verify all services are running
3. Test each layer independently (Frontend → Backend → MCP → Ollama)
4. Check environment variables and database connection
