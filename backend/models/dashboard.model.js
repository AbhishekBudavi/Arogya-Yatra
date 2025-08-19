const db = require('../config/db');

const getPatientDetail = async (patient_id) => {
  try {
    const result = await db.query(
      `SELECT first_name, last_name, photo FROM patient WHERE patient_id = $1`,
      [patient_id]
    );
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

async function logDashboardVisit(patientId) {
  const query = 'INSERT INTO dashboard_visits (patient_id) VALUES ($1)';
  await db.query(query, [patientId]); // ✅ Use db instead of pool
}

async function getRecentVisits(patientId, limit = 10) {
  const query = `
    SELECT visited_at
    FROM dashboard_visits
    WHERE patient_id = $1
    ORDER BY visited_at DESC
    LIMIT $2
  `;
  const result = await db.query(query, [patientId, limit]); // ✅ Use db instead of pool
  return result.rows;
}

module.exports = { getPatientDetail, getRecentVisits, logDashboardVisit };