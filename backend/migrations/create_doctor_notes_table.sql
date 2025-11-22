-- Create doctor_notes table for storing AI-generated clinical notes
CREATE TABLE IF NOT EXISTS doctor_notes (
  id SERIAL PRIMARY KEY,
  patient_id INTEGER NOT NULL,
  doctor_id VARCHAR(50) NOT NULL,
  note_type VARCHAR(50) DEFAULT 'structured_note', -- 'raw_note' or 'structured_note'
  raw_input TEXT NOT NULL, -- Original doctor input/keywords
  presenting_complaints TEXT,
  clinical_interpretation TEXT,
  relevant_medical_history TEXT,
  lab_report_summary TEXT,
  assessment_impression TEXT,
  full_structured_note TEXT, -- Complete formatted note
  status VARCHAR(50) DEFAULT 'draft', -- 'draft', 'pending_review', 'approved', 'rejected', 'archived'
  lab_reports_used INTEGER[] DEFAULT ARRAY[]::INTEGER[], -- Array of lab report IDs used
  medical_history_used INTEGER[] DEFAULT ARRAY[]::INTEGER[], -- Array of medical history IDs used
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_doctor_notes_patient_id ON doctor_notes(patient_id);
CREATE INDEX IF NOT EXISTS idx_doctor_notes_doctor_id ON doctor_notes(doctor_id);
CREATE INDEX IF NOT EXISTS idx_doctor_notes_status ON doctor_notes(status);
CREATE INDEX IF NOT EXISTS idx_doctor_notes_created_at ON doctor_notes(created_at DESC);

-- Add trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_doctor_notes_updated_at
BEFORE UPDATE ON doctor_notes
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
