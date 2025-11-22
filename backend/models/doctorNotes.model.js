const pool = require("../config/db");

const DoctorNotes = {
  /**
   * Create a new doctor note record
   */
  async create(data) {
    const {
      patient_id,
      doctor_id,
      note_type, // "raw_note" or "structured_note"
      raw_input,
      presenting_complaints,
      clinical_interpretation,
      relevant_medical_history,
      lab_report_summary,
      assessment_impression,
      full_structured_note,
      status, // "draft", "pending_review", "approved", "archived"
      lab_reports_used,
      medical_history_used,
    } = data;

    const query = `
      INSERT INTO doctor_notes (
        patient_id, 
        doctor_id, 
        note_type, 
        raw_input, 
        presenting_complaints, 
        clinical_interpretation, 
        relevant_medical_history, 
        lab_report_summary, 
        assessment_impression, 
        full_structured_note,
        status,
        lab_reports_used,
        medical_history_used,
        created_at,
        updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, NOW(), NOW())
      RETURNING *;
    `;

    const values = [
      patient_id,
      doctor_id,
      note_type,
      raw_input,
      presenting_complaints,
      clinical_interpretation,
      relevant_medical_history,
      lab_report_summary,
      assessment_impression,
      full_structured_note,
      status || "draft",
      lab_reports_used || [],
      medical_history_used || [],
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  /**
   * Get all doctor notes for a patient
   */
  async getByPatientId(patient_id) {
    // const patientIdInt = parseInt(patient_id, 10);
    // if (isNaN(patientIdInt)) {
    //   console.warn(`Invalid patient_id: ${patient_id}`);
    //   return [];
    // }
    const query = `
      SELECT * FROM doctor_notes
      WHERE patient_id = $1
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [patient_id]);
    return rows;
  },

  /**
   * Get a specific doctor note by ID
   */
  async getById(note_id) {
    const query = `
      SELECT * FROM doctor_notes
      WHERE id = $1;
    `;
    const { rows } = await pool.query(query, [note_id]);
    return rows[0];
  },

  /**
   * Get notes by doctor ID for a specific patient
   */
  async getByDoctorAndPatient(doctor_id, patient_id) {
    const query = `
      SELECT * FROM doctor_notes
      WHERE doctor_id = $1 AND patient_id = $2
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [doctor_id, patient_id]);
    return rows;
  },

  /**
   * Update a doctor note
   */
  async update(note_id, data) {
    const {
      presenting_complaints,
      clinical_interpretation,
      relevant_medical_history,
      lab_report_summary,
      assessment_impression,
      full_structured_note,
      status,
    } = data;

    const query = `
      UPDATE doctor_notes
      SET 
        presenting_complaints = COALESCE($1, presenting_complaints),
        clinical_interpretation = COALESCE($2, clinical_interpretation),
        relevant_medical_history = COALESCE($3, relevant_medical_history),
        lab_report_summary = COALESCE($4, lab_report_summary),
        assessment_impression = COALESCE($5, assessment_impression),
        full_structured_note = COALESCE($6, full_structured_note),
        status = COALESCE($7, status),
        updated_at = NOW()
      WHERE id = $8
      RETURNING *;
    `;

    const values = [
      presenting_complaints,
      clinical_interpretation,
      relevant_medical_history,
      lab_report_summary,
      assessment_impression,
      full_structured_note,
      status,
      note_id,
    ];

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  /**
   * Delete a doctor note (soft delete by setting status to archived)
   */
  async delete(note_id) {
    const query = `
      UPDATE doctor_notes
      SET status = 'archived', updated_at = NOW()
      WHERE id = $1
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [note_id]);
    return rows[0];
  },

  /**
   * Get approved notes for a patient
   */
  async getApprovedNotes(patient_id) {
    const query = `
      SELECT * FROM doctor_notes
      WHERE patient_id = $1 AND status = 'approved'
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [patient_id]);
    return rows;
  },

  /**
   * Change note status
   */
  async updateStatus(note_id, status) {
    const query = `
      UPDATE doctor_notes
      SET status = $1, updated_at = NOW()
      WHERE id = $2
      RETURNING *;
    `;
    const { rows } = await pool.query(query, [status, note_id]);
    return rows[0];
  },
};

module.exports = DoctorNotes;
