-- PostgreSQL Query to Create Hospital Table

-- Drop existing table if it exists (optional, for fresh setup)
-- DROP TABLE IF EXISTS hospitals;

-- Create the hospitals table
CREATE TABLE hospitals (
  hospital_id SERIAL PRIMARY KEY,
  custom_hospital_id VARCHAR(255) UNIQUE NOT NULL,
  hospital_name VARCHAR(255) NOT NULL,
  hospital_type VARCHAR(50),
  address TEXT,
  pincode VARCHAR(10),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  admin_name VARCHAR(255) NOT NULL,
  admin_mobile_number VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  contact_number VARCHAR(20),
  alternate_contact VARCHAR(20),
  departments TEXT,
  bed_count INT,
  icu_available BOOLEAN DEFAULT false,
  emergency_services BOOLEAN DEFAULT false,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

-- Create indexes for frequently queried fields
CREATE INDEX idx_hospital_custom_id ON hospitals(custom_hospital_id);
CREATE INDEX idx_hospital_mobile ON hospitals(admin_mobile_number);
CREATE INDEX idx_hospital_email ON hospitals(email);
CREATE INDEX idx_hospital_active ON hospitals(is_active);

-- Add comment to table
COMMENT ON TABLE hospitals IS 'Stores hospital registration and profile information';
COMMENT ON COLUMN hospitals.custom_hospital_id IS 'Unique custom identifier for hospital';
COMMENT ON COLUMN hospitals.password IS 'Hashed password for hospital admin';
COMMENT ON COLUMN hospitals.admin_mobile_number IS 'Primary contact number for hospital admin';

-- Sample insert query (uncomment to use):
-- INSERT INTO hospitals (
--   custom_hospital_id, hospital_name, hospital_type, address, pincode, 
--   city, state, country, admin_name, admin_mobile_number, password, email, 
--   created_by, updated_by
-- ) VALUES (
--   'HOSP001', 'City General Hospital', 'Private', '123 Medical Street', '400001',
--   'Mumbai', 'Maharashtra', 'India', 'Dr. Sharma', '9876543210', 'hashed_password_here', 
--   'admin@cityhospital.com', 'system', 'system'
-- );
