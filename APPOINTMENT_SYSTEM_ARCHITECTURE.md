# Appointment System - Architecture & Integration Diagram

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        FRONTEND (Next.js)                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Patient Side: /patient/appointment/page.jsx            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • Search doctors by specialty                            │  │
│  │ • View available slots                                   │  │
│  │ • Select date & time                                     │  │
│  │ • Book appointment                                       │  │
│  │                                                          │  │
│  │ API Calls:                                               │  │
│  │ • GET /appointments/search (doctor search)              │  │
│  │ • GET /appointments/slots (available times)             │  │
│  │ • POST /appointments/book (create appointment)          │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│  ┌────────────────▼─────────────────────────────────────────┐  │
│  │  Hospital Side: HospitalDashboard/AppointmentScheduling │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • View all appointments (table)                          │  │
│  │ • Update appointment status (dropdown)                   │  │
│  │ • Cancel appointments (button)                           │  │
│  │ • Manual scheduling (form)                               │  │
│  │ • Search by patient/doctor                               │  │
│  │ • Statistics dashboard                                   │  │
│  │                                                          │  │
│  │ API Calls:                                               │  │
│  │ • GET /hospital/:id/appointments (fetch all)            │  │
│  │ • GET /hospital/doctors (get doctor list)               │  │
│  │ • GET /appointments/slots (available times)             │  │
│  │ • PATCH /appointments/:id/status (update status)        │  │
│  │ • DELETE /appointments/:id/cancel (cancel)              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  API Helper Functions: app/utils/api.js                 │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ appointmentAPI.getHospitalAppointments()                │  │
│  │ appointmentAPI.getHospitalDoctors()                     │  │
│  │ appointmentAPI.getDoctorAvailability()                  │  │
│  │ appointmentAPI.updateAppointmentStatus()                │  │
│  │ appointmentAPI.cancelAppointment()                      │  │
│  │ appointmentAPI.getAppointmentDetails()                  │  │
│  │ appointmentAPI.rescheduleAppointment()                  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────┬──────────────────────────────────────┘
                          │ HTTPS + JWT Authentication
                          │
┌─────────────────────────▼──────────────────────────────────────┐
│                     BACKEND (Express.js)                         │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes: /api/appointments                               │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ GET    /search          - Search doctors by specialty    │  │
│  │ GET    /slots           - Get available time slots       │  │
│  │ POST   /book            - Book new appointment           │  │
│  │ GET    /patient         - Get patient appointments       │  │
│  │ GET    /hospital/:id    - Get hospital appointments      │  │
│  │ PATCH  /:id/status      - Update status                  │  │
│  │ DELETE /:id/cancel      - Cancel appointment             │  │
│  │ PUT    /:id/reschedule  - Reschedule appointment         │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│  ┌────────────────▼─────────────────────────────────────────┐  │
│  │  Controllers: appointment.controller.js                  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • searchDoctorsBySpecialty()                             │  │
│  │ • getAvailableSlots()                                    │  │
│  │ • bookAppointment()                                      │  │
│  │ • updateAppointmentStatus()                              │  │
│  │ • cancelAppointment()                                    │  │
│  │ • rescheduleAppointment()                                │  │
│  │ • getHospitalAppointments()                              │  │
│  └────────────────┬─────────────────────────────────────────┘  │
│                   │                                              │
│  ┌────────────────▼─────────────────────────────────────────┐  │
│  │  Models: appointment.model.js                            │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │ • Database queries using db connection                   │  │
│  │ • Business logic for appointments                        │  │
│  │ • Validation & error handling                            │  │
│  └────────────────┬─────────────────────────────────────────┘  │
└─────────────────────────┬──────────────────────────────────────┘
                          │ SQL Queries
                          │
┌─────────────────────────▼──────────────────────────────────────┐
│                   DATABASE (PostgreSQL)                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  appointments Table:                                             │
│  ├─ appointment_id (PK)                                         │
│  ├─ patient_id (FK → patient)                                   │
│  ├─ doctor_id (FK → doctor)                                     │
│  ├─ hospital_id (FK → hospitals)                                │
│  ├─ appointment_date                                            │
│  ├─ appointment_time                                            │
│  ├─ status (scheduled, confirmed, cancelled, etc)               │
│  ├─ reason_for_visit                                            │
│  ├─ notes                                                       │
│  ├─ created_at                                                  │
│  └─ updated_at                                                  │
│                                                                   │
│  Related Tables:                                                 │
│  ├─ patient (patient_id, first_name, last_name, mobile_number) │
│  ├─ doctor (doctor_id, doctor_name, specialization, email)      │
│  ├─ hospitals (hospital_id, hospital_name, address)             │
│  └─ doctor_hospital (doctor_id, hospital_id relationships)      │
│                                                                   │
└───────────────────────────────────────────────────────────────┘
```

---

## Request/Response Flow - Hospital Appointment View

### 1. Component Mount - Fetch Appointments

```
┌─────────────────────────────────────────┐
│  AppointmentScheduling Mount             │
│  ├─ hospitalData?.hospital_id = "H123"   │
│  └─ Calls: fetchAppointments()           │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  API Call: getHospitalAppointments()     │
│  GET /appointments/hospital/H123/appointments
│  Params: page=1, limit=20                │
│  Headers: Authorization: Bearer <JWT>    │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Backend: appointment.controller.js      │
│  getHospitalAppointments()               │
│  ├─ Verify hospital JWT                  │
│  ├─ Validate hospital_id                 │
│  └─ Query appointments table              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Database Query                          │
│  SELECT * FROM appointments              │
│  WHERE hospital_id = $1                  │
│  ORDER BY appointment_date DESC           │
│  LIMIT 20 OFFSET 0                       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Response Data:                          │
│  {                                       │
│    "success": true,                      │
│    "data": [                             │
│      {                                   │
│        appointment_id: "APT001",         │
│        first_name: "John",               │
│        last_name: "Doe",                 │
│        doctor_name: "Smith",             │
│        appointment_date: "2024-11-23",   │
│        appointment_time: "10:00 AM",     │
│        status: "scheduled"                │
│      },                                  │
│      ...more appointments...             │
│    ],                                    │
│    "pagination": {                       │
│      "page": 1, "limit": 20, "pages": 3  │
│    }                                     │
│  }                                       │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  Component: Transform Data               │
│  ├─ Convert backend data to UI format    │
│  ├─ Set appointments state               │
│  └─ Update pagination state              │
└────────────┬────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│  UI Render:                              │
│  ├─ Display appointments in table        │
│  ├─ Show pagination buttons              │
│  └─ Update statistics                    │
└─────────────────────────────────────────┘
```

---

## Request/Response Flow - Update Appointment Status

### 2. Hospital Updates Appointment Status

```
┌──────────────────────────────────────┐
│  User clicks status dropdown           │
│  Selects: "Confirmed"                 │
└────────────┬────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Call: handleStatusChange()            │
│  ├─ appointmentId = "APT001"          │
│  └─ newStatus = "Confirmed"           │
└────────────┬────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  API Call: updateAppointmentStatus()   │
│  PATCH /appointments/APT001/status    │
│  Body: { "status": "confirmed" }      │
│  Headers: Authorization: Bearer <JWT> │
└────────────┬────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Backend: appointment.controller.js    │
│  updateAppointmentStatus()             │
│  ├─ Verify hospital JWT                │
│  ├─ Validate appointment_id exists     │
│  ├─ Validate status value              │
│  └─ Update in database                 │
└────────────┬────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Database Update:                      │
│  UPDATE appointments                   │
│  SET status = 'confirmed',             │
│      updated_at = NOW()                │
│  WHERE appointment_id = 'APT001'       │
└────────────┬────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Response:                             │
│  {                                     │
│    "success": true,                    │
│    "message": "Status updated",        │
│    "data": {                           │
│      "appointment_id": "APT001",       │
│      "status": "confirmed"             │
│    }                                   │
│  }                                     │
└────────────┬────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Component: Update State               │
│  ├─ Update appointments array          │
│  ├─ Trigger re-render                  │
│  └─ Show toast notification            │
└────────────┬────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  UI Updates:                           │
│  ├─ Status badge changes color         │
│  ├─ Success toast shown                │
│  └─ Statistics counters updated        │
└──────────────────────────────────────┘
```

---

## Component State Management

```
┌─────────────────────────────────────────────────────┐
│         AppointmentScheduling State                  │
├─────────────────────────────────────────────────────┤
│                                                      │
│ appointments                                         │
│ ├─ Type: Array of Objects                           │
│ ├─ Fields: [id, patient, doctor, date, time,        │
│ │           status, reason, appointment_id]          │
│ └─ Source: Backend API                              │
│                                                      │
│ doctors                                              │
│ ├─ Type: Array of Objects                           │
│ ├─ Fields: [doctor_id, doctor_name, specialization] │
│ └─ Source: Backend API                              │
│                                                      │
│ availableSlots                                       │
│ ├─ Type: Array of Strings (times)                   │
│ ├─ Values: ["09:00 AM", "10:00 AM", ...]           │
│ └─ Source: Backend API (date-based)                 │
│                                                      │
│ loading                                              │
│ ├─ Type: Boolean                                    │
│ ├─ Usage: Show/hide loading spinner                 │
│ └─ Source: Manual state toggle                      │
│                                                      │
│ error                                                │
│ ├─ Type: String                                     │
│ ├─ Usage: Display error message                     │
│ └─ Source: API error handling                       │
│                                                      │
│ pagination                                           │
│ ├─ Type: Object {page, limit, pages}                │
│ ├─ Usage: Pagination controls                       │
│ └─ Source: Backend response                         │
│                                                      │
│ formData                                             │
│ ├─ Type: Object {patient, doctor, date, time,       │
│ │           reason}                                  │
│ ├─ Usage: New appointment form                      │
│ └─ Source: Form inputs                              │
│                                                      │
│ searchTerm                                           │
│ ├─ Type: String                                     │
│ ├─ Usage: Filter appointments list                  │
│ └─ Source: Search input                             │
│                                                      │
│ showForm                                             │
│ ├─ Type: Boolean                                    │
│ ├─ Usage: Show/hide appointment form                │
│ └─ Source: Button click                             │
│                                                      │
└─────────────────────────────────────────────────────┘
```

---

## Error Handling Flow

```
┌─────────────────────────────────────────────┐
│  API Call Initiated                          │
│  e.g., updateAppointmentStatus()            │
└────────────┬────────────────────────────────┘
             │
             ▼
    ┌────────────────┐
    │  Try Block     │
    │  Execute API   │
    └───┬──────┬─────┘
        │      │
        ▼      ▼
    Success  Error
        │      │
        │      ▼
        │   ┌─────────────────────────────┐
        │   │  Catch Block                 │
        │   │  ├─ Log error to console     │
        │   │  ├─ Extract error message    │
        │   │  ├─ Set error state          │
        │   │  └─ Show toast notification  │
        │   └────────┬────────────────────┘
        │            │
        ▼            ▼
    ┌─────────────────────────────┐
    │  Finally Block              │
    │  Set loading = false        │
    │  Re-enable UI buttons       │
    └────────────┬────────────────┘
                 │
                 ▼
    ┌─────────────────────────────┐
    │  Component Re-renders       │
    │  Shows error banner if set  │
    │  Displays toast message     │
    └─────────────────────────────┘
```

---

## Data Transformation Pipeline

```
BACKEND RESPONSE
    ↓
┌──────────────────────────────────────┐
│ Raw Appointment Data                  │
│ {                                     │
│   appointment_id: "APT001",           │
│   first_name: "John",                 │
│   last_name: "Doe",                   │
│   doctor_name: "Smith",               │
│   appointment_date: "2024-11-23",     │
│   appointment_time: "10:00 AM",       │
│   status: "scheduled"                 │
│ }                                     │
└────────────┬────────────────────────┘
             │
             ▼ Transform Logic
┌──────────────────────────────────────┐
│ .map(apt => ({                        │
│   id: apt.appointment_id,             │
│   patient: `${apt.first_name}         │
│              ${apt.last_name}`,        │
│   doctor: `Dr. ${apt.doctor_name}`,   │
│   date: apt.appointment_date,         │
│   time: apt.appointment_time,         │
│   status: apt.status                  │
│          .charAt(0).toUpperCase()     │
│          .slice(1).toLowerCase(),     │
│   appointment_id: apt.appointment_id  │
│ }))                                   │
└────────────┬────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│ Transformed UI Data                   │
│ {                                     │
│   id: "APT001",                       │
│   patient: "John Doe",                │
│   doctor: "Dr. Smith",                │
│   date: "2024-11-23",                 │
│   time: "10:00 AM",                   │
│   status: "Scheduled",                │
│   appointment_id: "APT001"            │
│ }                                     │
└────────────┬────────────────────────┘
             │
             ▼
COMPONENT DISPLAY IN TABLE
```

---

## Component Lifecycle

```
MOUNT
  │
  ├─ Initialize state
  ├─ Set up useEffect dependencies
  └─ Trigger initial data fetch
         │
         ├─ fetchAppointments() → GET /hospital/:id/appointments
         └─ fetchDoctors() → GET /hospital/doctors
         │
         ▼
RENDER (with loading spinner)
         │
         ├─ API responses received
         ├─ State updated with data
         └─ Component re-renders with data
         │
         ▼
INTERACTIVE (user can interact)
         │
         ├─ Update status → PATCH request
         ├─ Cancel appointment → DELETE request
         ├─ Search (client-side filtering)
         ├─ Change page → fetchAppointments(page=2)
         └─ Schedule new → POST /book
         │
         ▼
UPDATE
         │
         ├─ Re-fetch on page change
         ├─ Update state on successful action
         ├─ Show notifications
         └─ Update statistics
         │
         ▼
UNMOUNT
         │
         └─ Cleanup listeners
```

---

## Authentication Flow

```
┌──────────────────────────────┐
│  Hospital Admin Logs In       │
│  Receives JWT Token           │
│  ├─ Stored in Cookie          │
│  └─ (withCredentials: true)   │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│  Navigate to Dashboard        │
│  AppointmentScheduling mounts │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│  Make API Call               │
│  GET /hospital/:id/appointments
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│  Axios Interceptor            │
│  Adds Cookie to headers       │
│  (Automatic with             │
│   withCredentials: true)      │
└────────────┬─────────────────┘
             │
             ▼
┌──────────────────────────────┐
│  Backend                      │
│  verifyJWT('hospital')        │
│  ├─ Extract JWT from cookie   │
│  ├─ Decode & verify           │
│  └─ Check expiration          │
└────────────┬─────────────────┘
             │
    ┌────────┴────────┐
    │                 │
    ▼                 ▼
  Valid           Invalid
    │                 │
    ▼                 ▼
 Process         Return 401
 Request         Unauthorized
    │                 │
    ▼                 ▼
 Return Data    User redirected
               to login
```

---

## Summary

This architecture ensures:
✅ **Real-time Sync**: Patient bookings appear in hospital dashboard instantly
✅ **Secure**: JWT authentication on all modifying endpoints
✅ **Scalable**: Pagination handles large datasets
✅ **Reliable**: Error handling prevents crashes
✅ **User-friendly**: Loading states, notifications, validation
✅ **Maintainable**: Clear separation of concerns, well-documented APIs
