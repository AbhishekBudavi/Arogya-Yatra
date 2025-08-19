const jwt = require('jsonwebtoken');
const Patient = require('../models/patient.model');
const generateOTP = require('../utils/otpGenerate');
const  { getPatientDetail }= require('../models/dashboard.model');
const  { logDashboardVisit }=require('../models/dashboard.model')
const  { getRecentVisits }= require('../models/dashboard.model')
 

// Register a new patient
const registerPatient = async (req, res) => {
  const {
    first_name,
    last_name,
    gender,
    date_of_birth,
    mobile_number,
    photo,
    address,
    pincode,
    city,
    state,
    height,
    weight,
    blood_group,
    allergies,
    chronic_illness
  } = req.body;

  // Validate required fields
  if (!first_name || !last_name || !gender || !mobile_number) {
    return res.status(400).json({
      success: false,
      message: 'first name, last name, gender, and mobile number are required',
    });
  }

  try {
    // Create a new patient
    const patient = await Patient.createPatient({
      first_name,
      last_name,
      gender,
      date_of_birth,
      mobile_number,
      photo,
      address,
      pincode,
      city,
      state,
      height,
      weight,
      blood_group,
      allergies,
      chronic_illness
    });
    res.status(201).json({
      success: true,
      data: patient,
    });
  } catch (err) {
    console.error('Error during patient registration:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to register patient',
      error: err.message,
    });
  }
};

// Login patient by mobile number



/**
 * Step 1 – Mobile Entry: Generate and store OTP
 */

// Helper to normalize mobile numbers (strip non-digits)
const normalizeMobile = (m) => m?.toString().replace(/\D/g, '');

// Step 1 – Send OTP
const sendOTP = async (req, res) => {
  const mobile = req.body.mobile || req.body.mobile_number;
  if (!mobile) return res.status(400).json({ error: 'Mobile number is required' });

  const normalized = normalizeMobile(mobile);
  try {
    const otp = generateOTP();
    await Patient.storeOTP(normalized, otp);

    // TODO: Replace with actual SMS gateway integration
    console.log(`OTP for ${normalized}: ${otp}`);

    return res.status(200).json({ message: 'OTP sent (mocked)', mobile: normalized });
  } catch (err) {
    console.error('sendOTP error:', err);
    return res.status(500).json({ error: 'Failed to send OTP', details: err.message });
  }
};

// Step 2 – Verify OTP & fetch linked patients
const verifyOTP = async (req, res) => {
  const mobile = req.body.mobile || req.body.mobile_number;
  const otp = req.body.otp;
  if (!mobile || !otp) return res.status(400).json({ error: 'Mobile and OTP are required' });

  const normalized = normalizeMobile(mobile);
  try {
    const isValid = await Patient.verifyOTP(normalized, otp);
    if (!isValid) return res.status(401).json({ error: 'Invalid or expired OTP' });

    const patients = await Patient.findPatientsByMobile(normalized);

    // Create short-lived temp token
    const tempToken = jwt.sign(
      { mobile: normalized, temp: true },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Store temp token in cookie
    res.cookie('authToken', tempToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 1000
    });

    return res.status(200).json({
      message: 'OTP verified',
      patients: patients || []
    });

    
  } catch (err) {
    console.error('verifyOTP error:', err);
    return res.status(500).json({ error: 'OTP verification failed', details: err.message });
  }
};

//get the patient details registerd on the mmobile
const getPatientsByPhone = async (req, res) => {
  try {
    // Ensure the user has a temporary verified token
    const user = req.user; // Set from auth middleware
    if (!user || !user.temp) {
      return res.status(403).json({ error: 'Operation requires a temporary verified token' });
    }

    // Use the verified mobile number from token
    const normalizedPhone = normalizeMobile(user.mobile);

    // Fetch patients linked to this phone
    const patients = await Patient.findPatientsByMobile(normalizedPhone);

    if (!patients || patients.length === 0) {
      return res.status(404).json({ message: 'No accounts found with this number', patients: [] });
    }

    return res.status(200).json(patients);

  } catch (err) {
    console.error('Error fetching patients:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};


// Step 3 – Select patient
const selectPatient = async (req, res) => {
  try {
    const patient_id = req.body.patient_id || req.body.id;
    if (!patient_id) {
      return res.status(400).json({ error: 'patient_id is required' });
    }

    if (!req.user) {
      return res.status(403).json({ error: 'Operation requires a valid verified token' });
    }

    if (!req.user.temp) {
      return res.status(403).json({ error: 'Operation requires a temporary verified token' });
    }

    const patient = await Patient.findByPk(patient_id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }
    if (normalizeMobile(patient.mobile_number) !== normalizeMobile(req.user.mobile)) {
      return res.status(403).json({ error: 'You are not authorized to select this patient' });
    }

    // Generate a permanent token
    const permanentToken = jwt.sign(
      { mobile: req.user.mobile, patient_id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Overwrite the cookie with the permanent token
    res.cookie('authToken', permanentToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: 'Patient profile selected successfully',
      patient
    });

  } catch (err) {
    console.error('Error in selectPatient:', err);
    return res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// Step 4 – Get selected patient
const getSelectedPatient = async (req, res) => {
  const user = req.user;
  if (!user || !user.patient_id) {
    return res.status(400).json({ error: 'No patient selected in token' });
  }

  try {
    const patient = await Patient.findPatientById(user.patient_id);
    if (!patient) return res.status(404).json({ error: 'Patient not found' });

    return res.status(200).json({ patient });
  } catch (err) {
    console.error('getSelectedPatient error:', err);
    return res.status(500).json({ error: 'Failed to fetch patient', details: err.message });
  }
};

async function getPatientDashboard(req, res) {
  try {
    const { patient_id } = req.user;
    if (!patient_id || isNaN(patient_id)) {
      return res.status(400).json({ error: 'Invalid patient ID' });
    }

    const patient = await getPatientDetail(patient_id);
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    await logDashboardVisit(patient_id);
    const recentVisits = await getRecentVisits(patient_id, 5);

    return res.status(200).json({
      patient,
      recentVisits,
      message: 'Dashboard data retrieved successfully'
    });
  } catch (err) {
    console.error('Error in getPatientDashboard:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

async function getRecentVisitsController(req, res) {
  try {
    const { patient_id } = req.user;
    const visits = await getRecentVisits(patient_id);
    return res.json({ visits });
  } catch (err) {
    console.error('Error fetching recent visits:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}



module.exports = {
  registerPatient,
     sendOTP,
  verifyOTP,
    getPatientsByPhone ,
  selectPatient,
  getSelectedPatient,
 getPatientDashboard,
 getRecentVisitsController
};