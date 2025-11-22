const express = require("express");
const {
  generateStructuredNote,
  getPatientNotes,
  getNoteById,
  approveNote,
  rejectNote,
  updateNote,
  deleteNote,
  getApprovedNotes,
} = require("../controllers/doctorNotes.controller");
const { verifyJWT } = require("../middlewares/verifyJWT");
const { validateClinicalNoteGeneration, validateNoteAction } = require("../middlewares/validateDoctorNotes");

const router = express.Router();

/**
 * POST /api/doctor-notes/generate
 * Generate a new structured clinical note using Ollama/MCP
 * 
 * Required fields in request body:
 * - doctor_id: string (UUID or ID of the doctor)
 * - patient_id: string (UUID or ID of the patient)
 * - raw_input: string (doctor's keywords, observations, or notes - minimum 10 characters)
 * 
 * Optional fields:
 * - current_symptoms: string (patient's reported current symptoms)
 * - additional_notes: string (any additional clinical observations)
 * 
 * Response:
 * - success: boolean
 * - message: string
 * - note: object with structured clinical note fields
 *   - id: note ID in database
 *   - presenting_complaints
 *   - clinical_interpretation
 *   - relevant_medical_history
 *   - lab_report_summary
 *   - assessment_impression
 *   - full_structured_note
 *   - status: 'pending_review'
 *   - created_at: timestamp
 */
/**
 * POST /api/doctor-notes/generate
 * Generate a new structured clinical note using Ollama/MCP
 */
router.post(
  "/generate",
  verifyJWT("doctor"),
  validateClinicalNoteGeneration,
  generateStructuredNote
);

/**
 * GET /api/doctor-notes/note/:note_id
 * Get a specific note by ID
 */
router.get("/note/:note_id", verifyJWT("doctor"), getNoteById);

/**
 * GET /api/doctor-notes/approved/:patient_id
 * Get only approved notes for a patient
 */
router.get("/approved/:patient_id", verifyJWT("doctor"), getApprovedNotes);

/**
 * GET /api/doctor-notes/:patient_id
 * Get all notes (including drafts, pending review, approved) for a specific patient
 */
router.get("/:patient_id", verifyJWT("doctor"), getPatientNotes);

/**
 * POST /api/doctor-notes/approve/:note_id
 * Approve a pending clinical note (changes status to 'approved')
 */
router.post("/approve/:note_id", verifyJWT("doctor"), validateNoteAction, approveNote);

/**
 * POST /api/doctor-notes/reject/:note_id
 * Reject a pending clinical note (changes status to 'rejected')
 */
router.post("/reject/:note_id", verifyJWT("doctor"), validateNoteAction, rejectNote);

/**
 * PUT /api/doctor-notes/update/:note_id
 * Update note content and status
 */
router.put("/update/:note_id", verifyJWT("doctor"), updateNote);

/**
 * DELETE /api/doctor-notes/:note_id
 * Archive/delete a note (soft delete - changes status to 'archived')
 */
router.delete("/:note_id", verifyJWT("doctor"), deleteNote);

module.exports = router;
