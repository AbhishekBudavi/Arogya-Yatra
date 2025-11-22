const db = require('../config/db');

const findDoctorById = async (doctor_id) => {
  const result = await db.query(`SELECT * FROM doctor WHERE doctor_id = $1`, [doctor_id]);
  return result.rows[0];
};

// Find doctor by license ID
const findDoctorByLicenseId = async (license_id) => {
  const result = await db.query(`SELECT * FROM doctor WHERE license_id = $1`, [license_id]);
  return result.rows[0];
};

// Add doctor to hospital with availability slots
const addDoctorToHospital = async ({ doctor_id, hospital_id, doctor_name, specialization, email, phone, license_id, availability }) => {
  try {
    // Generate a temporary password if not provided (doctors registered by hospitals)
    const tempPassword = require('bcrypt').hashSync(doctor_id + Date.now(), 10);
    
    // First, insert or get the doctor
    const doctorResult = await db.query(
      `INSERT INTO doctor (doctor_id, doctor_name, specialization, email, phone, password, hospital_id, license_id, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
       ON CONFLICT (doctor_id) DO UPDATE SET 
       doctor_name = $2, specialization = $3, email = $4, phone = $5, hospital_id = $7, license_id = $8, updated_at = NOW()
       RETURNING *`,
      [doctor_id, doctor_name, specialization, email, phone, tempPassword, hospital_id, license_id]
    );

    const doctor = doctorResult.rows[0];

    // Create or update doctor-hospital relationship
    const dhResult = await db.query(
      `INSERT INTO doctor_hospital (doctor_id, hospital_id, license_id, created_at, updated_at)
       VALUES ($1, $2, $3, NOW(), NOW())
       ON CONFLICT (doctor_id, hospital_id) DO UPDATE SET 
       license_id = $3, updated_at = NOW()
       RETURNING *`,
      [doctor_id, hospital_id, license_id]
    );

    // Insert availability slots
    if (availability && availability.length > 0) {
      // First delete existing availability
      await db.query(
        `DELETE FROM doctor_availability WHERE doctor_id = $1 AND hospital_id = $2`,
        [doctor_id, hospital_id]
      );

      // Insert new availability
      for (const slot of availability) {
        await db.query(
          `INSERT INTO doctor_availability (doctor_id, hospital_id, day_of_week, start_time, end_time, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW())`,
          [doctor_id, hospital_id, slot.day, slot.startTime, slot.endTime]
        );
      }
    }

    return doctor;
  } catch (error) {
    throw new Error(`Failed to add doctor to hospital: ${error.message}`);
  }
};

// Get doctor availability for a specific hospital
const getDoctorAvailability = async (doctor_id, hospital_id) => {
  try {
    const result = await db.query(
      `SELECT availability_id, doctor_id, hospital_id, day_of_week, start_time, end_time 
       FROM doctor_availability 
       WHERE doctor_id = $1 AND hospital_id = $2 AND is_active = true
       ORDER BY day_of_week`,
      [doctor_id, hospital_id]
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to get doctor availability: ${error.message}`);
  }
};

// Get doctor with availability for a hospital
const getDoctorWithAvailability = async (doctor_id, hospital_id) => {
  try {
    const doctorResult = await db.query(
      `SELECT d.*, dh.license_id, h.hospital_name
       FROM doctor d
       LEFT JOIN doctor_hospital dh ON d.doctor_id = dh.doctor_id AND dh.hospital_id = $2
       LEFT JOIN hospitals h ON h.hospital_id = dh.hospital_id
       WHERE d.doctor_id = $1`,
      [doctor_id, hospital_id]
    );

    if (!doctorResult.rows[0]) {
      return null;
    }

    const doctor = doctorResult.rows[0];
    const availability = await getDoctorAvailability(doctor_id, hospital_id);
    
    return {
      ...doctor,
      availability
    };
  } catch (error) {
    throw new Error(`Failed to get doctor with availability: ${error.message}`);
  }
};

// Get all doctors for a hospital
const getDoctorsByHospital = async (hospital_id) => {
  try {
    const result = await db.query(
      `SELECT d.*, dh.license_id
       FROM doctor d
       INNER JOIN doctor_hospital dh ON d.doctor_id = dh.doctor_id
       WHERE dh.hospital_id = $1 AND dh.is_active = true
       ORDER BY d.doctor_name`,
      [hospital_id]
    );
    return result.rows;
  } catch (error) {
    throw new Error(`Failed to get doctors by hospital: ${error.message}`);
  }
};


module.exports = {
  findDoctorById,
  findDoctorByLicenseId,
  addDoctorToHospital,
  getDoctorAvailability,
  getDoctorWithAvailability,
  getDoctorsByHospital
};
