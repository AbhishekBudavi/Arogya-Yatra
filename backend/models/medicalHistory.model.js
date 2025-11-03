const pool = require("../config/db");

// 🔧 Utility: camelCase → snake_case mapping
const fieldMap = {
  fullName: 'fullname',
  bloodGroup: 'bloodgroup',
  emergencyContact: 'emergencycontact',
  mediclaimPolicy: 'mediclaimpolicy',
  insuranceCompany: 'insurancecompany',
  policyExpiry: 'policyexpiry',
  arogyayatraId: 'arogyayatraid',
  chronicConditions: 'chronicconditions',
  nutritionalDeficiency: 'nutritionaldeficiency',
  pastSurgeries: 'pastsurgeries',
  pastIllnesses: 'pastillnesses',
  currentMedications: 'currentmedications',
  bloodPressure: 'bloodpressure',
  fastingBloodSugar: 'fastingbloodsugar',
  postprandialBloodSugar: 'postprandialbloodsugar',
  randomBloodSugar: 'randombloodsugar',
  familyCancerHistory: 'familycancerhistory',
  familyChronicHistory: 'familychronichistory',
  additionalNotes: 'additionalnotes',
  dietType: 'diettype',
  smoking: 'smoking',
  alcoholConsumption: 'alcoholconsumption',
  tobaccoChewing: 'tobaccochewing',
  gutkaChewing: 'gutkachewing',
  supariChewing: 'suparichewing'
};

const normalizeKeys = (data) =>
  Object.fromEntries(
    Object.entries(data).map(([key, value]) => [fieldMap[key] || key, value])
  );

const MedicalHistory = {
  /**
   * Create a new medical history record
   */
  async create(data) {
    const fields = Object.keys(data);
    const values = Object.values(data);
    const placeholders = fields.map((_, i) => `$${i + 1}`).join(", ");

    const query = `
      INSERT INTO medical_history (${fields.join(", ")})
      VALUES (${placeholders})
      RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  },

  /**
   * Get latest medical history by patient ID
   */
  async getByPatientId(patient_id) {
    const query = `
      SELECT * FROM medical_history
      WHERE patient_id = $1
      ORDER BY id DESC
      LIMIT 1;
    `;
    const { rows } = await pool.query(query, [patient_id]);
    return rows[0];
  },

  /**
   * Update medical history for a patient
   */
 async update(patient_id, data) {
  // Normalize keys
  const normalized = normalizeKeys(data);

  // Exclude fields that should not be updated
  const { id, updated_at, patient_id: pid, ...cleanData } = normalized;

  const fields = Object.keys(cleanData);
  const values = Object.values(cleanData);

  if (fields.length === 0) {
    throw new Error("No valid fields to update.");
  }

  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");

  const query = `
    UPDATE medical_history
    SET ${setClause}, updated_at = NOW()
    WHERE patient_id = $${fields.length + 1}
    RETURNING *;
  `;

  const { rows } = await pool.query(query, [...values, patient_id]);
  return rows[0];
}


};


module.exports = MedicalHistory;