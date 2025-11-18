const db = require('../config/db');

const PatientModel = {
  // Create patient
  createPatient: async ({
  first_name, last_name, gender, date_of_birth,
    mobile_number, photo, address, pincode, city, state,
    height, weight, blood_group, allergies, chronic_illness
  }) => {
    try {
      const result = await db.query(
        `INSERT INTO patient (
          first_name, last_name, gender, date_of_birth, mobile_number, photo, address,
          pincode, city, state, height, weight, blood_group, allergies, chronic_illness
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8,
          $9, $10, $11, $12, $13, $14, $15
        ) RETURNING *`,
        [
         first_name, last_name, gender, date_of_birth, mobile_number, photo, address,
          pincode, city, state, height, weight, blood_group, allergies, chronic_illness
        ]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to create patient: ${error.message}`);
    }
  },

  // Fetch patients by mobile number
  findPatientsByMobile: async (mobile_number) => {
    try {
      const result = await db.query(
        `SELECT patient_id,first_name, last_name, gender, date_of_birth, photo
         FROM patient
         WHERE mobile_number = $1`,
        [mobile_number]
      );
      return result.rows;
    } catch (error) {
      throw new Error(`Failed to fetch patients: ${error.message}`);
    }
  },

  // Store OTP
  storeOTP: async (mobile_number, otp) => {
    try {
      await db.query(`DELETE FROM otp_verification WHERE mobile_number = $1`, [mobile_number]);
      await db.query(
        `INSERT INTO otp_verification (mobile_number, otp, created_at)
         VALUES ($1, $2, NOW())`,
        [mobile_number, otp]
      );
    } catch (error) {
      throw new Error(`Failed to store OTP: ${error.message}`);
    }
  },

  // Verify OTP (valid for 5 min)
  verifyOTP: async (mobile_number, otp) => {
    try {
      const result = await db.query(
        `SELECT * FROM otp_verification
         WHERE mobile_number = $1 AND otp = $2
           AND created_at >= NOW() - INTERVAL '5 minutes'
         ORDER BY created_at DESC LIMIT 1`,
        [mobile_number, otp]
      );
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`OTP verification failed: ${error.message}`);
    }
  },

  // Find patient by primary key
  findByPk: async (patient_id) => {
    try {
      const result = await db.query(
        `SELECT p.patient_id, p.first_name, p.last_name, p.mobile_number, p.gender, m.age AS medical_history_age
         FROM patient p
         LEFT JOIN medical_history m ON p.patient_id = m.patient_id
         WHERE p.patient_id = $1`,
        [patient_id]
      );
      return result.rows[0];
    } catch (error) {
      throw new Error(`Failed to find patient by ID: ${error.message}`);
    }
  },

  // Alias for findByPk
  findPatientById: async (patient_id) => {
    return PatientModel.findByPk(patient_id);
  }


  
};




module.exports =( PatientModel);