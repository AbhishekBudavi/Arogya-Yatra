# Patient Appointment Feature - Complete Documentation

## Overview

The Patient Appointment Feature is a comprehensive system that allows patients to search for doctors by specialty, view available appointment slots, and book appointments at hospitals. It includes automatic double-booking prevention, real-time slot management, and hospital dashboard integration for managing appointments.

## Features

✅ **Search Doctors by Specialty** - Patients can search for doctors based on their specialization
✅ **View Available Slots** - Display available appointment dates and times based on doctor's schedule
✅ **Book Appointments** - Patients can select date/time and confirm appointments
✅ **Double-Booking Prevention** - Automatic validation to prevent slot conflicts
✅ **Hospital Dashboard** - Hospital staff can view, filter, and manage all appointments
✅ **Doctor Dashboard** - Doctors can view their scheduled appointments for each day
✅ **Appointment Management** - Cancel, reschedule, and update appointment status
✅ **Database Integration** - Complete data persistence with PostgreSQL
✅ **Error Handling** - Comprehensive validation and error responses

---

## Database Schema

### Tables Created

#### 1. `appointments`
Main table storing all patient appointments.

```sql
- appointment_id (INT, PRIMARY KEY)
- patient_id (VARCHAR, FOREIGN KEY -> patient)
- doctor_id (VARCHAR, FOREIGN KEY -> doctor)
- hospital_id (INT, FOREIGN KEY -> hospitals)
- appointment_date (DATE)
- appointment_time (VARCHAR) - HH:MM format
- appointment_end_time (VARCHAR) - HH:MM format
- status (VARCHAR) - 'scheduled', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'
- reason_for_visit (VARCHAR)
- notes (TEXT)
- cancellation_reason (VARCHAR)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Indexes:**
- `idx_appointments_patient_id` - For quick patient lookups
- `idx_appointments_doctor_id` - For quick doctor lookups
- `idx_appointments_hospital_id` - For quick hospital lookups
- `idx_appointments_date` - For date-based filtering
- `idx_appointments_status` - For status-based filtering
- `idx_appointments_doctor_date` - For doctor's schedule on specific dates
- `idx_appointments_unique_slot` - UNIQUE constraint to prevent double-booking

#### 2. `appointment_slots`
Tracks individual time slots for appointment availability management.

```sql
- slot_id (INT, PRIMARY KEY)
- doctor_id (VARCHAR, FOREIGN KEY -> doctor)
- hospital_id (INT, FOREIGN KEY -> hospitals)
- appointment_date (DATE)
- start_time (VARCHAR) - HH:MM format
- end_time (VARCHAR) - HH:MM format
- is_available (BOOLEAN)
- appointment_id (INT, FOREIGN KEY -> appointments, nullable)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Indexes:**
- `idx_appointment_slots_doctor_id`
- `idx_appointment_slots_hospital_id`
- `idx_appointment_slots_date`
- `idx_appointment_slots_availability`

---

## Backend Implementation

### File Structure

```
Backend/
├── migrations/
│   └── create_appointments_table.sql    # Database schema migration
├── models/
│   └── appointment.model.js              # Database layer with CRUD operations
├── controllers/
│   └── appointment.controller.js         # API endpoint handlers
├── routes/
│   └── appointment.routes.js             # API route definitions
└── server.js                             # Updated with appointment routes
```

### Key Backend Files

#### 1. Migration File: `create_appointments_table.sql`
- Creates `appointments` and `appointment_slots` tables
- Sets up indexes for optimal query performance
- Enforces unique constraint to prevent double-booking

#### 2. Model: `appointment.model.js`
Main database operations layer with methods:

**Core Methods:**
- `createAppointment()` - Create new appointment with double-booking check
- `getAppointmentsByPatient()` - Retrieve patient's appointments
- `getAppointmentsByDoctor()` - Retrieve doctor's appointments
- `getAppointmentsByHospital()` - Retrieve hospital's appointments
- `getAvailableSlots()` - Get available slots for a doctor on a date
- `getAppointmentById()` - Get specific appointment details
- `updateAppointmentStatus()` - Update appointment status
- `cancelAppointment()` - Cancel appointment and free up slot
- `rescheduleAppointment()` - Reschedule to new date/time
- `populateAppointmentSlots()` - Generate slots for date range

**Helper Methods:**
- `generateSlots()` - Generate time slots based on doctor availability

#### 3. Controller: `appointment.controller.js`
API endpoint handlers:

```javascript
// Public Endpoints
GET  /api/appointments/search           - Search doctors by specialty
GET  /api/appointments/slots            - Get available slots

// Patient Endpoints
POST   /api/appointments/book           - Book an appointment
GET    /api/appointments/patient        - Get patient's appointments
DELETE /api/appointments/:id/cancel     - Cancel appointment
PUT    /api/appointments/:id/reschedule - Reschedule appointment
GET    /api/appointments/:id            - Get appointment details

// Doctor Endpoints
GET    /api/appointments/doctor/appointments - Get doctor's appointments

// Hospital Endpoints
GET    /api/appointments/hospital/:id/appointments - Get hospital's appointments
PATCH  /api/appointments/:id/status             - Update appointment status
```

#### 4. Routes: `appointment.routes.js`
- Defines all appointment endpoints
- Applies appropriate authentication middleware
- Routes protected with JWT verification

---

## Frontend Implementation

### File Structure

```
FrontEnd/app/(dashboard)/dashboard/
├── patient/
│   └── appointment/
│       └── page.jsx              # Patient appointment booking UI
├── doctor/
│   └── appointments/
│       └── page.jsx              # Doctor appointments view
└── hospital/
    └── appointments/
        └── page.jsx              # Hospital appointments dashboard
```

### 1. Patient Appointment Page
**Location:** `FrontEnd/app/(dashboard)/dashboard/patient/appointment/page.jsx`

**Features:**
- Step-by-step booking wizard (4 steps)
- Search doctors by specialty
- Filter by hospital (optional)
- Select doctor from results
- Choose appointment date (30 days in advance)
- View available time slots
- Enter reason for visit and notes
- Confirm appointment booking
- Success/error messaging

**Components:**
- Search form for specialty
- Doctor list with details
- Date picker with validation
- Time slot grid selection
- Confirmation review
- Navigation between steps

**Flow:**
```
Step 1: Search Doctor
  ↓
Step 2: Select Doctor from Results
  ↓
Step 3: Choose Date & Time, Enter Details
  ↓
Step 4: Review & Confirm Booking
```

### 2. Doctor Appointments Dashboard
**Location:** `FrontEnd/app/(dashboard)/dashboard/doctor/appointments/page.jsx`

**Features:**
- View appointments for selected date
- Today's appointments highlighted
- Real-time appointment list
- Filter by date
- View appointment details (patient info, reason, etc.)
- Status indicators
- Summary statistics
  - Total appointments
  - Confirmed count
  - Scheduled count
  - Cancelled count

**Display Format:**
- Table view with columns: Time, Patient, Reason, Contact, Status
- Color-coded status badges
- Time formatting (12-hour with AM/PM)
- Patient blood type display

### 3. Hospital Appointments Dashboard
**Location:** `FrontEnd/app/(dashboard)/dashboard/hospital/appointments/page.jsx`

**Features:**
- View all hospital appointments
- Filter by status (All, Scheduled, Confirmed, Completed, Cancelled, No-Show, Rescheduled)
- Filter by date
- Pagination support (20 items per page)
- Update appointment status
- Modal dialog for status updates
- Real-time updates

**Display Format:**
- Comprehensive table with: Patient, Doctor, Specialty, Date & Time, Status, Contact, Actions
- Color-coded status badges
- Quick action buttons
- Responsive design

---

## API Endpoints

### 1. Search Doctors by Specialty

**Endpoint:** `GET /api/appointments/search`

**Query Parameters:**
```javascript
{
  specialty: "string" (required),     // e.g., "Cardiology"
  hospital_id: "number" (optional),   // Filter by hospital
  page: "number" (default: 1),        // Pagination page
  limit: "number" (default: 10)       // Results per page
}
```

**Response (200 - Success):**
```javascript
{
  success: true,
  data: [
    {
      doctor_id: "string",
      doctor_name: "string",
      specialization: "string",
      email: "string",
      phone: "string",
      hospital_id: "number",
      hospital_name: "string",
      hospital_address: "string",
      city: "string",
      state: "string",
      license_id: "string"
    }
  ],
  pagination: {
    total: "number",
    page: "number",
    limit: "number",
    pages: "number"
  }
}
```

**Error (400 - Bad Request):**
```javascript
{
  success: false,
  message: "Specialty is required"
}
```

---

### 2. Get Available Slots

**Endpoint:** `GET /api/appointments/slots`

**Query Parameters:**
```javascript
{
  doctor_id: "string" (required),
  hospital_id: "number" (required),
  appointment_date: "YYYY-MM-DD" (required)
}
```

**Response (200 - Success):**
```javascript
{
  success: true,
  data: {
    available_slots: ["09:00", "09:30", "10:00", ...],
    doctor_availability: {
      day_of_week: "Monday",
      start_time: "09:00",
      end_time: "17:00"
    }
  }
}
```

**Error Responses:**
```javascript
// 400 - Missing parameters
{
  success: false,
  message: "Doctor ID, Hospital ID, and Appointment Date are required"
}

// 400 - Past date
{
  success: false,
  message: "Cannot book appointments for past dates"
}

// 404 - Doctor not found
{
  success: false,
  message: "Doctor not found or not available at this hospital"
}

// 500 - No availability
{
  success: false,
  message: "Doctor is not available on Sundays"
}
```

---

### 3. Book Appointment

**Endpoint:** `POST /api/appointments/book`

**Authentication:** Required (Patient JWT)

**Request Body:**
```javascript
{
  doctor_id: "string" (required),
  hospital_id: "number" (required),
  appointment_date: "YYYY-MM-DD" (required),
  appointment_time: "HH:MM" (required),
  appointment_end_time: "HH:MM" (optional),
  reason_for_visit: "string" (required),
  notes: "string" (optional)
}
```

**Response (201 - Created):**
```javascript
{
  success: true,
  message: "Appointment booked successfully",
  data: {
    appointment_id: "number",
    patient_id: "string",
    doctor_id: "string",
    hospital_id: "number",
    appointment_date: "YYYY-MM-DD",
    appointment_time: "HH:MM",
    status: "scheduled",
    reason_for_visit: "string",
    created_at: "timestamp"
  }
}
```

**Error Responses:**
```javascript
// 409 - Double booking
{
  success: false,
  message: "This time slot is already booked. Please select another time."
}

// 400 - Past date
{
  success: false,
  message: "Cannot book appointments for past dates"
}

// 404 - Doctor not found
{
  success: false,
  message: "Doctor not found or not available at this hospital"
}
```

---

### 4. Get Patient Appointments

**Endpoint:** `GET /api/appointments/patient`

**Authentication:** Required (Patient JWT)

**Query Parameters:**
```javascript
{
  status: "string" (optional) // 'scheduled', 'confirmed', 'completed', 'cancelled', etc.
}
```

**Response (200 - Success):**
```javascript
{
  success: true,
  data: [
    {
      appointment_id: "number",
      patient_id: "string",
      doctor_id: "string",
      doctor_name: "string",
      specialization: "string",
      hospital_name: "string",
      appointment_date: "YYYY-MM-DD",
      appointment_time: "HH:MM",
      status: "string",
      reason_for_visit: "string"
    }
  ]
}
```

---

### 5. Get Doctor Appointments

**Endpoint:** `GET /api/appointments/doctor/appointments`

**Authentication:** Required (Doctor JWT)

**Query Parameters:**
```javascript
{
  hospital_id: "number" (optional),
  date: "YYYY-MM-DD" (optional)
}
```

**Response (200 - Success):**
```javascript
{
  success: true,
  data: [
    {
      appointment_id: "number",
      patient_id: "string",
      first_name: "string",
      last_name: "string",
      mobile_number: "string",
      blood_group: "string",
      reason_for_visit: "string",
      appointment_date: "YYYY-MM-DD",
      appointment_time: "HH:MM",
      status: "string"
    }
  ]
}
```

---

### 6. Get Hospital Appointments

**Endpoint:** `GET /api/appointments/hospital/:hospital_id/appointments`

**Authentication:** Required (Hospital JWT)

**Query Parameters:**
```javascript
{
  status: "string" (optional),
  date: "YYYY-MM-DD" (optional),
  page: "number" (default: 1),
  limit: "number" (default: 20)
}
```

**Response (200 - Success):**
```javascript
{
  success: true,
  data: [
    {
      appointment_id: "number",
      doctor_name: "string",
      specialization: "string",
      first_name: "string",
      last_name: "string",
      mobile_number: "string",
      appointment_date: "YYYY-MM-DD",
      appointment_time: "HH:MM",
      status: "string"
    }
  ],
  pagination: {
    total: "number",
    page: "number",
    limit: "number",
    pages: "number"
  }
}
```

---

### 7. Get Appointment Details

**Endpoint:** `GET /api/appointments/:appointment_id`

**Response (200 - Success):**
```javascript
{
  success: true,
  data: {
    appointment_id: "number",
    patient_id: "string",
    doctor_id: "string",
    hospital_id: "number",
    doctor_name: "string",
    specialization: "string",
    hospital_name: "string",
    first_name: "string",
    last_name: "string",
    mobile_number: "string",
    appointment_date: "YYYY-MM-DD",
    appointment_time: "HH:MM",
    status: "string",
    reason_for_visit: "string",
    notes: "string"
  }
}
```

---

### 8. Cancel Appointment

**Endpoint:** `DELETE /api/appointments/:appointment_id/cancel`

**Authentication:** Required (Patient JWT)

**Request Body:**
```javascript
{
  cancellation_reason: "string" (optional)
}
```

**Response (200 - Success):**
```javascript
{
  success: true,
  message: "Appointment cancelled successfully",
  data: {
    appointment_id: "number",
    status: "cancelled",
    cancellation_reason: "string"
  }
}
```

---

### 9. Reschedule Appointment

**Endpoint:** `PUT /api/appointments/:appointment_id/reschedule`

**Authentication:** Required (Patient JWT)

**Request Body:**
```javascript
{
  appointment_date: "YYYY-MM-DD" (required),
  appointment_time: "HH:MM" (required),
  appointment_end_time: "HH:MM" (optional)
}
```

**Response (200 - Success):**
```javascript
{
  success: true,
  message: "Appointment rescheduled successfully",
  data: {
    appointment_id: "number",
    appointment_date: "YYYY-MM-DD",
    appointment_time: "HH:MM",
    status: "scheduled"
  }
}
```

---

### 10. Update Appointment Status

**Endpoint:** `PATCH /api/appointments/:appointment_id/status`

**Authentication:** Required (Hospital JWT)

**Request Body:**
```javascript
{
  status: "string" (required)
  // Valid values: 'scheduled', 'confirmed', 'completed', 'cancelled', 'no-show', 'rescheduled'
}
```

**Response (200 - Success):**
```javascript
{
  success: true,
  message: "Appointment status updated successfully",
  data: {
    appointment_id: "number",
    status: "string",
    updated_at: "timestamp"
  }
}
```

---

## Setup & Installation

### 1. Database Migration

Run the migration to create the appointment tables:

```bash
# In the Backend directory, update the runMigrations.js to include the new migration
cd Backend
node migrations/runMigrations.js
```

Alternatively, run the SQL directly in PostgreSQL:

```sql
psql -U your_user -d your_database -f migrations/create_appointments_table.sql
```

### 2. Environment Setup

Ensure your `.env` file contains:

```env
DB_USER=your_user
DB_HOST=localhost
DB_NAME=your_database
DB_PASS=your_password
DB_PORT=5432
JWT_SECRET=your_jwt_secret
PORT=5000
```

### 3. Backend Setup

Install dependencies (if not already installed):

```bash
cd Backend
npm install
```

Start the backend server:

```bash
npm run dev
```

Server should be running on `http://localhost:5000`

### 4. Frontend Setup

Install dependencies:

```bash
cd FrontEnd
npm install
```

Start the frontend:

```bash
npm run dev
```

Frontend should be accessible at `http://localhost:3000`

---

## Usage Guide

### For Patients

#### Step 1: Search for a Doctor

1. Navigate to `/dashboard/patient/appointment`
2. Enter a specialty (e.g., "Cardiology", "Pediatrics")
3. Optionally filter by hospital
4. Click "Search Doctors"

#### Step 2: Select a Doctor

1. Review the list of available doctors
2. Check doctor details (specialization, hospital, contact)
3. Click "Select" button

#### Step 3: Choose Date & Time

1. Pick an appointment date (within 30 days)
2. Available time slots appear based on doctor's schedule
3. Enter reason for visit (required)
4. Add optional notes
5. Click "Continue to Confirmation"

#### Step 4: Confirm Booking

1. Review appointment details
2. Click "Confirm Appointment"
3. Success message confirms the booking

### For Doctors

1. Navigate to `/dashboard/doctor/appointments`
2. Select date using the date picker
3. View all appointments for that day
4. See patient details, reason for visit, and status
5. Click "View" for detailed patient information

### For Hospital Staff

1. Navigate to `/dashboard/hospital/appointments`
2. Filter by status and/or date
3. View all appointments in a table
4. Click "Update Status" to change appointment status
5. Use pagination to navigate through appointments

---

## Validation & Error Handling

### Double-Booking Prevention

✅ **Unique Constraint:** Database constraint ensures no two appointments can have the same doctor, hospital, date, and time for active statuses

✅ **Application-Level Check:** Before creating an appointment, the model queries for existing appointments at that time

✅ **Conflict Detection:** Returns 409 Conflict error if slot is already booked

### Date Validation

✅ **No Past Dates:** Cannot book appointments for past dates
✅ **30-Day Limit:** Maximum booking window is 30 days in advance
✅ **Format Validation:** Dates must be in YYYY-MM-DD format

### Doctor Availability Validation

✅ **Schedule Check:** Verifies doctor has availability on the selected day
✅ **Time Range Validation:** Ensures time falls within doctor's working hours
✅ **Hospital Affiliation:** Confirms doctor is active at the selected hospital

### Input Validation

✅ **Required Fields:** Validates all mandatory fields are provided
✅ **Data Types:** Ensures correct data types for all inputs
✅ **Length Limits:** Text fields have appropriate character limits

---

## Status Types

| Status | Description |
|--------|-------------|
| `scheduled` | Initial appointment status after booking |
| `confirmed` | Hospital confirms the appointment |
| `completed` | Appointment completed successfully |
| `cancelled` | Appointment cancelled by patient or hospital |
| `no-show` | Patient did not show up |
| `rescheduled` | Appointment rescheduled to different time |

---

## Future Enhancements

📌 **Email/SMS Notifications** - Send confirmations to patients and doctors
📌 **Appointment Reminders** - Automated reminders before appointments
📌 **Rating & Reviews** - Patients can rate doctors after appointments
📌 **Recurring Appointments** - Support for follow-up appointments
📌 **Waitlist Management** - Queue for fully booked slots
📌 **Video Consultations** - Integrate video call capability
📌 **Payment Integration** - Online payment for consultation fees
📌 **Calendar Integration** - Sync with Google Calendar / Outlook
📌 **Analytics Dashboard** - Doctor and hospital appointment analytics

---

## Troubleshooting

### Issue: "Doctor not found at this hospital"

**Solution:** 
- Ensure doctor is registered with the hospital
- Verify doctor_hospital record exists in database
- Check `is_active` flag in doctor_hospital table

### Issue: "This time slot is already booked"

**Solution:**
- Try a different time slot
- Select a different date
- Check if slot status is actually available

### Issue: "No available slots for this date"

**Solution:**
- Doctor may not be available on this day
- Check doctor_availability records
- Ensure doctor has availability set for that day of week

### Issue: Frontend not connecting to backend

**Solution:**
- Verify backend is running on port 5000
- Check CORS configuration in server.js
- Ensure frontend API calls use correct endpoint URL

---

## Support & Contact

For issues, questions, or feature requests, please contact the development team.

**Last Updated:** November 23, 2025
**Version:** 1.0.0
