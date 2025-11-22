-- Migration: Create doctor table with all required fields

-- Create doctor table
CREATE TABLE IF NOT EXISTS doctor (
  doctor_id VARCHAR(255) PRIMARY KEY,
  doctor_name VARCHAR(255) NOT NULL,
  specialization VARCHAR(100),
  email VARCHAR(255),
  phone VARCHAR(20),
  password VARCHAR(255),
  about_me TEXT,
  hospital_id INT,
  license_id VARCHAR(255) UNIQUE,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (hospital_id) REFERENCES hospitals(hospital_id) ON DELETE SET NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_doctor_email ON doctor(email);
CREATE INDEX IF NOT EXISTS idx_doctor_phone ON doctor(phone);
CREATE INDEX IF NOT EXISTS idx_doctor_license_id ON doctor(license_id);
CREATE INDEX IF NOT EXISTS idx_doctor_hospital_id ON doctor(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctor_active ON doctor(is_active);
CREATE INDEX IF NOT EXISTS idx_doctor_specialization ON doctor(specialization);

-- Add comments
COMMENT ON TABLE doctor IS 'Stores doctor information and credentials';
COMMENT ON COLUMN doctor.doctor_id IS 'Unique identifier for doctor';
COMMENT ON COLUMN doctor.doctor_name IS 'Full name of the doctor';
COMMENT ON COLUMN doctor.specialization IS 'Medical specialization of the doctor';
COMMENT ON COLUMN doctor.email IS 'Email address of the doctor';
COMMENT ON COLUMN doctor.phone IS 'Contact phone number of the doctor';
COMMENT ON COLUMN doctor.license_id IS 'Medical license ID of the doctor';
COMMENT ON COLUMN doctor.hospital_id IS 'Primary hospital association';
