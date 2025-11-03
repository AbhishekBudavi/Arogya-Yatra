const db = require('../config/db');

const createDoctor = async ({ doctor_id, doctor_name, password, about_me }) => {
  try {
    const now = new Date();
    const result = await db.query(
      `INSERT INTO doctor (doctor_id, doctor_name, password, about_me, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [doctor_id, doctor_name, password, about_me, now, now]
    );

    return result.rows[0];
  } catch (error) {
    throw new Error(`Failed to create Doctor: ${error.message}`);
  }
};

const findDoctorById = async (doctor_id) => {
  const result = await db.query(`SELECT * FROM doctor WHERE doctor_id = $1`, [doctor_id]);
  return result.rows[0];
};


module.exports = {
  createDoctor,
  findDoctorById
};
