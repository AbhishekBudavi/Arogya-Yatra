const AppointmentModel = require('../models/appointment.model');
const DoctorModel = require('../models/doctor.model');
const db = require('../config/db');

// Search doctors by specialty
const searchDoctorsBySpecialty = async (req, res) => {
  try {
    const { specialty, hospital_id, page = 1, limit = 10 } = req.query;

    // Validate input
    if (!specialty) {
      return res.status(400).json({
        success: false,
        message: 'Specialty is required',
      });
    }

    const offset = (page - 1) * limit;

    // Build query to search doctors by specialty
    let query = `
      SELECT DISTINCT
        d.doctor_id,
        d.doctor_name,
        d.specialization,
        d.email,
        d.phone,
        h.hospital_id,
        h.hospital_name,
        h.address as hospital_address,
        h.city,
        h.state,
        dh.license_id
      FROM doctor d
      INNER JOIN doctor_hospital dh ON d.doctor_id = dh.doctor_id
      INNER JOIN hospitals h ON dh.hospital_id = h.hospital_id
      WHERE LOWER(d.specialization) LIKE $1
      AND dh.is_active = true
    `;

    const params = [`%${specialty.toLowerCase()}%`];

    if (hospital_id) {
      query += ` AND h.hospital_id = $${params.length + 1}`;
      params.push(hospital_id);
    }

    query += ` ORDER BY d.doctor_name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(DISTINCT d.doctor_id) as total
      FROM doctor d
      INNER JOIN doctor_hospital dh ON d.doctor_id = dh.doctor_id
      INNER JOIN hospitals h ON dh.hospital_id = h.hospital_id
      WHERE LOWER(d.specialization) LIKE $1
      AND dh.is_active = true
    `;

    const countParams = [`%${specialty.toLowerCase()}%`];

    if (hospital_id) {
      countQuery += ` AND h.hospital_id = $${countParams.length + 1}`;
      countParams.push(hospital_id);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error searching doctors:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search doctors',
      error: error.message,
    });
  }
};

// Get available slots for a doctor on a specific date
const getAvailableSlots = async (req, res) => {
  try {
    const { doctor_id, hospital_id, appointment_date } = req.query;

    // Validate input
    if (!doctor_id || !hospital_id || !appointment_date) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID, Hospital ID, and Appointment Date are required',
      });
    }

    // Validate date is in the future
    const selectedDate = new Date(appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book appointments for past dates',
      });
    }

    // Check if doctor exists and is active
    const doctorCheck = await db.query(
      `SELECT d.* FROM doctor d
       INNER JOIN doctor_hospital dh ON d.doctor_id = dh.doctor_id
       WHERE d.doctor_id = $1 AND dh.hospital_id = $2 AND dh.is_active = true`,
      [doctor_id, hospital_id]
    );

    if (!doctorCheck.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found or not available at this hospital',
      });
    }

    const slots = await AppointmentModel.getAvailableSlots(doctor_id, hospital_id, appointment_date);

    res.status(200).json({
      success: true,
      data: slots,
    });
  } catch (error) {
    console.error('Error fetching available slots:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch available slots',
    });
  }
};

// Book an appointment
const bookAppointment = async (req, res) => {
  try {
    // Extract patient_id from JWT token (req.user) or request body
    let patient_id = null;
    
    if (req.user) {
      // Try multiple possible property names from JWT
      patient_id = req.user.patient_id || req.user.id || req.user.userId || req.user.user_id;
    }
    
    // Fallback to body if not in JWT
    if (!patient_id) {
      patient_id = req.body.patient_id;
    }
    
    // Ensure patient_id is a string
    if (patient_id && typeof patient_id !== 'string') {
      patient_id = String(patient_id);
    }

    const {
      doctor_id,
      hospital_id,
      appointment_date,
      appointment_time,
      appointment_end_time,
      reason_for_visit,
      notes,
    } = req.body;

    // Validate input
    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required. Make sure you are logged in.',
        debug: req.user ? 'JWT present but patient_id not found' : 'No JWT token found',
      });
    }

    if (!doctor_id || !hospital_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID, Hospital ID, Appointment Date, and Appointment Time are required',
      });
    }

    // Validate date is in the future
    const selectedDate = new Date(appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot book appointments for past dates',
      });
    }

    // Check if doctor exists and is active at this hospital
    const doctorCheck = await db.query(
      `SELECT d.* FROM doctor d
       INNER JOIN doctor_hospital dh ON d.doctor_id = dh.doctor_id
       WHERE d.doctor_id = $1 AND dh.hospital_id = $2 AND dh.is_active = true`,
      [doctor_id, hospital_id]
    );

    if (!doctorCheck.rows || !doctorCheck.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found or not available at this hospital',
      });
    }

    // Check if patient exists
    const patientCheck = await db.query(`SELECT patient_id FROM patient WHERE patient_id = $1`, [
      patient_id,
    ]);

    if (!patientCheck.rows || !patientCheck.rows.length) {
      return res.status(404).json({
        success: false,
        message: 'Patient not found',
      });
    }

    // Create the appointment
    const appointment = await AppointmentModel.createAppointment({
      patient_id,
      doctor_id,
      hospital_id,
      appointment_date,
      appointment_time,
      appointment_end_time,
      reason_for_visit,
      notes,
    });

    res.status(201).json({
      success: true,
      message: 'Appointment booked successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Error booking appointment:', error);

    // Check if error is about double booking
    if (error.message.includes('already booked')) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to book appointment',
      error: error.message,
    });
  }
};

// Get appointments by patient
const getPatientAppointments = async (req, res) => {
  try {
    // Extract patient_id from JWT or params
    let patient_id = null;
    
    if (req.user) {
      patient_id = req.user.patient_id || req.user.id || req.user.userId || req.user.user_id;
    }
    
    if (!patient_id) {
      patient_id = req.params.patient_id;
    }

    const { status } = req.query;

    if (!patient_id) {
      return res.status(400).json({
        success: false,
        message: 'Patient ID is required',
      });
    }

    const appointments = await AppointmentModel.getAppointmentsByPatient(patient_id, status);

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Error fetching patient appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message,
    });
  }
};

// Get appointments by doctor (for hospital dashboard)
const getDoctorAppointments = async (req, res) => {
  try {
    // Extract doctor_id from JWT or params
    let doctor_id = null;
    
    if (req.user) {
      doctor_id = req.user.doctor_id || req.user.id || req.user.userId || req.user.user_id;
    }
    
    if (!doctor_id) {
      doctor_id = req.params.doctor_id;
    }

    const { hospital_id, date } = req.query;

    if (!doctor_id) {
      return res.status(400).json({
        success: false,
        message: 'Doctor ID is required',
      });
    }

    const appointments = await AppointmentModel.getAppointmentsByDoctor(doctor_id, hospital_id, date);

    res.status(200).json({
      success: true,
      data: appointments,
    });
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message,
    });
  }
};

// Get appointments by hospital (for hospital dashboard)
const getHospitalAppointments = async (req, res) => {
  try {
    const { hospital_id } = req.params;
    const { status, date, page = 1, limit = 20 } = req.query;

    if (!hospital_id) {
      return res.status(400).json({
        success: false,
        message: 'Hospital ID is required',
      });
    }

    const offset = (page - 1) * limit;

    let query = `
      SELECT 
        a.*,
        d.doctor_name,
        d.specialization,
        p.first_name,
        p.last_name,
        p.mobile_number
      FROM appointments a
      JOIN doctor d ON a.doctor_id = d.doctor_id
      JOIN patient p ON a.patient_id = p.patient_id
      WHERE a.hospital_id = $1
    `;

    const params = [hospital_id];

    if (status) {
      query += ` AND a.status = $${params.length + 1}`;
      params.push(status);
    }

    if (date) {
      query += ` AND a.appointment_date = $${params.length + 1}`;
      params.push(date);
    }

    query += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const result = await db.query(query, params);

    // Get total count
    let countQuery = `SELECT COUNT(*) as total FROM appointments WHERE hospital_id = $1`;
    const countParams = [hospital_id];

    if (status) {
      countQuery += ` AND status = $${countParams.length + 1}`;
      countParams.push(status);
    }

    if (date) {
      countQuery += ` AND appointment_date = $${countParams.length + 1}`;
      countParams.push(date);
    }

    const countResult = await db.query(countQuery, countParams);
    const total = parseInt(countResult.rows[0].total);

    res.status(200).json({
      success: true,
      data: result.rows,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching hospital appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointments',
      error: error.message,
    });
  }
};

// Get appointment details
const getAppointmentDetails = async (req, res) => {
  try {
    const { appointment_id } = req.params;

    if (!appointment_id) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID is required',
      });
    }

    const appointment = await AppointmentModel.getAppointmentById(appointment_id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      data: appointment,
    });
  } catch (error) {
    console.error('Error fetching appointment details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch appointment details',
      error: error.message,
    });
  }
};

// Cancel appointment
const cancelAppointment = async (req, res) => {
  try {
    const { appointment_id } = req.params;
    const { cancellation_reason } = req.body;

    if (!appointment_id) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID is required',
      });
    }

    const appointment = await AppointmentModel.cancelAppointment(appointment_id, cancellation_reason);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment cancelled successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to cancel appointment',
      error: error.message,
    });
  }
};

// Reschedule appointment
const rescheduleAppointment = async (req, res) => {
  try {
    const { appointment_id } = req.params;
    const { appointment_date, appointment_time, appointment_end_time } = req.body;

    // Validate input
    if (!appointment_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID, Date, and Time are required',
      });
    }

    // Validate date is in the future
    const selectedDate = new Date(appointment_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reschedule to past dates',
      });
    }

    const appointment = await AppointmentModel.rescheduleAppointment(
      appointment_id,
      appointment_date,
      appointment_time,
      appointment_end_time
    );

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment rescheduled successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Error rescheduling appointment:', error);

    if (error.message.includes('already booked')) {
      return res.status(409).json({
        success: false,
        message: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: 'Failed to reschedule appointment',
      error: error.message,
    });
  }
};

// Update appointment status (for hospital staff)
const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointment_id } = req.params;
    const { status } = req.body;

    // Validate input
    if (!appointment_id || !status) {
      return res.status(400).json({
        success: false,
        message: 'Appointment ID and Status are required',
      });
    }

    // Validate status
    const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    const appointment = await AppointmentModel.updateAppointmentStatus(appointment_id, status);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Appointment status updated successfully',
      data: appointment,
    });
  } catch (error) {
    console.error('Error updating appointment status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update appointment status',
      error: error.message,
    });
  }
};

module.exports = {
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
};
