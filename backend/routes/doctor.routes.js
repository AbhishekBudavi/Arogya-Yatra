const express = require('express');
const router = express.Router();
const { getDoctorDashboard } =  require('../controllers/doctor.controller');
const verifyJWT = require('../middleware/verifyJWT');

// Protected routes (JWT required)
router.get("/profile", verifyJWT, async (req, res) => {
  try {
    // Access doctor_id from decoded token
    const { doctor_id } = req.user;
    res.json({ message: "Doctor profile access granted", doctor_id });
  } catch (err) {
    res.status(500).json({ error: "Failed to load profile" });
  }
});

router.get('/dashboard/doctor', verifyJWT("doctor"), getDoctorDashboard)

module.exports = router;