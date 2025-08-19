// models/document.model.js
const db = require('../config/db');
const pool = require('../config/db');
// Insert a new document for a patient
async function createDocument({ patient_id, document_name, document_url, document_category, document_data, created_by,
      updated_by }) {
  const query = `
    INSERT INTO documents (
      patient_id,
      document_name,
      document_url,
      document_category,
      document_data,
      created_by,
      updated_by
    ) VALUES ($1, $2, $3, $4, $5,$6,$7)
    RETURNING *;
  `;

  const values = [
    patient_id,
    document_name,
    document_url,
    document_category,
    document_data ? JSON.stringify(document_data) : null,
    created_by,
    updated_by
  ];

  const { rows } = await pool.query(query, values);
  return rows[0];
}

// Fetch all documents for a specific patient
async function getDocumentsByPatient(patient_id) {
  const query = `
    SELECT *
    FROM documents
    WHERE patient_id = $1
    ORDER BY created_at DESC;
  `;
  const { rows } = await pool.query(query, [patient_id]);
  return rows;
}

module.exports = {
  createDocument,
  getDocumentsByPatient
};
