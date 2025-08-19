const Doctor = require('../models/doctor.model');

// Register a new patient
const registerDoctor = async (req, res) => {
  const {
   custom_doctor_id, hospital_id, first_name, last_name, phone, email, password, specialization, opd_timing, created_by, updated_by
  } = req.body;

  // Validate required fields
  if (!custom_doctor_id || !first_name || !last_name || !hospital_id || !specialization) {
    console.log("Hellow worlks")
    return res.status(400).json({
      success: false,
      message: 'Custom patient ID, first name, last name, gender, and mobile number are required',
    });
  }

  try {
    // Create a new patient
    const doctor = await Doctor.createDoctor({
      custom_doctor_id, hospital_id, first_name, last_name, phone, email, password, specialization, opd_timing, created_by, updated_by
    });
    res.status(201).json({
      success: true,
      data: doctor,
    });
  } catch (err) {
    console.error('Error during doctor registration:', err);
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
  registerDoctor,
  loginPatient,
};