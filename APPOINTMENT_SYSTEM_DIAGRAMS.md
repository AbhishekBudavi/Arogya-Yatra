# Appointment Feature - System Diagrams

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      FRONTEND (React/Next.js)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────┐  ┌──────────────────────┐             │
│  │ Patient Booking UI   │  │ Doctor Dashboard     │             │
│  │ (appointment/page)   │  │ (appointments/page)  │             │
│  └──────────────────────┘  └──────────────────────┘             │
│           │                            │                         │
│           │ 4-step wizard              │ Date selector           │
│           │ - Search doctors           │ - View appointments     │
│           │ - Select doctor            │ - See patient details   │
│           │ - Choose date/time         │                         │
│           │ - Confirm booking          │                         │
│           │                            │                         │
│  ┌──────────────────────────────────────────────────┐            │
│  │  Hospital Appointments Dashboard                 │            │
│  │  (hospital/appointments/page)                    │            │
│  │  - View all appointments                         │            │
│  │  - Filter by status/date                         │            │
│  │  - Update appointment status                     │            │
│  └──────────────────────────────────────────────────┘            │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
              │                          │                    │
              ▼                          ▼                    ▼
        API Calls (axios/fetch) with JWT Token
              │                          │                    │
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND (Node.js/Express)                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │           Routes (appointment.routes.js)               │    │
│  │  GET    /search              (Public)                  │    │
│  │  GET    /slots               (Public)                  │    │
│  │  POST   /book                (Patient)                 │    │
│  │  GET    /patient             (Patient)                 │    │
│  │  DELETE /:id/cancel          (Patient)                 │    │
│  │  PUT    /:id/reschedule      (Patient)                 │    │
│  │  GET    /doctor/appointments (Doctor)                  │    │
│  │  GET    /hospital/:id/appointments (Hospital)          │    │
│  │  PATCH  /:id/status          (Hospital)                │    │
│  │  GET    /:id                 (Public)                  │    │
│  └─────────────────────────────────────────────────────────┘    │
│           │                     │                    │           │
│           ▼                     ▼                    ▼           │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │      Controllers (appointment.controller.js)            │    │
│  │  - searchDoctorsBySpecialty()                           │    │
│  │  - getAvailableSlots()                                  │    │
│  │  - bookAppointment()                                    │    │
│  │  - getPatientAppointments()                             │    │
│  │  - getDoctorAppointments()                              │    │
│  │  - getHospitalAppointments()                            │    │
│  │  - cancelAppointment()                                  │    │
│  │  - rescheduleAppointment()                              │    │
│  │  - updateAppointmentStatus()                            │    │
│  │  - getAppointmentDetails()                              │    │
│  └─────────────────────────────────────────────────────────┘    │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │         Models (appointment.model.js)                   │    │
│  │  - createAppointment() (with double-booking check)      │    │
│  │  - getAppointmentsByPatient()                           │    │
│  │  - getAppointmentsByDoctor()                            │    │
│  │  - getAppointmentsByHospital()                          │    │
│  │  - getAvailableSlots()                                  │    │
│  │  - updateAppointmentStatus()                            │    │
│  │  - cancelAppointment()                                  │    │
│  │  - rescheduleAppointment()                              │    │
│  │  - populateAppointmentSlots()                           │    │
│  └─────────────────────────────────────────────────────────┘    │
│           │                                                      │
│           ▼                                                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │   Database Connection (config/db.js)                   │    │
│  │   PostgreSQL Pool Connection                            │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
              │                          │
              ▼                          ▼
        ┌──────────────────────────────────────┐
        │   PostgreSQL Database                │
        ├──────────────────────────────────────┤
        │  ┌─────────────────────────────────┐ │
        │  │  appointments                   │ │
        │  │  - appointment_id (PK)          │ │
        │  │  - patient_id (FK)              │ │
        │  │  - doctor_id (FK)               │ │
        │  │  - hospital_id (FK)             │ │
        │  │  - appointment_date             │ │
        │  │  - appointment_time             │ │
        │  │  - status                       │ │
        │  │  - reason_for_visit             │ │
        │  │  - notes, cancellation_reason   │ │
        │  └─────────────────────────────────┘ │
        │                                       │
        │  ┌─────────────────────────────────┐ │
        │  │  appointment_slots              │ │
        │  │  - slot_id (PK)                 │ │
        │  │  - doctor_id (FK)               │ │
        │  │  - hospital_id (FK)             │ │
        │  │  - appointment_date             │ │
        │  │  - start_time, end_time         │ │
        │  │  - is_available                 │ │
        │  │  - appointment_id (FK)          │ │
        │  └─────────────────────────────────┘ │
        │                                       │
        │  ┌─────────────────────────────────┐ │
        │  │  doctor_availability            │ │
        │  │  - doctor_id (FK)               │ │
        │  │  - hospital_id (FK)             │ │
        │  │  - day_of_week                  │ │
        │  │  - start_time, end_time         │ │
        │  └─────────────────────────────────┘ │
        │                                       │
        │  + 7 Performance Indexes              │
        └──────────────────────────────────────┘
```

---

## Booking Flow Diagram

```
                         Patient Appointment Booking Flow
                              
                                  START
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  Step 1: Search Doctors       │
                    │  Enter specialty              │
                    │  Optional: Filter by hospital │
                    └───────────────────────────────┘
                                    │
                                    ▼
                        ┌──────────────────────┐
                        │ GET /api/appointments/search
                        │ Query Parameters:     │
                        │ - specialty           │
                        │ - hospital_id (opt)   │
                        │ - page, limit         │
                        └──────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  Backend Execution:           │
                    │  1. Query doctors by specialty│
                    │  2. Join with hospitals       │
                    │  3. Check is_active status    │
                    │  4. Apply pagination          │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  Step 2: Select Doctor        │
                    │  Display doctor list          │
                    │  Show specialization, hospital│
                    │  Click "Select"               │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  Step 3: Choose Date & Time   │
                    │  1. Pick date (1-30 days)     │
                    │  2. Select time slot          │
                    │  3. Enter reason for visit    │
                    │  4. Add optional notes        │
                    └───────────────────────────────┘
                                    │
                                    ▼
                        ┌──────────────────────┐
                        │GET /api/appointments/slots
                        │Query Parameters:      │
                        │ - doctor_id           │
                        │ - hospital_id         │
                        │ - appointment_date    │
                        └──────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  Backend Slot Generation:     │
                    │  1. Get doctor_availability   │
                    │  2. Check if day available    │
                    │  3. Generate 30-min slots     │
                    │  4. Check existing bookings   │
                    │  5. Return available slots    │
                    └───────────────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  Step 4: Confirmation         │
                    │  Review all details:          │
                    │  - Doctor name, spec          │
                    │  - Hospital name, address     │
                    │  - Date & Time                │
                    │  - Reason for visit           │
                    │  Click "Confirm"              │
                    └───────────────────────────────┘
                                    │
                                    ▼
                        ┌──────────────────────┐
                        │POST /api/appointments/book
                        │Body Parameters:       │
                        │ - doctor_id           │
                        │ - hospital_id         │
                        │ - appointment_date    │
                        │ - appointment_time    │
                        │ - reason_for_visit    │
                        │ - notes (optional)    │
                        │Auth: Patient JWT      │
                        └──────────────────────┘
                                    │
                                    ▼
                    ┌───────────────────────────────┐
                    │  Backend Booking Process:     │
                    │  1. Validate patient exists   │
                    │  2. Validate doctor exists    │
                    │  3. Check date not past       │
                    │  4. Double-booking check      │
                    │  5. Create appointment record │
                    │  6. Mark slot unavailable     │
                    │  7. Return appointment_id     │
                    └───────────────────────────────┘
                                    │
                    ┌───────────────┴───────────────┐
                    │                               │
              Success (201)                    Error (409, 400, etc)
                    │                               │
                    ▼                               ▼
        ┌───────────────────────────┐   ┌───────────────────────────┐
        │ Display Success Message   │   │ Display Error Message     │
        │ Show appointment ID       │   │ - Slot already booked     │
        │ Confirm all details       │   │ - Past date               │
        │ Redirect to dashboard     │   │ - Doctor not available    │
        └───────────────────────────┘   │ - Missing required fields │
                    │                   └───────────────────────────┘
                    │
                    ▼
        ┌───────────────────────────┐
        │ Hospital Dashboard        │
        │ Auto-Updates with new     │
        │ appointment               │
        │ Status: "scheduled"       │
        └───────────────────────────┘
                    │
                    ▼
                  END
```

---

## Double-Booking Prevention Flow

```
Patient Requests to Book Slot at 10:00 on Dec 15
                    │
                    ▼
    ┌────────────────────────────────────┐
    │ Application-Level Check            │
    │ Model.createAppointment()           │
    │ Query existing bookings:            │
    │ WHERE doctor_id = DOC001            │
    │ AND hospital_id = 1                 │
    │ AND appointment_date = '2025-12-15' │
    │ AND appointment_time = '10:00'      │
    │ AND status IN ('scheduled', ...)    │
    └────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
    Exists                    Doesn't Exist
        │                       │
        ▼                       ▼
    ┌──────────────┐    ┌──────────────────────┐
    │ Throw Error  │    │ Database Insert      │
    │ "Slot already│    │ INSERT INTO          │
    │ booked"      │    │ appointments (...)   │
    └──────────────┘    │ VALUES (...)         │
        │               └──────────────────────┘
        │                       │
        │               ┌───────┴────────┐
        │               │                │
        │         Constraint       No Constraint
        │         Violation        Violation
        │               │                │
        │               ▼                ▼
        │        UNIQUE              INSERT
        │        CONSTRAINT          SUCCESS
        │        Violation               │
        │        (If slipped            │
        │        through)              │
        │               │                │
        └───────────────┴────────────────┘
                    │
                    ▼
        ┌────────────────────────────┐
        │ Update appointment_slots   │
        │ Mark slot unavailable      │
        │ Link to appointment record │
        └────────────────────────────┘
                    │
                    ▼
        ┌────────────────────────────┐
        │ Return Success (201)       │
        │ Appointment created        │
        └────────────────────────────┘
```

---

## Hospital Dashboard Status Update Flow

```
Hospital Staff Views Appointment in Dashboard
                    │
                    ▼
        ┌──────────────────────────┐
        │ Click "Update Status"     │
        └──────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────────────┐
        │ Modal Dialog Opens                │
        │ Current Status: "scheduled"       │
        │ Dropdown with Options:            │
        │ - scheduled                       │
        │ - confirmed                       │
        │ - completed                       │
        │ - cancelled                       │
        │ - no-show                         │
        │ - rescheduled                     │
        └──────────────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────────────┐
        │ Hospital Staff Selects            │
        │ New Status: "confirmed"           │
        │ Click "Update Status" Button      │
        └──────────────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────────┐
        │PATCH /api/appointments/:id/status
        │Auth: Hospital JWT             │
        │Body: {status: "confirmed"}   │
        └──────────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────────┐
        │ Backend Update:               │
        │ UPDATE appointments           │
        │ SET status = 'confirmed'      │
        │ WHERE appointment_id = X      │
        │ RETURNING *                   │
        └──────────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────────┐
        │ Success Response (200)        │
        │ Updated appointment record    │
        │ Modal Closes                  │
        │ Table Refreshes               │
        └──────────────────────────────┘
                    │
                    ▼
        ┌──────────────────────────────┐
        │ Dashboard Reflects Changes    │
        │ Status Badge Updates:         │
        │ "scheduled" → "confirmed"     │
        │ Color changes: blue → green   │
        └──────────────────────────────┘
```

---

## Data Model Relationships

```
┌─────────────────────┐
│   patient           │
│  (existing)         │
│                     │
│ - patient_id (PK)   │
│ - first_name        │
│ - last_name         │
│ - mobile_number     │
│ - blood_group       │
│ - address           │
│ - ...               │
└──────────┬──────────┘
           │
           │ 1:Many
           │ (Patient has many appointments)
           │
┌──────────▼──────────────────────────────────┐
│       appointments (NEW)                    │
│                                             │
│ - appointment_id (PK)                       │
│ - patient_id (FK) ──┐                      │
│ - doctor_id (FK) ──┼─► relationships        │
│ - hospital_id (FK) ┼─► relationships        │
│ - appointment_date  │                       │
│ - appointment_time  │                       │
│ - status            │                       │
│ - reason_for_visit  │                       │
│ - notes             │                       │
│ - cancellation_reason                       │
│ - created_at        │                       │
│ - updated_at        │                       │
└──────────┬──────────┬──────────┬────────────┘
           │          │          │
           │          │          │
┌──────────▼──┐  ┌────▼───────┐  │
│   doctor    │  │  hospitals  │  │
│ (existing)  │  │ (existing)  │  │
│             │  │             │  │
│ - doctor_id │  │ - hospital_ │  │
│ - name      │  │   id        │  │
│ - specilz   │  │ - name      │  │
│ - email     │  │ - address   │  │
│ - phone     │  │ - city      │  │
│ - ...       │  │ - ...       │  │
└──────┬──────┘  └────────┬────┘  │
       │                 │        │
       │ Many:Many       │ 1:Many │
       │                 │        │
       └─────┬─────┬─────┘        │
             │     │              │
    ┌────────▼──┐  │              │
    │doctor_     │  │              │
    │hospital    │  │              │
    │(existing)  │  │              │
    └────────────┘  │              │
                    │              │
         ┌──────────▼──────────────┐
         │  appointment_slots (NEW)│
         │                         │
         │ - slot_id (PK)          │
         │ - doctor_id (FK)        │
         │ - hospital_id (FK)      │
         │ - appointment_date      │
         │ - start_time            │
         │ - end_time              │
         │ - is_available          │
         │ - appointment_id (FK)   │
         │ - created_at            │
         │ - updated_at            │
         └─────────────────────────┘
```

---

## API Request/Response Flow Example

```
BOOKING REQUEST:
┌────────────────────────────────────────┐
│ POST /api/appointments/book            │
│ Authorization: Bearer patient_token    │
│                                        │
│ {                                      │
│   "doctor_id": "DOC001",               │
│   "hospital_id": 1,                    │
│   "appointment_date": "2025-12-15",    │
│   "appointment_time": "10:00",         │
│   "reason_for_visit": "Checkup",       │
│   "notes": "First visit"               │
│ }                                      │
└────────────────────────────────────────┘
              │
              ▼
    ┌──────────────────────┐
    │ Authorization Check  │
    │ Verify JWT token     │
    │ Extract patient_id   │
    └──────────────────────┘
              │
              ▼
    ┌──────────────────────┐
    │ Input Validation     │
    │ - Required fields    │
    │ - Data types         │
    │ - Date format        │
    └──────────────────────┘
              │
              ▼
    ┌──────────────────────┐
    │ Business Logic       │
    │ - Double-book check  │
    │ - Doctor validation  │
    │ - Create record      │
    └──────────────────────┘
              │
              ▼
    ┌──────────────────────┐
    │ Database Transaction │
    │ - Insert appointment │
    │ - Update slot status │
    │ - Commit changes     │
    └──────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│ BOOKING RESPONSE (201 Created):        │
│                                        │
│ {                                      │
│   "success": true,                     │
│   "message": "Appointment booked",     │
│   "data": {                            │
│     "appointment_id": 42,              │
│     "patient_id": "PAT001",            │
│     "doctor_id": "DOC001",             │
│     "hospital_id": 1,                  │
│     "appointment_date": "2025-12-15",  │
│     "appointment_time": "10:00",       │
│     "status": "scheduled",             │
│     "reason_for_visit": "Checkup",     │
│     "created_at": "2025-11-23T10:..."  │
│   }                                    │
│ }                                      │
└────────────────────────────────────────┘
```

---

These diagrams provide visual representations of the system architecture, booking flow, database relationships, and API interactions.
