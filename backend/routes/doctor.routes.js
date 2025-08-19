const express = require('express');
const router = express.Router();
const { registerDoctor, loginDoctor} = require('../controllers/doctor.controller');

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Patient service is running',
    timestamp: new Date().toISOString()
  });
});

router.post('/doctor/register', registerDoctor);
router.post('/doctor/login', loginDoctor);
router.get('/health',healthCheck)

module.exports = router;