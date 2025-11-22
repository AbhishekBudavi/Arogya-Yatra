const pool = require("../config/db");
const axios = require("axios");

/**
 * Comprehensive clinical data retrieval utility
 * Fetches medical history, lab reports, documents, and other patient data
 */

/**
 * Get patient medical history
 */
const getMedicalHistoryData = async (patient_id) => {
  try {
    const patientIdInt = parseInt(patient_id, 10);
    if (isNaN(patientIdInt)) return null;
    const query = `
      SELECT * FROM medical_history
      WHERE patient_id = $1
      ORDER BY created_at DESC
      LIMIT 1;
    `;
    const { rows } = await pool.query(query, [patient_id]);
    return rows[0] || null;
  } catch (err) {
    console.error("Error fetching medical history:", err.message);
    return null;
  }
};

/**
 * Get patient lab reports and documents
 */
const getLabReportsData = async (patient_id) => {
  try {
    const query = `
      SELECT id, document_name, file_type, file_path, created_at, metadata
      FROM documents
      WHERE patient_id = $1 AND document_type IN ('labReport', 'testResult', 'diagnostic')
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [patient_id]);
    return rows || [];
  } catch (err) {
    console.error("Error fetching lab reports:", err.message);
    return [];
  }
};

/**
 * Get patient prescriptions
 */
const getPrescriptionsData = async (patient_id) => {
  try {
    const query = `
      SELECT id, document_name, file_type, created_at, metadata
      FROM documents
      WHERE patient_id = $1 AND document_type = 'prescription'
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [patient_id]);
    return rows || [];
  } catch (err) {
    console.error("Error fetching prescriptions:", err.message);
    return [];
  }
};

/**
 * Get patient vaccination records
 */
const getVaccinationData = async (patient_id) => {
  try {
    const patientIdInt = parseInt(patient_id, 10);
    if (isNaN(patientIdInt)) return [];
    const query = `
      SELECT id, document_name, file_type, created_at, metadata
      FROM documents
      WHERE patient_id = $1 AND document_type = 'vaccination'
      ORDER BY created_at DESC;
    `;
    const { rows } = await pool.query(query, [patientIdInt]);
    return rows || [];
  } catch (err) {
    console.error("Error fetching vaccination records:", err.message);
    return [];
  }
};

/**
 * Get patient basic information
 */
const getPatientBasicInfo = async (patient_id) => {
  try {
    const patientIdInt = parseInt(patient_id, 10);
    if (isNaN(patientIdInt)) return null;
    const query = `
      SELECT id, phone_number, arogyayatraid, blood_group, age
      FROM patients
      WHERE id = $1;
    `;
    const { rows } = await pool.query(query, [patientIdInt]);
    return rows[0] || null;
  } catch (err) {
    console.error("Error fetching patient basic info:", err.message);
    return null;
  }
};

/**
 * Compile all clinical data for a patient
 */
const getCompleteClinicalData = async (patient_id) => {
  const [basicInfo, medicalHistory, labReports, prescriptions, vaccinations] = await Promise.all([
    getPatientBasicInfo(patient_id),
    getMedicalHistoryData(patient_id),
    getLabReportsData(patient_id),
    getPrescriptionsData(patient_id),
    getVaccinationData(patient_id),
  ]);

  return {
    basicInfo,
    medicalHistory,
    labReports,
    prescriptions,
    vaccinations,
  };
};

/**
 * Format medical history for prompt context
 */
const formatMedicalHistory = (history) => {
  if (!history) return "No medical history records found";

  const formatted = [];
  if (history.chronicconditions) formatted.push(`Chronic Conditions: ${history.chronicconditions}`);
  if (history.pastsurgeries) formatted.push(`Past Surgeries: ${history.pastsurgeries}`);
  if (history.pastillnesses) formatted.push(`Past Illnesses: ${history.pastillnesses}`);
  if (history.currentmedications) formatted.push(`Current Medications: ${history.currentmedications}`);
  if (history.bloodpressure) formatted.push(`Blood Pressure: ${history.bloodpressure}`);
  if (history.fastingbloodsugar) formatted.push(`Fasting Blood Sugar: ${history.fastingbloodsugar}`);
  if (history.postprandialbloodsugar) formatted.push(`Post-prandial Blood Sugar: ${history.postprandialbloodsugar}`);
  if (history.bloodgroup) formatted.push(`Blood Group: ${history.bloodgroup}`);
  if (history.familychronichistory) formatted.push(`Family Chronic History: ${history.familychronichistory}`);
  if (history.familycancerhistory) formatted.push(`Family Cancer History: ${history.familycancerhistory}`);
  if (history.nutritionaldeficiency) formatted.push(`Nutritional Deficiency: ${history.nutritionaldeficiency}`);
  if (history.smoking) formatted.push(`Smoking: ${history.smoking}`);
  if (history.alcoholconsumption) formatted.push(`Alcohol Consumption: ${history.alcoholconsumption}`);

  return formatted.length > 0 ? formatted.join("\n") : "No medical history details recorded";
};

/**
 * Format lab reports for prompt context
 */
const formatLabReports = (labReports) => {
  if (!labReports || labReports.length === 0) return "No lab reports available";

  return labReports
    .map((report, idx) => {
      const metadata = report.metadata ? JSON.stringify(report.metadata) : "N/A";
      return `Report ${idx + 1}: ${report.document_name || "Lab Report"} (${report.file_type}) - ${report.created_at} - Details: ${metadata}`;
    })
    .join("\n");
};

/**
 * Format prescriptions for prompt context
 */
const formatPrescriptions = (prescriptions) => {
  if (!prescriptions || prescriptions.length === 0) return "No recent prescriptions available";

  return prescriptions
    .slice(0, 5)
    .map((rx, idx) => {
      const metadata = rx.metadata ? JSON.stringify(rx.metadata) : "N/A";
      return `Prescription ${idx + 1}: ${rx.document_name || "Prescription"} - ${rx.created_at} - Details: ${metadata}`;
    })
    .join("\n");
};

module.exports = {
  getMedicalHistoryData,
  getLabReportsData,
  getPrescriptionsData,
  getVaccinationData,
  getPatientBasicInfo,
  getCompleteClinicalData,
  formatMedicalHistory,
  formatLabReports,
  formatPrescriptions,
};
