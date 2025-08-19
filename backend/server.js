// server.js (first line)
require('dotenv').config();

console.log('Loaded JWT_SECRET:', process.env.JWT_SECRET); // Debug

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');

// Controllers
const {
  registerPatient,
  sendOTP,
  verifyOTP,
   getPatientsByPhone,
  selectPatient,
  getPatientDashboard,
  getRecentVisitsController
} = require('./controllers/patient.controller');
const verifyJWT = require('./middlewares/verifyJWT'); // Make sure this is imported

const { registerDoctor } = require('./controllers/doctor.controller');
const { registerHospital } = require('./controllers/hospital.controller');
const { createDocumentHandler } = require('./controllers/documents.controller')
const documentRoutes = require('./routes/documents.routes');

// Base routes


const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000', // frontend URL
  credentials: true,               // allow cookies/JWT
}));
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); 

// Health check
app.get('/test', (req, res) => {
  res.send('✅ Test route working!');
});

// Patient routes
app.post('/api/patient/register', verifyJWT,registerPatient);
app.post('/api/patient/send-otp', sendOTP);
app.post('/api/patient/verify-otp', verifyOTP);
app.get('/api/patients',verifyJWT, getPatientsByPhone)
app.post('/api/patient/select-profile', verifyJWT,selectPatient);
app.get('/api/patient/dashboard', verifyJWT, getPatientDashboard)
app.get('/api/patient/dashboard', verifyJWT,getRecentVisitsController )

// Doctor & Hospital routes
app.post('/api/doctor/register', registerDoctor);
app.post('/api/hospital/register', registerHospital);

//documents routes
app.use('/api/documents', documentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
