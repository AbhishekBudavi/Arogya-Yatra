-- Migration: Update doctor table with required columns

-- Add missing columns to doctor table if they don't exist
ALTER TABLE doctor ADD COLUMN IF NOT EXISTS specialization VARCHAR(100);
ALTER TABLE doctor ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE doctor ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE doctor ADD COLUMN IF NOT EXISTS license_id VARCHAR(255);
ALTER TABLE doctor ADD COLUMN IF NOT EXISTS hospital_id INT;
ALTER TABLE doctor ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE doctor ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE doctor ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Modify password column to allow NULL values (for doctors registered by hospitals)
ALTER TABLE doctor ALTER COLUMN password DROP NOT NULL;

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_doctor_email ON doctor(email);
CREATE INDEX IF NOT EXISTS idx_doctor_phone ON doctor(phone);
CREATE INDEX IF NOT EXISTS idx_doctor_license_id ON doctor(license_id);
CREATE INDEX IF NOT EXISTS idx_doctor_hospital_id ON doctor(hospital_id);
CREATE INDEX IF NOT EXISTS idx_doctor_active ON doctor(is_active);
CREATE INDEX IF NOT EXISTS idx_doctor_specialization ON doctor(specialization);
