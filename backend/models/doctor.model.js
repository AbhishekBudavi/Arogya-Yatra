
const db = require('../config/db');

const DoctorModel = {
  createDoctor: async ({ custom_doctor_id, hospital_id, first_name, last_name, phone, email, password, specialization, opd_timing, created_by, updated_by }) => {
    try {
 const now = new Date(); // current timestamp

const result = await db.query(
  `INSERT INTO doctor (
   custom_doctor_id, hospital_id, first_name, last_name, phone, email, password, specialization, opd_timing, created_by, updated_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8,
    $9, $10, $11
  ) RETURNING *`,
  [
custom_doctor_id, hospital_id, first_name, last_name, phone, email, password, specialization, opd_timing, created_by, updated_by
  ]
);
      console.log(result.rows[0]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create Doctor: ${error.message}`);
    }
  },
  

  getPatientByPhone: async (phone) => {
    try {
      const result = await db.query('SELECT * FROM patients WHERE phone = $1', [phone]);
      if (!result.rows.length) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get patient: ${error.message}`);
    }
  }
};

module.exports = DoctorModel;