-- Migration: Add doctor availability (days and timings) support

-- Create doctor_availability table to store doctor availability information
CREATE TABLE IF NOT EXISTS doctor_availability (
  availability_id SERIAL PRIMARY KEY,
  doctor_id VARCHAR(255) NOT NULL,
  hospital_id INT,
  day_of_week VARCHAR(20) NOT NULL,
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE
);

-- Create indexes for efficient querying
CREATE INDEX idx_doctor_availability_doctor_id ON doctor_availability(doctor_id);
CREATE INDEX idx_doctor_availability_hospital_id ON doctor_availability(hospital_id);
CREATE INDEX idx_doctor_availability_day ON doctor_availability(day_of_week);

-- Add license_id column to doctor table if it doesn't exist
ALTER TABLE doctor ADD COLUMN IF NOT EXISTS license_id VARCHAR(255) UNIQUE;
ALTER TABLE doctor ADD COLUMN IF NOT EXISTS hospital_id INT;

-- Create doctor_hospital junction table to manage doctor-hospital relationships
CREATE TABLE IF NOT EXISTS doctor_hospital (
  doctor_hospital_id SERIAL PRIMARY KEY,
  doctor_id VARCHAR(255) NOT NULL,
  hospital_id INT NOT NULL,
  license_id VARCHAR(255),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(doctor_id, hospital_id),
  FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id) ON DELETE CASCADE,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_doctor_hospital_doctor_id ON doctor_hospital(doctor_id);
CREATE INDEX idx_doctor_hospital_hospital_id ON doctor_hospital(hospital_id);

-- Add comments
COMMENT ON TABLE doctor_availability IS 'Stores doctor availability slots (day and time ranges)';
COMMENT ON TABLE doctor_hospital IS 'Junction table managing doctor-hospital relationships with license information';
COMMENT ON COLUMN doctor_availability.day_of_week IS 'Day of week (Monday, Tuesday, etc.)';
COMMENT ON COLUMN doctor_availability.start_time IS 'Availability start time (HH:MM format)';
COMMENT ON COLUMN doctor_availability.end_time IS 'Availability end time (HH:MM format)';
COMMENT ON COLUMN doctor_hospital.license_id IS 'Doctor license ID for this hospital';
