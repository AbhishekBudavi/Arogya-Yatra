-- Migration: Create appointments table

-- Create appointments table to store patient appointments with doctors
CREATE TABLE IF NOT EXISTS appointments (
  appointment_id SERIAL PRIMARY KEY,
  patient_id VARCHAR(255) NOT NULL,
  doctor_id VARCHAR(255) NOT NULL,
  hospital_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  appointment_time VARCHAR(5) NOT NULL,
  appointment_end_time VARCHAR(5),
  status VARCHAR(50) DEFAULT 'scheduled',
  reason_for_visit VARCHAR(500),
  notes TEXT,
  cancellation_reason VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patient(patient_id) ON DELETE CASCADE,
  FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id) ON DELETE CASCADE
);

-- Create appointment_slots table to track individual time slots for appointments
CREATE TABLE IF NOT EXISTS appointment_slots (
  slot_id SERIAL PRIMARY KEY,
  doctor_id VARCHAR(255) NOT NULL,
  hospital_id INT NOT NULL,
  appointment_date DATE NOT NULL,
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  is_available BOOLEAN DEFAULT true,
  appointment_id INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id) ON DELETE CASCADE,
  FOREIGN KEY (appointment_id) REFERENCES appointments(appointment_id) ON DELETE SET NULL
);

-- Create indexes for efficient querying
CREATE INDEX idx_appointments_patient_id ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX idx_appointments_hospital_id ON appointments(hospital_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_doctor_date ON appointments(doctor_id, appointment_date);
CREATE UNIQUE INDEX idx_appointments_unique_slot ON appointments(doctor_id, hospital_id, appointment_date, appointment_time) WHERE status IN ('scheduled', 'confirmed');

CREATE INDEX idx_appointment_slots_doctor_id ON appointment_slots(doctor_id);
CREATE INDEX idx_appointment_slots_hospital_id ON appointment_slots(hospital_id);
CREATE INDEX idx_appointment_slots_date ON appointment_slots(appointment_date);
CREATE INDEX idx_appointment_slots_availability ON appointment_slots(doctor_id, appointment_date, is_available);

-- Add comments
COMMENT ON TABLE appointments IS 'Stores patient appointments with doctors at hospitals';
COMMENT ON TABLE appointment_slots IS 'Manages individual appointment time slots';
COMMENT ON COLUMN appointments.status IS 'Status: scheduled, confirmed, completed, cancelled, no-show, rescheduled';
COMMENT ON COLUMN appointments.reason_for_visit IS 'Reason for visiting the doctor';
COMMENT ON COLUMN appointment_slots.is_available IS 'Whether the slot is available for booking';
