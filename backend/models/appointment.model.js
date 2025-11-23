const db = require('../config/db');

// Validation helpers
const validateDateFormat = (dateStr) => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateStr)) {
    throw new Error('Invalid date format. Use YYYY-MM-DD');
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    throw new Error('Invalid date value');
  }
  return date;
};

const validateTimeFormat = (timeStr) => {
  const timeRegex = /^\d{2}:\d{2}$/;
  if (!timeRegex.test(timeStr)) {
    throw new Error('Invalid time format. Use HH:MM');
  }
  const [hours, minutes] = timeStr.split(':').map(Number);
  if (hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
    throw new Error('Invalid time values');
  }
  return true;
};

const AppointmentModel = {
  // Create a new appointment
  createAppointment: async ({
    patient_id,
    doctor_id,
    hospital_id,
    appointment_date,
    appointment_time,
    appointment_end_time,
    reason_for_visit,
    notes,
  }) => {
    try {
      // Comprehensive input validation
      console.log('AppointmentModel.createAppointment called with:', {
        patient_id,
        doctor_id,
        hospital_id,
        appointment_date,
        appointment_time,
      });
      
      if (!patient_id) {
        throw new Error('Valid patient_id is required');
      }
      
      // Convert patient_id to string if it's a number
      const patientIdStr = String(patient_id);
      
      if (!doctor_id || typeof doctor_id !== 'string') {
        throw new Error('Valid doctor_id is required');
      }
      if (!hospital_id || isNaN(hospital_id)) {
        throw new Error('Valid hospital_id is required');
      }
      
      // Validate date and time
      validateDateFormat(appointment_date);
      validateTimeFormat(appointment_time);
      if (appointment_end_time) {
        validateTimeFormat(appointment_end_time);
      }

      // First check if the slot is available (double-booking prevention)
      const conflictCheck = await db.query(
        `SELECT appointment_id FROM appointments 
         WHERE doctor_id = $1 
         AND hospital_id = $2 
         AND appointment_date = $3 
         AND appointment_time = $4 
         AND status IN ('scheduled', 'confirmed')
         LIMIT 1`,
        [doctor_id, hospital_id, appointment_date, appointment_time]
      );

      if (conflictCheck.rows && conflictCheck.rows.length > 0) {
        throw new Error('This time slot is already booked. Please select another time.');
      }

      // Create the appointment
      const result = await db.query(
        `INSERT INTO appointments (
          patient_id, doctor_id, hospital_id, appointment_date, 
          appointment_time, appointment_end_time, reason_for_visit, notes, status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'scheduled', NOW(), NOW())
        RETURNING *`,
        [
          patientIdStr,
          doctor_id,
          hospital_id,
          appointment_date,
          appointment_time,
          appointment_end_time || null,
          reason_for_visit || null,
          notes || null,
        ]
      );

      if (!result.rows || !result.rows[0]) {
        throw new Error('Failed to create appointment in database');
      }

      // Mark the slot as unavailable (non-blocking - log if fails)
      try {
        await db.query(
          `UPDATE appointment_slots 
           SET is_available = false, appointment_id = $1, updated_at = NOW()
           WHERE doctor_id = $2 
           AND hospital_id = $3 
           AND appointment_date = $4 
           AND start_time = $5`,
          [result.rows[0].appointment_id, doctor_id, hospital_id, appointment_date, appointment_time]
        );
      } catch (slotError) {
        console.warn('Warning: Failed to update appointment_slots:', slotError.message);
        // Don't fail the appointment creation if slot update fails
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw new Error(`Failed to create appointment: ${error.message}`);
    }
  },

  // Get appointments by patient ID
  getAppointmentsByPatient: async (patient_id, status = null) => {
    try {
      if (!patient_id) {
        throw new Error('Valid patient_id is required');
      }

      // Convert to string if it's a number
      patient_id = String(patient_id);

      let query = `
        SELECT 
          a.*,
          d.doctor_name,
          d.specialization,
          d.email as doctor_email,
          d.phone as doctor_phone,
          h.hospital_name,
          h.address as hospital_address,
          p.first_name,
          p.last_name
        FROM appointments a
        LEFT JOIN doctor d ON a.doctor_id = d.doctor_id
        LEFT JOIN hospitals h ON a.hospital_id = h.hospital_id
        LEFT JOIN patient p ON a.patient_id = p.patient_id
        WHERE a.patient_id = $1
      `;

      const params = [patient_id];

      if (status && typeof status === 'string') {
        query += ` AND a.status = $2`;
        params.push(status);
      }

      query += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT 100`;

      const result = await db.query(query, params);
      return result.rows || [];
    } catch (error) {
      console.error('Error getting patient appointments:', error);
      throw new Error(`Failed to get patient appointments: ${error.message}`);
    }
  },

  // Get appointments by doctor ID (for hospital dashboard)
  getAppointmentsByDoctor: async (doctor_id, hospital_id = null, date = null) => {
    try {
      if (!doctor_id || typeof doctor_id !== 'string') {
        throw new Error('Valid doctor_id is required');
      }

      let query = `
        SELECT 
          a.*,
          d.doctor_name,
          d.specialization,
          h.hospital_name,
          p.first_name,
          p.last_name,
          p.mobile_number,
          p.blood_group,
          p.gender
        FROM appointments a
        LEFT JOIN doctor d ON a.doctor_id = d.doctor_id
        LEFT JOIN hospitals h ON a.hospital_id = h.hospital_id
        LEFT JOIN patient p ON a.patient_id = p.patient_id
        WHERE a.doctor_id = $1
      `;

      const params = [doctor_id];
      let paramCount = 2;

      if (hospital_id && !isNaN(hospital_id)) {
        query += ` AND a.hospital_id = $${paramCount}`;
        params.push(hospital_id);
        paramCount++;
      }

      if (date) {
        try {
          validateDateFormat(date);
          query += ` AND a.appointment_date = $${paramCount}`;
          params.push(date);
          paramCount++;
        } catch (dateError) {
          console.warn('Invalid date filter:', dateError.message);
        }
      }

      query += ` AND a.status IN ('scheduled', 'confirmed') ORDER BY a.appointment_date ASC, a.appointment_time ASC LIMIT 100`;

      const result = await db.query(query, params);
      return result.rows || [];
    } catch (error) {
      console.error('Error getting doctor appointments:', error);
      throw new Error(`Failed to get doctor appointments: ${error.message}`);
    }
  },

  // Get appointments by hospital ID (for hospital dashboard)
  getAppointmentsByHospital: async (hospital_id, status = null, date = null) => {
    try {
      if (!hospital_id || isNaN(hospital_id)) {
        throw new Error('Valid hospital_id is required');
      }

      let query = `
        SELECT 
          a.*,
          d.doctor_name,
          d.specialization,
          p.first_name,
          p.last_name,
          p.mobile_number
        FROM appointments a
        LEFT JOIN doctor d ON a.doctor_id = d.doctor_id
        LEFT JOIN patient p ON a.patient_id = p.patient_id
        WHERE a.hospital_id = $1
      `;

      const params = [hospital_id];
      let paramCount = 2;

      if (status && typeof status === 'string') {
        query += ` AND a.status = $${paramCount}`;
        params.push(status);
        paramCount++;
      }

      if (date) {
        try {
          validateDateFormat(date);
          query += ` AND a.appointment_date = $${paramCount}`;
          params.push(date);
          paramCount++;
        } catch (dateError) {
          console.warn('Invalid date filter:', dateError.message);
        }
      }

      query += ` ORDER BY a.appointment_date DESC, a.appointment_time DESC LIMIT 500`;

      const result = await db.query(query, params);
      return result.rows || [];
    } catch (error) {
      console.error('Error getting hospital appointments:', error);
      throw new Error(`Failed to get hospital appointments: ${error.message}`);
    }
  },

  // Get available slots for a doctor on a specific date
  getAvailableSlots: async (doctor_id, hospital_id, appointment_date) => {
    try {
      if (!doctor_id || typeof doctor_id !== 'string') {
        throw new Error('Valid doctor_id is required');
      }
      if (!hospital_id || isNaN(hospital_id)) {
        throw new Error('Valid hospital_id is required');
      }
      validateDateFormat(appointment_date);

      // Get doctor's availability schedule (days and times)
      const availabilityResult = await db.query(
        `SELECT * FROM doctor_availability 
         WHERE doctor_id = $1 AND hospital_id = $2 AND is_active = true
         LIMIT 1`,
        [doctor_id, hospital_id]
      );

      if (!availabilityResult.rows || !availabilityResult.rows.length) {
        throw new Error('Doctor has no availability schedule set');
      }

      // Check if the appointment date falls on a day when doctor is available
      const dayOfWeekNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];
      
      try {
        const appointmentDateObj = new Date(appointment_date);
        const dayOfWeek = dayOfWeekNames[appointmentDateObj.getDay()];

        const daySchedule = availabilityResult.rows.find((av) => av.day_of_week === dayOfWeek);
        if (!daySchedule) {
          return {
            available_slots: [],
            doctor_availability: null,
            message: `Doctor is not available on ${dayOfWeek}s`,
          };
        }

        // Validate availability times
        if (!daySchedule.start_time || !daySchedule.end_time) {
          throw new Error('Doctor availability schedule has invalid times');
        }

        // Get existing booked appointments for this date
        const bookedSlotsResult = await db.query(
          `SELECT appointment_time FROM appointments 
           WHERE doctor_id = $1 
           AND hospital_id = $2 
           AND appointment_date = $3 
           AND status IN ('scheduled', 'confirmed')`,
          [doctor_id, hospital_id, appointment_date]
        );

        const bookedSlots = (bookedSlotsResult.rows || []).map((row) => row.appointment_time);

        // Generate available slots based on doctor's availability
        const slots = AppointmentModel.generateSlots(
          daySchedule.start_time,
          daySchedule.end_time,
          30, // 30-minute slots
          bookedSlots
        );

        return {
          available_slots: slots,
          doctor_availability: daySchedule,
        };
      } catch (dateError) {
        throw new Error(`Date processing error: ${dateError.message}`);
      }
    } catch (error) {
      console.error('Error getting available slots:', error);
      throw new Error(`Failed to get available slots: ${error.message}`);
    }
  },

  // Generate time slots with proper validation
  generateSlots: (startTime, endTime, slotDuration = 30, bookedSlots = []) => {
    const slots = [];
    
    try {
      if (!startTime || !endTime) {
        throw new Error('Start time and end time are required');
      }

      validateTimeFormat(startTime);
      validateTimeFormat(endTime);

      if (slotDuration <= 0 || !Number.isInteger(slotDuration)) {
        throw new Error('Slot duration must be a positive integer');
      }

      const [startHour, startMin] = startTime.split(':').map(Number);
      const [endHour, endMin] = endTime.split(':').map(Number);

      // Convert to minutes for easier calculation
      const startTotalMin = startHour * 60 + startMin;
      const endTotalMin = endHour * 60 + endMin;

      if (startTotalMin >= endTotalMin) {
        throw new Error('Start time must be before end time');
      }

      // Generate slots
      for (let minutes = startTotalMin; minutes < endTotalMin; minutes += slotDuration) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const timeStr = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        
        // Check if slot is booked
        if (!bookedSlots.includes(timeStr)) {
          slots.push(timeStr);
        }
      }

      return slots;
    } catch (error) {
      console.error('Error generating slots:', error);
      return [];
    }
  },

  // Update appointment status
  updateAppointmentStatus: async (appointment_id, status, cancellationReason = null) => {
    try {
      if (!appointment_id || isNaN(appointment_id)) {
        throw new Error('Valid appointment_id is required');
      }
      if (!status || typeof status !== 'string') {
        throw new Error('Valid status is required');
      }

      const validStatuses = ['scheduled', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      let query = `
        UPDATE appointments 
        SET status = $1, updated_at = NOW()
      `;
      const params = [status];

      if (cancellationReason && typeof cancellationReason === 'string') {
        query += `, cancellation_reason = $2`;
        params.push(cancellationReason);
      }

      query += ` WHERE appointment_id = $${params.length + 1} RETURNING *`;
      params.push(appointment_id);

      const result = await db.query(query, params);
      
      if (!result.rows || !result.rows[0]) {
        throw new Error('Appointment not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error updating appointment status:', error);
      throw new Error(`Failed to update appointment status: ${error.message}`);
    }
  },

  // Cancel appointment
  cancelAppointment: async (appointment_id, cancellationReason = null) => {
    try {
      if (!appointment_id || isNaN(appointment_id)) {
        throw new Error('Valid appointment_id is required');
      }

      const result = await db.query(
        `UPDATE appointments 
         SET status = 'cancelled', cancellation_reason = $2, updated_at = NOW()
         WHERE appointment_id = $1 
         RETURNING *`,
        [appointment_id, cancellationReason || null]
      );

      if (!result.rows || !result.rows[0]) {
        throw new Error('Appointment not found');
      }

      // Mark the slot as available again (non-blocking)
      try {
        const appointment = result.rows[0];
        if (appointment.doctor_id && appointment.hospital_id && appointment.appointment_date && appointment.appointment_time) {
          await db.query(
            `UPDATE appointment_slots 
             SET is_available = true, appointment_id = NULL, updated_at = NOW()
             WHERE doctor_id = $1 
             AND hospital_id = $2 
             AND appointment_date = $3 
             AND start_time = $4`,
            [appointment.doctor_id, appointment.hospital_id, appointment.appointment_date, appointment.appointment_time]
          );
        }
      } catch (slotError) {
        console.warn('Warning: Failed to update slots on cancellation:', slotError.message);
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      throw new Error(`Failed to cancel appointment: ${error.message}`);
    }
  },

  // Get appointment by ID
  getAppointmentById: async (appointment_id) => {
    try {
      if (!appointment_id || isNaN(appointment_id)) {
        throw new Error('Valid appointment_id is required');
      }

      const result = await db.query(
        `SELECT 
          a.*,
          d.doctor_name,
          d.specialization,
          d.email as doctor_email,
          d.phone as doctor_phone,
          h.hospital_name,
          h.address as hospital_address,
          p.first_name,
          p.last_name,
          p.mobile_number
        FROM appointments a
        LEFT JOIN doctor d ON a.doctor_id = d.doctor_id
        LEFT JOIN hospitals h ON a.hospital_id = h.hospital_id
        LEFT JOIN patient p ON a.patient_id = p.patient_id
        WHERE a.appointment_id = $1`,
        [appointment_id]
      );

      if (!result.rows || !result.rows[0]) {
        throw new Error('Appointment not found');
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error getting appointment:', error);
      throw new Error(`Failed to get appointment: ${error.message}`);
    }
  },

  // Reschedule appointment
  rescheduleAppointment: async (
    appointment_id,
    new_date,
    new_time,
    new_end_time
  ) => {
    try {
      if (!appointment_id || isNaN(appointment_id)) {
        throw new Error('Valid appointment_id is required');
      }
      validateDateFormat(new_date);
      validateTimeFormat(new_time);
      if (new_end_time) {
        validateTimeFormat(new_end_time);
      }

      // Get existing appointment
      const appointment = await this.getAppointmentById(appointment_id);
      if (!appointment) {
        throw new Error('Appointment not found');
      }

      // Check if new slot is available
      const conflictCheck = await db.query(
        `SELECT appointment_id FROM appointments 
         WHERE doctor_id = $1 
         AND hospital_id = $2 
         AND appointment_date = $3 
         AND appointment_time = $4 
         AND appointment_id != $5
         AND status IN ('scheduled', 'confirmed')
         LIMIT 1`,
        [appointment.doctor_id, appointment.hospital_id, new_date, new_time, appointment_id]
      );

      if (conflictCheck.rows && conflictCheck.rows.length > 0) {
        throw new Error('This time slot is already booked. Please select another time.');
      }

      // Mark old slot as available (non-blocking)
      try {
        await db.query(
          `UPDATE appointment_slots 
           SET is_available = true, appointment_id = NULL, updated_at = NOW()
           WHERE appointment_id = $1`,
          [appointment_id]
        );
      } catch (slotError) {
        console.warn('Warning: Failed to release old slot:', slotError.message);
      }

      // Update appointment
      const result = await db.query(
        `UPDATE appointments 
         SET appointment_date = $1, appointment_time = $2, appointment_end_time = $3, 
             status = 'scheduled', updated_at = NOW()
         WHERE appointment_id = $4 
         RETURNING *`,
        [new_date, new_time, new_end_time || null, appointment_id]
      );

      if (!result.rows || !result.rows[0]) {
        throw new Error('Failed to update appointment');
      }

      // Mark new slot as unavailable (non-blocking)
      try {
        await db.query(
          `UPDATE appointment_slots 
           SET is_available = false, appointment_id = $1, updated_at = NOW()
           WHERE doctor_id = $2 
           AND hospital_id = $3 
           AND appointment_date = $4 
           AND start_time = $5`,
          [appointment_id, appointment.doctor_id, appointment.hospital_id, new_date, new_time]
        );
      } catch (slotError) {
        console.warn('Warning: Failed to mark new slot as unavailable:', slotError.message);
      }

      return result.rows[0];
    } catch (error) {
      console.error('Error rescheduling appointment:', error);
      throw new Error(`Failed to reschedule appointment: ${error.message}`);
    }
  },

  // Populate appointment slots for a doctor for multiple dates
  populateAppointmentSlots: async (doctor_id, hospital_id, start_date, end_date) => {
    try {
      if (!doctor_id || typeof doctor_id !== 'string') {
        throw new Error('Valid doctor_id is required');
      }
      if (!hospital_id || isNaN(hospital_id)) {
        throw new Error('Valid hospital_id is required');
      }
      validateDateFormat(start_date);
      validateDateFormat(end_date);

      // Get doctor's availability schedule
      const availabilityResult = await db.query(
        `SELECT * FROM doctor_availability 
         WHERE doctor_id = $1 AND hospital_id = $2 AND is_active = true`,
        [doctor_id, hospital_id]
      );

      if (!availabilityResult.rows || !availabilityResult.rows.length) {
        throw new Error('Doctor has no availability schedule set');
      }

      const availability = availabilityResult.rows;
      const dayOfWeekNames = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      let current = new Date(start_date);
      const end = new Date(end_date);
      let slotsCreated = 0;

      while (current <= end) {
        try {
          const dayOfWeek = dayOfWeekNames[current.getDay()];
          const dateStr = current.toISOString().split('T')[0];
          const dayAvailability = availability.find((av) => av.day_of_week === dayOfWeek);

          if (dayAvailability && dayAvailability.start_time && dayAvailability.end_time) {
            // Generate slots for this day
            const slots = AppointmentModel.generateSlots(
              dayAvailability.start_time,
              dayAvailability.end_time,
              30 // 30-minute slots
            );

            for (const slot of slots) {
              try {
                // Check if slot already exists
                const existingSlot = await db.query(
                  `SELECT slot_id FROM appointment_slots 
                   WHERE doctor_id = $1 
                   AND hospital_id = $2 
                   AND appointment_date = $3 
                   AND start_time = $4
                   LIMIT 1`,
                  [doctor_id, hospital_id, dateStr, slot]
                );

                if (!existingSlot.rows || !existingSlot.rows.length) {
                  const [hour, min] = slot.split(':').map(Number);
                  const endTime = new Date();
                  endTime.setHours(hour, min + 30, 0);
                  const endHours = Math.floor(endTime.getMinutes() / 60) + endTime.getHours();
                  const endMins = endTime.getMinutes() % 60;
                  const endTimeStr = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;

                  await db.query(
                    `INSERT INTO appointment_slots (doctor_id, hospital_id, appointment_date, start_time, end_time, is_available, created_at, updated_at)
                     VALUES ($1, $2, $3, $4, $5, true, NOW(), NOW())`,
                    [doctor_id, hospital_id, dateStr, slot, endTimeStr]
                  );
                  slotsCreated++;
                }
              } catch (slotError) {
                console.warn(`Failed to create slot ${slot} for ${dateStr}:`, slotError.message);
              }
            }
          }
        } catch (dayError) {
          console.warn(`Failed to process date ${current.toISOString()}:`, dayError.message);
        }

        current.setDate(current.getDate() + 1);
      }

      return { 
        message: 'Appointment slots populated successfully',
        slotsCreated 
      };
    } catch (error) {
      console.error('Error populating appointment slots:', error);
      throw new Error(`Failed to populate appointment slots: ${error.message}`);
    }
  },
};

module.exports = AppointmentModel;
