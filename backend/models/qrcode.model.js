const db = require("../config/db");
const QRCodeModel = {
  getPatientById: async (patientId) => {
    const query = 'SELECT patient_id, first_name, last_name FROM patient WHERE patient_id = $1';
    const result = await db.query(query, [patientId]);
    return result.rows[0];
  }
};

module.exports = QRCodeModel;