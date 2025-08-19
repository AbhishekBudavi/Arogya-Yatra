const Hospital = require('../models/hospital.model');

// Register a new patient
const registerHospital = async (req, res) => {
  const {
   custom_hospital_id, hospital_name, hospital_type, address, pincode, city, state, country, admin_name, admin_mobile_number, password, created_by, updated_by
  } = req.body;

  // Validate required fields
  if (!custom_hospital_id || !hospital_name || !admin_name || !password || !admin_mobile_number) {
    console.log("Hellow worlks")
    return res.status(400).json({
      success: false,
      message: 'Custom patient ID, first name, last name, gender, and mobile number are required',
    });
  }

  try {
    // Create a new patient
    const hospital = await Hospital.createHospital({
      custom_hospital_id, hospital_name, hospital_type, address, pincode, city, state, country, admin_name, admin_mobile_number, password, created_by, updated_by
    });
    res.status(201).json({
      success: true,
      data: hospital,
    });
  } catch (err) {
    console.error('Error during hospital registration:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to register doctor',
      error: err.message,
    });
  }
};

// Login patient by mobile number
const loginPatient = async (req, res) => {
  const { custom_doctor_id  } = req.body;

  // Validate required fields
  if (!custom_doctor_id) {
    return res.status(400).json({
      success: false,
      message: 'Mobile number is required',
    });
  }

  try {
    // Find patient by mobile number
    const patient = await Patient.getPatientByPhone(mobile_number);
    if (!patient) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: patient,
    });
  } catch (err) {
    console.error('Error during patient login:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to login patient',
      error: err.message,
    });
  }
};

// Exporting the controller functions
module.exports = {
  registerHospital,
  loginPatient,
};