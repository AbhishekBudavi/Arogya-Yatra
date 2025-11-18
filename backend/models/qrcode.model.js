const db = require("../config/db");
const QRCodeModel = {
  getPatientById: async (patientId) => {
    const query = 'SELECT p.patient_id, p.first_name, p.last_name,  m.age as medical_history_age FROM patient p LEFT JOIN medical_history m ON p.patient_id = m.patient_id WHERE p.patient_id = $1';
    const result = await db.query(query, [patientId]);
    return result.rows[0];
  }
};

module.exports = QRCodeModel;