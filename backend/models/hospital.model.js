const db = require('../config/db');

const HospitalModel = {
  createHospital: async ({ custom_hospital_id, hospital_name, hospital_type, address, pincode, city, state, country, admin_name, admin_mobile_number, password, created_by, updated_by }) => {
    try {
 const now = new Date(); // Currnet Time 

const result = await db.query(
  `INSERT INTO hospital (
   custom_hospital_id, hospital_name, hospital_type, address, pincode, city, state, country, admin_name, admin_mobile_number, password, created_by, updated_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8,
    $9, $10, $11, $12, $13
  ) RETURNING *`,
  [
custom_hospital_id, hospital_name, hospital_type, address, pincode, city, state, country, admin_name, admin_mobile_number, password, created_by, updated_by
  ]
);
      console.log(result.rows[0]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create Hospital: ${error.message}`);
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

module.exports = HospitalModel;