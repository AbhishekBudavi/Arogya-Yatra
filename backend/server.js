// server.js 
require('dotenv').config();



const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const path = require("path");



// Controllers
const {
  registerPatient,
  sendOTP,
  verifyOTP,
   getPatientsByPhone,
  selectPatient,
  getPatientDashboard,
  getRecentVisitsController,
  createDocumentHandler,
  getLabReportsHandler,
getMedicalExpensesHandler,
  updateDocumentHandler,
  deleteDocumentHandler,
  getPrescriptionReportsHandler,
    getMedicalHistory,
  createMedicalHistory,
  updateMedicalHistory,
  deleteMedicalHistory,
 getPatientQRCodeData,
 getPatientDataByToken,
 getSelectedPatient,
 getDocumentCounts,
 
} = require('./controllers/patient.controller');
const {loginDoctor, getDoctorDashboard} = require('./controllers/doctor.controller');
const { registerHospital, loginHospital, getHospitalDashboard, logoutHospital, registerHospitalDoctor, getHospitalDoctors, getHospitalDoctorAvailability } = require('./controllers/hospital.controller');

const { verifyPatientJWT} = require('./middlewares/verifyJWTPatient');
const { verifyDoctorJWT} = require('./middlewares/verifyJWTDoctor');

const { verifyJWT } = require('./middlewares/verifyJWT');




// Base routes


const app = express();

// Middleware - IMPORTANT: Order matters!
// 1. Parse cookies FIRST before routes
app.use(cookieParser());

// 2. Parse JSON
app.use(express.json({ limit: "10mb" }));

// 3. Parse URL-encoded data
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// 4. CORS configuration
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:8080'], // Allow multiple frontend URLs
  credentials: true           // allow cookies/JWT
}));

// 5. Logging
app.use(morgan('dev'));

// 6. Health check endpoint
app.get("/whoami", (req, res) => {
  res.json({ cookies: req.cookies });
});

// 7. Diagnostics endpoint for debugging
app.get("/api/debug/cookies", (req, res) => {
  console.log('Cookies received:', req.cookies);
  console.log('Headers:', req.headers);
  res.json({ 
    cookies: req.cookies,
    hasPatientAuthToken: !!req.cookies?.patientAuthToken,
    hasDoctorAuthToken: !!req.cookies?.doctorAuthToken,
    hasHospitalAuthToken: !!req.cookies?.hospitalAuthToken,
    authHeader: req.headers.authorization,
  });
});

// 7. Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); 

// Health check


// Patient routes
app.post('/api/patient/register', verifyJWT("patient"), registerPatient);
app.post('/api/patient/send-otp', sendOTP);
app.post('/api/patient/verify-otp', verifyOTP);
app.get('/api/patients', verifyJWT("patient"), getPatientsByPhone);
app.get('/api/patient/getPatientDetail', verifyJWT("patient"), getSelectedPatient);
app.post('/api/patient/select-profile', verifyJWT("patient"), selectPatient);
app.get('/api/patient/dashboard', verifyJWT("patient"), getPatientDashboard);
app.get('/api/patient/recent-visits', verifyJWT("patient"), getRecentVisitsController);

// Doctor & Hospital routes
app.post('/api/hospital/register', registerHospital);
app.post('/api/hospital/login', loginHospital);
app.get('/api/hospital/dashboard', verifyJWT('hospital'), getHospitalDashboard);
app.post('/api/hospital/logout', verifyJWT('hospital'), logoutHospital);
app.post('/api/hospital/doctors/register', verifyJWT('hospital'), registerHospitalDoctor);
app.get('/api/hospital/doctors', verifyJWT('hospital'), getHospitalDoctors);
app.get('/api/hospital/doctors/:doctor_id', verifyJWT('hospital'), getHospitalDoctorAvailability);

//documents routes

const upload = require("./middlewares/upload"); // Multer config
const { verify } = require('crypto');


app.post(
  "/api/patient/upload-report",
  verifyJWT("patient"),
  upload.single("file"), // Multer middleware
  createDocumentHandler
);

app.put("/api/patient/update-document/:id", verifyJWT("patient"), upload.single("file"), updateDocumentHandler);

// DELETE document
app.delete("/api/patient/delete-document/:id", verifyJWT("patient"), deleteDocumentHandler);
app.get('/api/patient/counts', verifyJWT("patient"), getDocumentCounts)
app.get('/api/patient/labreports',verifyJWT("patient"), getLabReportsHandler)
app.get('/api/patient/prescriptionReports',verifyJWT("patient"), getPrescriptionReportsHandler)
app.get('/api/patient/medical-expenses', verifyJWT("patient"), getMedicalExpensesHandler)
app.get('/api/patient/medical-history',verifyJWT("patient"), getMedicalHistory);
app.post('/api/patient/medical-history',verifyJWT("patient"), createMedicalHistory);
app.put('/api/patient/medical-history',verifyJWT("patient"), updateMedicalHistory);
app.get('/api/patient/my-qrcode',verifyJWT("patient"), getPatientQRCodeData);
app.get('/api/patient/scan-patient',verifyJWT("doctor"), getPatientDataByToken);

// Doctor profile endpoint
app.get('/api/doctor/profile',verifyDoctorJWT, async (req, res) => {
  try {
    // Access doctor_id from decoded token
    const { doctor_id } = req.user;
    res.json({ message: "Doctor profile access granted", doctor_id });
  } catch (err) {
    res.status(500).json({ error: "Failed to load profile" });
  }
})

// Doctor login endpoint
app.post('/api/doctor/login', loginDoctor);

// Doctor dashboard endpoint
app.get('/api/dashboard/doctor', verifyJWT("doctor"), getDoctorDashboard);

// Appointment routes
const appointmentRoutes = require('./routes/appointment.routes');
app.use('/api/appointments', appointmentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Initialize database and run migrations
const { runMigrations } = require('./migrations/runMigrations');

const startServer = async () => {
  try {
    await runMigrations();
    console.log('Database ready!');
  } catch (error) {
    console.error('Failed to run migrations:', error);
    process.exit(1);
  }

  // Start server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
};

startServer();

