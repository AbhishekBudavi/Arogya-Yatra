const pool = require("../config/db");

// Fetch only Lab Reports
const getExpensesDetailByPatient = async (patient_id) => {
  const result = await pool.query(
    "SELECT * FROM documents WHERE patient_id = $1 AND document_type = 'medicalExpenses' ORDER BY created_at DESC",
    [patient_id]
  );
  return result.rows;
};

module.exports = {
  getExpensesDetailByPatient,
};
