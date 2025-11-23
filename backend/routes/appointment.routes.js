const express = require('express');
const router = express.Router();
const {
  searchDoctorsBySpecialty,
  getAvailableSlots,
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  getHospitalAppointments,
  getAppointmentDetails,
  cancelAppointment,
  rescheduleAppointment,
  updateAppointmentStatus,
} = require('../controllers/appointment.controller');
const { verifyJWT } = require('../middlewares/verifyJWT');

// Public routes
// Search doctors by specialty
router.get('/search', searchDoctorsBySpecialty);

// Get available slots for a doctor
router.get('/slots', getAvailableSlots);

// Patient routes
// Book an appointment
router.post('/book', verifyJWT('patient'), bookAppointment);

// Get patient's appointments
router.get('/patient', verifyJWT('patient'), getPatientAppointments);
router.get('/patient/:patient_id', verifyJWT('patient'), getPatientAppointments);

// Cancel appointment
router.delete('/:appointment_id/cancel', verifyJWT('patient'), cancelAppointment);

// Reschedule appointment
router.put('/:appointment_id/reschedule', verifyJWT('patient'), rescheduleAppointment);

// Get appointment details
router.get('/:appointment_id', getAppointmentDetails);

// Doctor routes
// Get doctor's appointments
router.get('/doctor/appointments', verifyJWT('doctor'), getDoctorAppointments);

// Hospital routes
// Get appointments for a hospital
router.get('/hospital/:hospital_id/appointments', verifyJWT('hospital'), getHospitalAppointments);

// Update appointment status
router.patch('/:appointment_id/status', verifyJWT('hospital'), updateAppointmentStatus);

module.exports = router;
