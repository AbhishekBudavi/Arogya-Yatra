const express = require('express');
const router = express.Router();
const {registerPatient,
   sendOTP,
  verifyOTP,
  selectPatient, getPatientDashboard,getRecentVisitsController, getPatientsByPhone } = require('../controllers/patient.controller');
const verifyJWT = require('../middleware/verifyJWT');


// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Patient service is running',
    timestamp: new Date().toISOString()
  });
});

router.post('/register', registerPatient);
router.get('/login', loginPatient);
router.get('/health',healthCheck)
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.get('/', getPatientsByPhone )
router.post('/select-patient',verifyJWT, selectPatient);
router.get('/dashboard', verifyJWT, getPatientDashboard);
router.get('/dashboard/visits', verifyJWT, getRecentVisitsController);


module.exports = router;