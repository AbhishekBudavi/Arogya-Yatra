# Appointment Feature - Quick Reference

## Quick Start

### Database Setup
```bash
# Run migration
psql -U your_user -d your_database -f Backend/migrations/create_appointments_table.sql
```

### Start Backend
```bash
cd Backend
npm run dev
# Server runs on http://localhost:5000
```

### Start Frontend
```bash
cd FrontEnd
npm run dev
# Frontend runs on http://localhost:3000
```

---

## File Reference

| File | Location | Purpose |
|------|----------|---------|
| Migration SQL | `Backend/migrations/create_appointments_table.sql` | Creates appointments tables |
| Model | `Backend/models/appointment.model.js` | Database CRUD operations |
| Controller | `Backend/controllers/appointment.controller.js` | API endpoints (10 endpoints) |
| Routes | `Backend/routes/appointment.routes.js` | Route definitions |
| Patient Page | `FrontEnd/app/(dashboard)/dashboard/patient/appointment/page.jsx` | Booking UI |
| Doctor Page | `FrontEnd/app/(dashboard)/dashboard/doctor/appointments/page.jsx` | Doctor view |
| Hospital Page | `FrontEnd/app/(dashboard)/dashboard/hospital/appointments/page.jsx` | Hospital dashboard |

---

## Key Features

✅ **Doctor Search** - Search by specialty, filter by hospital
✅ **Slot Management** - View available time slots for selected date
✅ **Booking** - Multi-step booking wizard with confirmation
✅ **Double-Booking Prevention** - Automatic conflict detection
✅ **Hospital Dashboard** - View & manage all appointments
✅ **Doctor Dashboard** - View daily appointments
✅ **Status Management** - Update appointment status
✅ **Cancellation** - Cancel with optional reason
✅ **Rescheduling** - Reschedule to different date/time
✅ **Error Handling** - Comprehensive validation & messages

---

## API Endpoints Summary

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/appointments/search` | ❌ | Search doctors by specialty |
| GET | `/api/appointments/slots` | ❌ | Get available slots |
| POST | `/api/appointments/book` | 🔒 Patient | Book appointment |
| GET | `/api/appointments/patient` | 🔒 Patient | Get patient's appointments |
| DELETE | `/api/appointments/:id/cancel` | 🔒 Patient | Cancel appointment |
| PUT | `/api/appointments/:id/reschedule` | 🔒 Patient | Reschedule appointment |
| GET | `/api/appointments/doctor/appointments` | 🔒 Doctor | Get doctor's appointments |
| GET | `/api/appointments/hospital/:id/appointments` | 🔒 Hospital | Get hospital's appointments |
| PATCH | `/api/appointments/:id/status` | 🔒 Hospital | Update status |
| GET | `/api/appointments/:id` | ❌ | Get appointment details |

---

## Request/Response Examples

### Search Doctors
```bash
GET /api/appointments/search?specialty=Cardiology&hospital_id=1&page=1&limit=10
```

### Get Available Slots
```bash
GET /api/appointments/slots?doctor_id=DOC123&hospital_id=1&appointment_date=2025-12-15
```

### Book Appointment
```bash
POST /api/appointments/book
Authorization: Bearer {token}

{
  "doctor_id": "DOC123",
  "hospital_id": 1,
  "appointment_date": "2025-12-15",
  "appointment_time": "10:00",
  "reason_for_visit": "Chest pain checkup",
  "notes": "Urgent"
}
```

### Cancel Appointment
```bash
DELETE /api/appointments/5/cancel
Authorization: Bearer {token}

{
  "cancellation_reason": "Schedule conflict"
}
```

### Update Status
```bash
PATCH /api/appointments/5/status
Authorization: Bearer {token}

{
  "status": "confirmed"
}
```

---

## Database Tables Overview

### appointments
```
- appointment_id (PK)
- patient_id (FK) → patient
- doctor_id (FK) → doctor
- hospital_id (FK) → hospitals
- appointment_date, appointment_time
- status: scheduled|confirmed|completed|cancelled|no-show|rescheduled
- reason_for_visit, notes, cancellation_reason
- created_at, updated_at
```

### appointment_slots
```
- slot_id (PK)
- doctor_id (FK) → doctor
- hospital_id (FK) → hospitals
- appointment_date, start_time, end_time
- is_available (boolean)
- appointment_id (FK) → appointments (nullable)
```

---

## Frontend Routes

| Route | Component | User |
|-------|-----------|------|
| `/dashboard/patient/appointment` | Booking Wizard | Patient |
| `/dashboard/doctor/appointments` | Doctor View | Doctor |
| `/dashboard/hospital/appointments` | Hospital Dashboard | Hospital Staff |

---

## Key Model Methods

```javascript
// Create appointment (with double-booking check)
createAppointment({patient_id, doctor_id, hospital_id, appointment_date, appointment_time})

// Get appointments
getAppointmentsByPatient(patient_id, status?)
getAppointmentsByDoctor(doctor_id, hospital_id?, date?)
getAppointmentsByHospital(hospital_id, status?, date?)

// Slot management
getAvailableSlots(doctor_id, hospital_id, appointment_date)
populateAppointmentSlots(doctor_id, hospital_id, start_date, end_date)

// Modifications
updateAppointmentStatus(appointment_id, status, cancellationReason?)
cancelAppointment(appointment_id, cancellationReason)
rescheduleAppointment(appointment_id, new_date, new_time, new_end_time)
```

---

## Appointment Statuses

| Status | Use Case |
|--------|----------|
| `scheduled` | Default status after booking |
| `confirmed` | Hospital confirmed the appointment |
| `completed` | Appointment completed |
| `cancelled` | Cancelled by patient or hospital |
| `no-show` | Patient didn't show up |
| `rescheduled` | Rescheduled to different time |

---

## Validation Rules

✅ No past date bookings
✅ Maximum 30 days in advance
✅ Doctor must be active at hospital
✅ Doctor must have availability on selected day
✅ Time must fall within doctor's working hours
✅ No double-booking for same slot
✅ All required fields must be provided
✅ Date format: YYYY-MM-DD
✅ Time format: HH:MM (24-hour)

---

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| "Doctor not found" | Verify doctor_hospital relationship exists |
| "Slot already booked" | Try different time or date |
| "No slots available" | Check doctor availability schedule |
| CORS error | Verify frontend URL in server.js |
| Database connection failed | Check DB credentials in .env |
| Token expired | Re-login to get new token |

---

## Integration Checklist

- [x] Database migration created
- [x] Appointment model implemented
- [x] Controller with 10 endpoints
- [x] Routes with authentication
- [x] Patient booking UI (4-step wizard)
- [x] Doctor appointments view
- [x] Hospital appointments dashboard
- [x] Double-booking prevention
- [x] Error handling & validation
- [x] Documentation complete

---

## Next Steps

1. **Run Migration** - Set up database tables
2. **Start Backend** - npm run dev
3. **Start Frontend** - npm run dev
4. **Test APIs** - Use Postman or cURL
5. **Test UI** - Book appointment via UI
6. **Verify Dashboard** - Check hospital & doctor views
7. **Test Edge Cases** - Double-booking, past dates, etc.

---

**For detailed documentation, see: APPOINTMENT_FEATURE_GUIDE.md**
