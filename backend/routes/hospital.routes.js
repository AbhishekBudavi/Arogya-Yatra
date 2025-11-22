const express = require('express');
const router = express.Router();
const { 
  registerHospital, 
  loginHospital, 
  getHospitalDashboard,
  logoutHospital,
  registerHospitalDoctor,
  getHospitalDoctors,
  getHospitalDoctorAvailability
} = require('../controllers/hospital.controller');
const verifyJWT = require('../middlewares/verifyJWT');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Hospital service is running',
    timestamp: new Date().toISOString()
  });
});

// Hospital authentication routes
router.post('/register', registerHospital);
router.post('/login', loginHospital);
router.post('/logout', verifyJWT, logoutHospital);

// Hospital dashboard
router.get('/dashboard', verifyJWT, getHospitalDashboard);

// Doctor management routes
router.post('/doctors/register', verifyJWT, registerHospitalDoctor);
router.get('/doctors', verifyJWT, getHospitalDoctors);
router.get('/doctors/:doctor_id', verifyJWT, getHospitalDoctorAvailability);

module.exports = router;