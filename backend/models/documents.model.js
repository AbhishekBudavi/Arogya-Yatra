const pool = require("../config/db");

// Insert new document
const createDocument = async (doc) => {
  const {
    document_id,
    document_name,
    document_url, 
    document_type,
    document_data, 
    patient_id,
    created_by,
    updated_by,
  } = doc;

  const result = await pool.query(
    `INSERT INTO documents 
      (document_id,document_name, document_url, document_type, document_data, patient_id, created_by, updated_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [document_id ,document_name, document_url, document_type, document_data, patient_id, created_by, updated_by]
  );

  return result.rows[0];
};

// Fetch all documents for a patient
const getDocumentsByPatient = async (patient_id) => {
  const result = await pool.query(
    "SELECT * FROM documents WHERE patient_id = $1",
    [patient_id]
  );
  return result.rows;
};

async function updateDocumentById(id, fields) {
  const { document_name, document_type, document_url, document_data, updated_by } = fields;

  const result = await pool.query(
    `UPDATE documents 
     SET document_name = COALESCE($1, document_name),
         document_type = COALESCE($2, document_type),
         document_url = COALESCE($3, document_url),
         document_data = COALESCE($4, document_data),
         updated_by = $5,
         updated_at = NOW()
     WHERE id = $6
     RETURNING *`,
    [document_name, document_type, document_url, document_data, updated_by, id]
  );

  return result.rows[0];
}

async function deleteDocumentById(id, patient_id) {
  const result = await pool.query(
    `DELETE FROM documents 
     WHERE id = $1 AND patient_id = $2 
     RETURNING *`,
    [id, patient_id]
  );
  return result.rows[0];
}



const countDocumentsByType = async (patientId) => {
  const query = `
    SELECT
      COUNT(*) FILTER (WHERE document_type = 'labReport') AS "labReport",
      COUNT(*) FILTER (WHERE document_type = 'prescription') AS "prescription",
      COUNT(*) FILTER (WHERE document_type = 'medicalExpenses') AS "medicalExpenses",
      COUNT(*) FILTER (WHERE document_type = 'vaccination') AS "vaccination"
    FROM documents
    WHERE patient_id = $1;
  `;

  const { rows } = await pool.query(query, [patientId]);
  return rows[0];
};

module.exports = { countDocumentsByType };




module.exports = {
  createDocument,
  getDocumentsByPatient,
  updateDocumentById,
  deleteDocumentById,
  countDocumentsByType
};
