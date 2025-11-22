const DoctorNotes = require("../models/doctorNotes.model");
const MedicalHistory = require("../models/medicalHistory.model");
const {
  getCompleteClinicalData,
  formatMedicalHistory,
  formatLabReports,
  formatPrescriptions,
} = require("../utils/clinicalDataRetrieval");
const axios = require("axios");

/**
 * Generate structured clinical note using Ollama via MCP server
 * 
 * Flow:
 * 1. Validate request input (doctor_id, patient_id, raw_input)
 * 2. Fetch comprehensive clinical data (medical history, lab reports, documents)
 * 3. Format clinical context for Ollama prompt
 * 4. Call MCP server to generate medically accurate note
 * 5. Save generated note to database with pending_review status
 * 6. Return structured output to frontend
 */
const generateStructuredNote = async (req, res) => {
  try {
    const { doctor_id, patient_id, raw_input, current_symptoms, additional_notes } = req.body;

    // Validate required fields
    if (!doctor_id || !patient_id || !raw_input) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
        required: ["doctor_id", "patient_id", "raw_input"],
      });
    }

    // Validate input types and length
    if (typeof raw_input !== "string" || raw_input.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: "raw_input must be a non-empty string containing doctor's keywords or observations",
      });
    }

    console.log(`\n📋 Generating clinical note for Patient: ${patient_id}, Doctor: ${doctor_id}`);

    // Fetch comprehensive clinical data
    console.log("📂 Fetching patient clinical data...");
    const clinicalData = await getCompleteClinicalData(patient_id);

    // Format data for Ollama prompt
    const medicalHistoryFormatted = formatMedicalHistory(clinicalData.medicalHistory);
    const labReportsFormatted = formatLabReports(clinicalData.labReports);
    const prescriptionsFormatted = formatPrescriptions(clinicalData.prescriptions);

    // Prepare comprehensive input for MCP server
    const mcpInput = {
      doctor_keywords: raw_input,
      medical_history: clinicalData.medicalHistory
        ? JSON.stringify(clinicalData.medicalHistory)
        : null,
      lab_reports: clinicalData.labReports.length > 0
        ? JSON.stringify(clinicalData.labReports)
        : null,
      current_symptoms: current_symptoms || null,
      additional_notes:
        additional_notes || `Patient Blood Group: ${clinicalData.basicInfo?.blood_group || "Unknown"}, Age: ${clinicalData.basicInfo?.age || "Unknown"}`,
    };

    console.log("🤖 Calling MCP server (Ollama) to generate clinical note...");
    console.log("⏳ Processing with Ollama (this may take 30-60 seconds)...");

    // Call MCP server endpoint with timeout handling
    let mcpResponse;
    try {
      mcpResponse = await axios.post(
        `${process.env.MCP_SERVER_URL || "http://localhost:3001"}/api/generate-clinical-note`,
        mcpInput,
        {
          timeout: 900000, // 5 minutes timeout for Ollama processing
        }
      );
    } catch (err) {
      console.error("❌ MCP Server error:", err.message);
      if (err.code === "ECONNREFUSED") {
        return res.status(503).json({
          success: false,
          error: "MCP server (Ollama) is not running",
          details: "Ensure the MCP server and Ollama are started",
          solution: "npm run dev (in MCP-Server directory) and ollama serve",
        });
      }
      throw err;
    }

    if (!mcpResponse.data || !mcpResponse.data.structured_output) {
      throw new Error("Invalid response from MCP server - missing structured_output");
    }

    console.log("✅ Ollama processing complete");

    const {
      structured_output: {
        presenting_complaints,
        clinical_interpretation,
        relevant_medical_history,
        lab_report_summary,
        assessment_impression,
        full_structured_note,
      },
    } = mcpResponse.data;

    // Validate that structured output contains required fields
    if (!full_structured_note || full_structured_note.trim().length === 0) {
      throw new Error("Generated note is empty - Ollama may not be functioning correctly");
    }

    console.log("💾 Saving generated note to database...");

    // Save the generated note to database
    const savedNote = await DoctorNotes.create({
      patient_id,
      doctor_id,
      note_type: "structured_note",
      raw_input,
      presenting_complaints: presenting_complaints || "",
      clinical_interpretation: clinical_interpretation || "",
      relevant_medical_history: relevant_medical_history || "",
      lab_report_summary: lab_report_summary || "",
      assessment_impression: assessment_impression || "",
      full_structured_note,
      status: "pending_review",
      lab_reports_used: clinicalData.labReports.map((r) => r.id).filter(Boolean),
      medical_history_used: clinicalData.medicalHistory
        ? [clinicalData.medicalHistory.id]
        : [],
    });

    console.log(`✅ Clinical note saved with ID: ${savedNote.id}`);

    res.status(201).json({
      success: true,
      message: "Clinical note generated and saved successfully",
      note: {
        id: savedNote.id,
        patient_id: savedNote.patient_id,
        doctor_id: savedNote.doctor_id,
        status: savedNote.status,
        presenting_complaints: savedNote.presenting_complaints,
        clinical_interpretation: savedNote.clinical_interpretation,
        relevant_medical_history: savedNote.relevant_medical_history,
        lab_report_summary: savedNote.lab_report_summary,
        assessment_impression: savedNote.assessment_impression,
        full_structured_note: savedNote.full_structured_note,
        created_at: savedNote.created_at,
      },
    });
  } catch (err) {
    console.error("❌ Error generating clinical note:", err.message);
    res.status(500).json({
      success: false,
      error: "Failed to generate clinical note",
      details: err.message,
      trace: process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
  }
};

/**
 * Get all doctor notes for a patient
 */
const getPatientNotes = async (req, res) => {
  try {
    const { patient_id } = req.params;

    if (!patient_id) {
      return res.status(400).json({ error: "patient_id is required" });
    }

    const notes = await DoctorNotes.getByPatientId(patient_id);

    res.json({
      success: true,
      notes,
      count: notes.length,
    });
  } catch (err) {
    console.error("Error fetching patient notes:", err);
    res.status(500).json({ error: "Failed to fetch patient notes" });
  }
};

/**
 * Get a specific note by ID
 */
const getNoteById = async (req, res) => {
  try {
    const { note_id } = req.params;

    if (!note_id) {
      return res.status(400).json({ error: "note_id is required" });
    }

    const note = await DoctorNotes.getById(note_id);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({
      success: true,
      note,
    });
  } catch (err) {
    console.error("Error fetching note:", err);
    res.status(500).json({ error: "Failed to fetch note" });
  }
};

/**
 * Approve a note (change status to approved)
 */
const approveNote = async (req, res) => {
  try {
    const { note_id } = req.params;

    if (!note_id) {
      return res.status(400).json({ error: "note_id is required" });
    }

    const updatedNote = await DoctorNotes.updateStatus(note_id, "approved");

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({
      success: true,
      message: "Note approved successfully",
      note: updatedNote,
    });
  } catch (err) {
    console.error("Error approving note:", err);
    res.status(500).json({ error: "Failed to approve note" });
  }
};

/**
 * Reject a note (change status to rejected)
 */
const rejectNote = async (req, res) => {
  try {
    const { note_id } = req.params;

    if (!note_id) {
      return res.status(400).json({ error: "note_id is required" });
    }

    const updatedNote = await DoctorNotes.updateStatus(note_id, "rejected");

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({
      success: true,
      message: "Note rejected successfully",
      note: updatedNote,
    });
  } catch (err) {
    console.error("Error rejecting note:", err);
    res.status(500).json({ error: "Failed to reject note" });
  }
};

/**
 * Update a note's content
 */
const updateNote = async (req, res) => {
  try {
    const { note_id } = req.params;
    const {
      presenting_complaints,
      clinical_interpretation,
      relevant_medical_history,
      lab_report_summary,
      assessment_impression,
      full_structured_note,
      status,
    } = req.body;

    if (!note_id) {
      return res.status(400).json({ error: "note_id is required" });
    }

    const updatedNote = await DoctorNotes.update(note_id, {
      presenting_complaints,
      clinical_interpretation,
      relevant_medical_history,
      lab_report_summary,
      assessment_impression,
      full_structured_note,
      status,
    });

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({
      success: true,
      message: "Note updated successfully",
      note: updatedNote,
    });
  } catch (err) {
    console.error("Error updating note:", err);
    res.status(500).json({ error: "Failed to update note" });
  }
};

/**
 * Delete a note (archive it)
 */
const deleteNote = async (req, res) => {
  try {
    const { note_id } = req.params;

    if (!note_id) {
      return res.status(400).json({ error: "note_id is required" });
    }

    const deletedNote = await DoctorNotes.delete(note_id);

    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json({
      success: true,
      message: "Note archived successfully",
      note: deletedNote,
    });
  } catch (err) {
    console.error("Error deleting note:", err);
    res.status(500).json({ error: "Failed to delete note" });
  }
};

/**
 * Get approved notes for a patient
 */
const getApprovedNotes = async (req, res) => {
  try {
    const { patient_id } = req.params;

    if (!patient_id) {
      return res.status(400).json({ error: "patient_id is required" });
    }

    const notes = await DoctorNotes.getApprovedNotes(patient_id);

    res.json({
      success: true,
      notes,
      count: notes.length,
    });
  } catch (err) {
    console.error("Error fetching approved notes:", err);
    res.status(500).json({ error: "Failed to fetch approved notes" });
  }
};

module.exports = {
  generateStructuredNote,
  getPatientNotes,
  getNoteById,
  approveNote,
  rejectNote,
  updateNote,
  deleteNote,
  getApprovedNotes,
};
