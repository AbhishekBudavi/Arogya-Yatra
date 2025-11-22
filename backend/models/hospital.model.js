const db = require('../config/db');

const HospitalModel = {
  createHospital: async ({ custom_hospital_id, hospital_name, hospital_type, address, pincode, city, state, country, admin_name, admin_mobile_number, password, email, departments, bed_count, icu_available, emergency_services, created_by, updated_by }) => {
    try {
      const result = await db.query(
        `INSERT INTO hospitals (
         custom_hospital_id, hospital_name, hospital_type, address, pincode, city, state, country, admin_name, admin_mobile_number, password, email, departments, bed_count, icu_available, emergency_services, created_by, updated_by
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
        ) RETURNING hospital_id, custom_hospital_id, hospital_name, admin_name, admin_mobile_number, email, created_at`,
        [
          custom_hospital_id, hospital_name, hospital_type, address, pincode, city, state, country, admin_name, admin_mobile_number, password, email, departments, bed_count, icu_available, emergency_services, created_by, updated_by
        ]
      );
      console.log('Hospital created:', result.rows[0]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create Hospital: ${error.message}`);
    }
  },

  getHospitalByMobileNumber: async (mobile_number) => {
    try {
      const result = await db.query('SELECT * FROM hospitals WHERE admin_mobile_number = $1', [mobile_number]);
      if (!result.rows.length) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get hospital: ${error.message}`);
    }
  },

  getHospitalById: async (hospital_id) => {
    try {
      const result = await db.query('SELECT * FROM hospitals WHERE hospital_id = $1', [hospital_id]);
      if (!result.rows.length) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get hospital: ${error.message}`);
    }
  },

  getHospitalByCustomId: async (custom_hospital_id) => {
    try {
      const result = await db.query('SELECT * FROM hospitals WHERE custom_hospital_id = $1', [custom_hospital_id]);
      if (!result.rows.length) {
        return null;
      }
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to get hospital: ${error.message}`);
    }
  }
};

module.exports = HospitalModel;