const jwt = require('jsonwebtoken');
const Patient = require('../models/patient.model');
const generateOTP = require('../utils/otpGenerate');
const  { getPatientDetail }= require('../models/dashboard.model');
const  { logDashboardVisit }=require('../models/dashboard.model')
const  { getRecentVisits }= require('../models/dashboard.model');
const { createDocument, getDocumentsByPatient,updateDocumentById,
  deleteDocumentById, countDocumentsByType } = require("../models/documents.model");
const { getLabReportsByPatient } = require('../models/labreports.model');
const {getPrescriptionReportsByPatient} = require('../models/prescriptionReports.model')
const {getExpensesDetailByPatient } = require('../models/medicalExpenses.model')
const MedicalHistory = require('../models/medicalHistory.model');
const {toCamelCase}= require('../utils/normalizeKeys')
const QRCodeModel = require('../models/qrcode.model');
const crypto = require('crypto');
const QRCode = require('qrcode');
const db = require('../config/db');

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




//  Mobile Entry: Generate and store OTP


// Helper to normalize mobile numbers (strip non-digits)
const normalizeMobile = (m) => m?.toString().replace(/\D/g, '');

//  Send OTP
const sendOTP = async (req, res) => {
  const mobile = req.body.mobile || req.body.mobile_number;
  if (!mobile) return res.status(400).json({ error: 'Mobile number is required' });

  const normalized = normalizeMobile(mobile);
  try {
    const otp = generateOTP();
    await Patient.storeOTP(normalized, otp);

   
    console.log(`OTP for ${normalized}: ${otp}`);

    return res.status(200).json({ message: 'OTP sent (mocked)', mobile: normalized });
  } catch (err) {
    console.error('sendOTP error:', err);
    return res.status(500).json({ error: 'Failed to send OTP', details: err.message });
  }
};

// Verify OTP & fetch linked patients
const verifyOTP = async (req, res) => {
  const mobile = req.body.mobile || req.body.mobile_number;
  const otp = req.body.otp;

  if (!mobile || !otp) {
    return res.status(400).json({ error: "Mobile and OTP are required" });
  }

  const normalized = normalizeMobile(mobile);

  try {
    //  Validate OTP
    const isValid = await Patient.verifyOTP(normalized, otp);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid or expired OTP" });
    }

    // Step 2: Find all patient accounts linked to this mobile
    const patients = await Patient.findPatientsByMobile(normalized);

    if (!patients || patients.length === 0) {
      return res.status(404).json({
        message: "No accounts found with this number",
        patients: [],
      });
    }

    // Create short-lived TEMP TOKEN
    // Used when OTP is verified but patient not yet selected (if multiple accounts)
    const tempToken = jwt.sign(
      { 
        mobile: normalized, 
        
        temp: true, 
        role: "patient" 
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // short duration for temporary access
    );
  // Keep existing patient token removal (old/temporary). Do NOT clear any thing
  // doctorAuthToken here — allow doctor and patient cookies to coexist.
  res.clearCookie("patientAuthToken");


    // Store TEMP TOKEN in secure HTTP-only cookie
    // Use the same cookie name middleware and other handlers expect (`patientAuthToken`).
    // Set sameSite to 'none' in production when frontend and backend are cross-origin.
    res.cookie("patientAuthToken", tempToken, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });
    //  Return patient list to frontend
    // The frontend will later confirm which patient account to use
    return res.status(200).json({
      message: "OTP verified successfully",
      patients, // send possible linked accounts
    });
  } catch (err) {
    console.error("verifyOTP error:", err);
    return res
      .status(500)
      .json({ error: "OTP verification failed", details: err.message });
  }
};


// Get the patient details registered on the mobile
const getPatientsByPhone = async (req, res) => {
  try {
    // Ensure the user has a temporary verified token
    const user = req.user; // Set from auth middleware
    console.log(`User: ${JSON.stringify(user)}`);
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

//Select patient
const selectPatient = async (req, res) => {
  try {
    const { mobile, temp } = req.user;
    const { patient_id } = req.body;

    if (!temp) {
      return res.status(403).json({ error: "Temporary token required" });
    }

    const patient = await Patient.findByPk(patient_id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }

    if (normalizeMobile(patient.mobile_number) !== normalizeMobile(mobile)) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Generate permanent JWT
    const token = jwt.sign(
      {
        patient_id: patient.patient_id,
        mobile,
        username: patient.first_name,
        role: "patient",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Clear old tokens (temporary or doctor)
  res.clearCookie("authToken");
   
  res.clearCookie("patientAuthToken");
  // Intentionally not clearing doctorAuthToken to preserve doctor session
  // if the user is logged in as a doctor in another tab/browser context.


    // set new permanent patient token
    res.cookie("patientAuthToken", token, {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({
      message: "Patient selected successfully",
      patient,
    });
  } catch (err) {
    console.error("selectPatient error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
};



// Get selected patient
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
async function createDocumentHandler(req, res) {
  try {
    // Extract user info from JWT middleware
    const { username, mobile, email, patient_id } = req.user || {};
    if (!patient_id) {
      return res.status(401).json({ error: "Unauthorized: Patient ID missing" });
    }

    // Extract fields from request body
    const { documentType, documentCategory, document_data } = req.body || {};

    // Validate required fields
    if (!documentType) {
      return res.status(400).json({ error: "Missing required field: documentType" });
    }

    // Map frontend documentType to internal document_id
    const DOCUMENT_TYPE_MAP = {
      labReport: 1,
      prescription: 2,
      medicalExpenses: 3,
      vaccination: 4,
    };
    const documentId = DOCUMENT_TYPE_MAP[documentType];
    if (!documentId) {
      return res.status(400).json({ error: `Invalid documentType: ${documentType}` });
    }

    // Handle file upload
    const filePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Parse document_data safely
    let parsedData = {};
    if (document_data) {
      try {
        parsedData = typeof document_data === "string" ? JSON.parse(document_data) : document_data;
      } catch {
        return res.status(400).json({ error: "Invalid JSON in document_data" });
      }
    }

    // Include documentCategory in parsedData if provided
    if (documentCategory) parsedData.documentCategory = documentCategory;

    // Use parsedData.title as document_name
    const documentName = parsedData.title;
    if (!documentName) {
      return res.status(400).json({ error: "Missing document title in document_data" });
    }

    // Construct creator identity
    const createdBy = username || mobile || email || `patient_${patient_id}`;

    // Persist document in DB
    const createdDoc = await createDocument({
      document_id: documentId,
      document_name: documentName,
      document_type: documentType,
      document_url: filePath,
      document_data: parsedData,
      patient_id,
      created_by: createdBy,
      updated_by: createdBy,
    });

    return res.status(201).json({
      message: "Document created successfully",
      document: createdDoc,
    });

  } catch (error) {
    console.error("Error creating document:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function updateDocumentHandler(req, res) {
  try {
    const { username, mobile, email, patient_id } = req.user || {};
    if (!patient_id) {
      return res.status(401).json({ error: "Unauthorized: Patient ID missing" });
    }

    const { id } = req.params; // document ID from route
    const { documentType, documentCategory, document_data } = req.body || {};

    // Validate documentType
    if (!documentType) {
      return res.status(400).json({ error: "Missing required field: documentType" });
    }

    // Map documentType → document_id (same map as create)
    const DOCUMENT_TYPE_MAP = {
      labReport: 1,
      prescription: 2,
      medicalExpenses: 3,
      vaccination: 4,
    };
    const documentId = DOCUMENT_TYPE_MAP[documentType];
    if (!documentId) {
      return res.status(400).json({ error: `Invalid documentType: ${documentType}` });
    }

    // Handle optional new file
    const newFilePath = req.file ? `/uploads/${req.file.filename}` : null;

    // Parse document_data safely
    let parsedData = {};
    if (document_data) {
      try {
        parsedData = typeof document_data === "string" ? JSON.parse(document_data) : document_data;
      } catch {
        return res.status(400).json({ error: "Invalid JSON in document_data" });
      }
    }

    // Include category if passed
    if (documentCategory) parsedData.documentCategory = documentCategory;

    // Use parsedData.title for name if provided
    const documentName = parsedData.title || "Unnamed Document";

    const updatedBy = username || mobile || email || `patient_${patient_id}`;

    // Build dynamic update fields
    const updatedDoc = await updateDocumentById(id, {
      document_id: documentId,
      document_name: documentName,
      document_type: documentType,
      document_url: newFilePath, // null if no new file
      document_data: parsedData,
      updated_by: updatedBy,
    });

    if (!updatedDoc) {
      return res.status(404).json({ error: "Document not found or not updated" });
    }

    return res.json({
      message: "Document updated successfully",
      document: updatedDoc,
    });
  } catch (error) {
    console.error("Error updating document:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function deleteDocumentHandler(req, res) {
  try {
    const { id } = req.params;
    const { patient_id } = req.user || {};

    if (!patient_id) {
      return res.status(401).json({ error: "Unauthorized: Patient ID missing" });
    }

    // Delete from DB
    const deletedDoc = await deleteDocumentById(id, patient_id);

    if (!deletedDoc) {
      return res.status(404).json({ error: "Document not found" });
    }


    return res.json({
      message: "Document deleted successfully",
      deleted: deletedDoc,
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}


// Fetch documents for the logged-in patient
async function getLabReportsHandler(req, res) {
  try {
    const { patient_id } = req.user; // Assuming JWT middleware sets req.user

    if (!patient_id) {
      return res.status(401).json({ error: "Unauthorized: Patient ID missing" });
    }

    const labReports = await getLabReportsByPatient(patient_id);

    return res.status(200).json({
      message: "Lab reports fetched successfully",
      labReports,
    });
  } catch (error) {
    console.error("Error fetching lab reports:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

async function getPrescriptionReportsHandler(req, res) {
  try {
    const { patient_id } = req.user; // Assuming JWT middleware sets req.user

    if (!patient_id) {
      return res.status(401).json({ error: "Unauthorized: Patient ID missing" });
    }

    const prescriptionReports = await getPrescriptionReportsByPatient(patient_id);

    return res.status(200).json({
      message: "Prescription Reports fetched successfully",
      prescriptionReports: prescriptionReports,
    });
  } catch (error) {
    console.error("Error fetching Prescription reports:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
async function getMedicalExpensesHandler(req, res) {
  try {
    const { patient_id } = req.user; // Assuming JWT middleware sets req.user

    if (!patient_id) {
      return res.status(401).json({ error: "Unauthorized: Patient ID missing" });
    }

    const medicalExpenses = await getExpensesDetailByPatient(patient_id);

    return res.status(200).json({
      message: "Lab reports fetched successfully",
      medicalExpenses,
    });
  } catch (error) {
    console.error("Error fetching lab reports:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
const getMedicalHistory = async (req, res) => {
  try {
    const { patient_id } = req.user;
    const row = await MedicalHistory.getByPatientId(patient_id);

    if (!row) return res.status(404).json({ message: "No medical history found." });

    const medicalHistory = toCamelCase(row); // convert keys to camelCase
    res.json({ success: true, medicalHistory });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create new medical history record
const createMedicalHistory = async (req, res) => {
  try {
    const { patient_id } = req.user; // always use token
    if (!patient_id) return res.status(401).json({ message: "Unauthorized" });

    const medicalData = { patient_id, ...req.body };
    const newRecord = await MedicalHistory.create(medicalData);
    res.status(201).json({ success: true, medicalHistory: newRecord });
  } catch (err) {
    console.error("Error creating medical history:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
const getDocumentCounts = async (req, res) => {
  try {
    const { patient_id } = req.user; // ✅ patient_id extracted from JWT middleware

    if (!patient_id) {
      return res.status(401).json({ error: "Unauthorized: patient_id missing in token" });
    }

    const counts = await countDocumentsByType(patient_id);

    return res.status(200).json({
      message: "Document counts fetched successfully",
      counts,
    });
  } catch (err) {
    console.error("Error fetching document counts:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Removed duplicate declaration of getMedicalHistory

const updateMedicalHistory = async (req, res) => {
  try {
    const { patient_id } = req.user;
    const updatedRecord = await MedicalHistory.update(patient_id, req.body);
    res.status(200).json({ success: true, medicalHistory: updatedRecord });
  } catch (err) {
    console.error("Error updating medical history:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};
 // qr code controller

 const getPatientQRCodeData = async (req, res) => {
  try {
    const {patient_id} = req.user;

    // Generate secure random token
    const token_qr = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Save token in DB
    // NOTE: ensure we pass patient_id as a scalar (not an object)
    await db.query(
      'INSERT INTO qr_tokens (token, patient_id, expires_at) VALUES ($1, $2, $3)',
      [token_qr, patient_id, expiresAt]
    );

    // QR code URL
    const qrValue = `http://localhost:3000/scan-patient?token=${token_qr}`;

    // Generate PNG data URL so frontend can directly render the QR if desired
    let qrDataUrl = null;
    try {
      qrDataUrl = await QRCode.toDataURL(qrValue);
    } catch (e) {
      console.warn('Failed to generate QR image data URL:', e.message);
    }

    res.json({
      success: true,
      qrValue,
      qrDataUrl,
      expiresAt
    });
  } catch (err) {
    console.error('Error generating QR code token:', err);
    res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // Doctor scans QR code: verify token and return patient data
  const getPatientDataByToken = async (req, res) => {
    try {
    const { token } = req.query;
    const doctorId = req.user; // JWT of logged-in doctor

    // Validate token
    const tokenValue = token ? String(token).trim() : '';
    if (!tokenValue) {
      return res.status(400).json({ success: false, message: 'Missing token' });
    }

    // Query for unexpired token
    const result = await db.query(
      'SELECT * FROM qr_tokens WHERE token=$1 AND used=false AND expires_at > NOW()',
      [tokenValue]
    );

    if (result.rowCount === 0) {
      return res.status(400).json({ success: false, message: 'Invalid or expired QR code' });
    }

    const qrToken = result.rows[0];

    // Ensure the token is valid for at least one hour
const tokenExpirationTime = 60 * 60; // 1 hour in seconds

// Check if the token is still valid
if (Date.now() / 1000 - qrToken.created_at > tokenExpirationTime) {
    return res.status(400).json({ success: false, message: 'Token has expired' });
}

// Mark token as used (single-use)
await db.query('UPDATE qr_tokens SET used=true WHERE token=$1', [tokenValue]);

// Fetch patient data
const patient = await QRCodeModel.getPatientById(qrToken.patient_id);
if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });

res.json({ success: true, patient });
    } catch (err) {
    console.error('Error scanning QR code:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};


module.exports = {
  registerPatient,
     sendOTP,
  verifyOTP,
    getPatientsByPhone ,
  selectPatient,
  getSelectedPatient,
 getPatientDashboard,
 getRecentVisitsController,
createDocumentHandler,
deleteDocumentHandler,
updateDocumentHandler,
getLabReportsHandler,
getPrescriptionReportsHandler,
  getMedicalHistory,
  createMedicalHistory,
  updateMedicalHistory,
  getPatientQRCodeData,
 getPatientDataByToken,
 getDocumentCounts,
 getMedicalExpensesHandler

};