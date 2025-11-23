# Appointment Feature - Testing Guide

## API Testing with cURL/Postman

### 1. Search Doctors

**Request:**
```bash
curl -X GET "http://localhost:5000/api/appointments/search?specialty=Cardiology&page=1&limit=10"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "doctor_id": "DOC001",
      "doctor_name": "Dr. Rajesh Sharma",
      "specialization": "Cardiology",
      "email": "rajesh@hospital.com",
      "phone": "9876543210",
      "hospital_id": 1,
      "hospital_name": "Apollo Hospital",
      "hospital_address": "123 Main St",
      "city": "Mumbai",
      "state": "Maharashtra",
      "license_id": "LIC123"
    }
  ],
  "pagination": {
    "total": 5,
    "page": 1,
    "limit": 10,
    "pages": 1
  }
}
```

---

### 2. Get Available Slots

**Request:**
```bash
curl -X GET "http://localhost:5000/api/appointments/slots?doctor_id=DOC001&hospital_id=1&appointment_date=2025-12-15"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": {
    "available_slots": [
      "09:00",
      "09:30",
      "10:00",
      "10:30",
      "14:00",
      "14:30",
      "15:00"
    ],
    "doctor_availability": {
      "availability_id": 1,
      "doctor_id": "DOC001",
      "hospital_id": 1,
      "day_of_week": "Monday",
      "start_time": "09:00",
      "end_time": "17:00",
      "is_active": true
    }
  }
}
```

---

### 3. Book Appointment

**Request:**
```bash
curl -X POST "http://localhost:5000/api/appointments/book" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PATIENT_TOKEN" \
  -d '{
    "doctor_id": "DOC001",
    "hospital_id": 1,
    "appointment_date": "2025-12-15",
    "appointment_time": "10:00",
    "reason_for_visit": "Chest pain consultation",
    "notes": "First visit"
  }'
```

**Expected Response (201):**
```json
{
  "success": true,
  "message": "Appointment booked successfully",
  "data": {
    "appointment_id": 1,
    "patient_id": "PAT001",
    "doctor_id": "DOC001",
    "hospital_id": 1,
    "appointment_date": "2025-12-15",
    "appointment_time": "10:00",
    "appointment_end_time": null,
    "status": "scheduled",
    "reason_for_visit": "Chest pain consultation",
    "notes": "First visit",
    "created_at": "2025-11-23T10:00:00.000Z",
    "updated_at": "2025-11-23T10:00:00.000Z"
  }
}
```

---

### 4. Get Patient Appointments

**Request:**
```bash
curl -X GET "http://localhost:5000/api/appointments/patient" \
  -H "Authorization: Bearer YOUR_PATIENT_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "appointment_id": 1,
      "patient_id": "PAT001",
      "doctor_id": "DOC001",
      "hospital_id": 1,
      "doctor_name": "Dr. Rajesh Sharma",
      "specialization": "Cardiology",
      "doctor_email": "rajesh@hospital.com",
      "doctor_phone": "9876543210",
      "hospital_name": "Apollo Hospital",
      "hospital_address": "123 Main St",
      "first_name": "John",
      "last_name": "Doe",
      "appointment_date": "2025-12-15",
      "appointment_time": "10:00",
      "status": "scheduled",
      "reason_for_visit": "Chest pain consultation"
    }
  ]
}
```

---

### 5. Get Doctor Appointments

**Request:**
```bash
curl -X GET "http://localhost:5000/api/appointments/doctor/appointments?date=2025-12-15" \
  -H "Authorization: Bearer YOUR_DOCTOR_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "appointment_id": 1,
      "patient_id": "PAT001",
      "doctor_id": "DOC001",
      "hospital_id": 1,
      "first_name": "John",
      "last_name": "Doe",
      "mobile_number": "9876543210",
      "blood_group": "O+",
      "gender": "M",
      "reason_for_visit": "Chest pain consultation",
      "appointment_date": "2025-12-15",
      "appointment_time": "10:00",
      "status": "scheduled",
      "doctor_name": "Dr. Rajesh Sharma",
      "specialization": "Cardiology"
    }
  ]
}
```

---

### 6. Get Hospital Appointments

**Request:**
```bash
curl -X GET "http://localhost:5000/api/appointments/hospital/1/appointments?status=scheduled&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_HOSPITAL_TOKEN"
```

**Expected Response (200):**
```json
{
  "success": true,
  "data": [
    {
      "appointment_id": 1,
      "doctor_name": "Dr. Rajesh Sharma",
      "specialization": "Cardiology",
      "first_name": "John",
      "last_name": "Doe",
      "mobile_number": "9876543210",
      "appointment_date": "2025-12-15",
      "appointment_time": "10:00",
      "status": "scheduled"
    }
  ],
  "pagination": {
    "total": 10,
    "page": 1,
    "limit": 20,
    "pages": 1
  }
}
```

---

### 7. Cancel Appointment

**Request:**
```bash
curl -X DELETE "http://localhost:5000/api/appointments/1/cancel" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PATIENT_TOKEN" \
  -d '{
    "cancellation_reason": "Cannot make it"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": {
    "appointment_id": 1,
    "status": "cancelled",
    "cancellation_reason": "Cannot make it"
  }
}
```

---

### 8. Reschedule Appointment

**Request:**
```bash
curl -X PUT "http://localhost:5000/api/appointments/1/reschedule" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_PATIENT_TOKEN" \
  -d '{
    "appointment_date": "2025-12-20",
    "appointment_time": "14:00",
    "appointment_end_time": "14:30"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Appointment rescheduled successfully",
  "data": {
    "appointment_id": 1,
    "appointment_date": "2025-12-20",
    "appointment_time": "14:00",
    "status": "scheduled"
  }
}
```

---

### 9. Update Appointment Status

**Request:**
```bash
curl -X PATCH "http://localhost:5000/api/appointments/1/status" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_HOSPITAL_TOKEN" \
  -d '{
    "status": "confirmed"
  }'
```

**Expected Response (200):**
```json
{
  "success": true,
  "message": "Appointment status updated successfully",
  "data": {
    "appointment_id": 1,
    "status": "confirmed"
  }
}
```

---

## Test Scenarios

### Scenario 1: Successful Booking Flow

1. **Search Doctors**
   - Execute search for "Cardiology"
   - Verify doctors are returned
   - ✅ Expected: List of doctors displayed

2. **Get Available Slots**
   - Select first doctor
   - Request slots for 2025-12-15
   - ✅ Expected: Available time slots displayed

3. **Book Appointment**
   - Select a slot (e.g., 10:00)
   - Enter reason for visit
   - Submit booking
   - ✅ Expected: Appointment ID returned, status "scheduled"

4. **Verify Appointment**
   - Get patient appointments
   - ✅ Expected: New appointment in list

---

### Scenario 2: Double-Booking Prevention

1. **Book First Appointment**
   - Book doctor DOC001 for 2025-12-15 at 10:00
   - ✅ Expected: Success

2. **Attempt to Book Same Slot**
   - Try to book same doctor, date, time
   - ✅ Expected: Error "This time slot is already booked"

3. **Book Different Time**
   - Book same doctor/date but different time (10:30)
   - ✅ Expected: Success

---

### Scenario 3: Date Validation

1. **Past Date Booking**
   - Try to book for 2025-11-15 (past date)
   - ✅ Expected: Error "Cannot book appointments for past dates"

2. **Future Date Booking**
   - Try to book more than 30 days ahead
   - ✅ Expected: UI prevents selection

---

### Scenario 4: Doctor Availability Check

1. **Sunday Appointment** (If doctor not available on Sunday)
   - Request slots for a Sunday
   - ✅ Expected: Error or empty slots if not available

2. **Outside Working Hours**
   - Try time outside doctor's working hours (e.g., 6 PM if doctor works 9-5)
   - ✅ Expected: Time not shown in available slots

---

### Scenario 5: Cancellation & Rescheduling

1. **Cancel Appointment**
   - Get appointment ID from booking
   - Send cancel request with reason
   - ✅ Expected: Status changed to "cancelled"

2. **Verify Slot Released**
   - Get available slots for released time
   - ✅ Expected: Slot now appears as available

3. **Reschedule Appointment**
   - Book new appointment
   - Send reschedule request for different date/time
   - ✅ Expected: Appointment updated with new details

---

### Scenario 6: Hospital Dashboard

1. **View All Appointments**
   - Access hospital dashboard
   - ✅ Expected: All hospital appointments displayed

2. **Filter by Status**
   - Filter for "scheduled" appointments
   - ✅ Expected: Only scheduled appointments shown

3. **Filter by Date**
   - Select specific date
   - ✅ Expected: Only appointments for that date shown

4. **Update Status**
   - Change appointment status to "confirmed"
   - ✅ Expected: Status updated in table

---

### Scenario 7: Doctor Dashboard

1. **View Daily Appointments**
   - Access doctor dashboard
   - ✅ Expected: Today's appointments displayed

2. **Change Date**
   - Select different date
   - ✅ Expected: Appointments for that date shown

3. **View Patient Details**
   - Click appointment details
   - ✅ Expected: Patient info, reason, blood type displayed

---

## Database Verification

### Check Appointments Created
```sql
SELECT * FROM appointments;
```

### Check Slots Availability
```sql
SELECT * FROM appointment_slots WHERE is_available = true;
```

### Check Doctor Availability
```sql
SELECT * FROM doctor_availability WHERE doctor_id = 'DOC001';
```

### Check for Conflicts
```sql
SELECT doctor_id, appointment_date, appointment_time, COUNT(*) 
FROM appointments 
WHERE status IN ('scheduled', 'confirmed')
GROUP BY doctor_id, appointment_date, appointment_time
HAVING COUNT(*) > 1;
```

---

## Frontend Testing Checklist

- [ ] Patient can search for doctors by specialty
- [ ] Doctor list displays correct information
- [ ] Pagination works correctly
- [ ] Selecting doctor shows date picker
- [ ] Date picker prevents past dates
- [ ] Available slots load when date selected
- [ ] Reason for visit is required
- [ ] Booking confirmation displays correctly
- [ ] Success message appears after booking
- [ ] Doctor dashboard shows appointments
- [ ] Hospital dashboard shows all appointments
- [ ] Status filter works in hospital dashboard
- [ ] Date filter works in hospital dashboard
- [ ] Status update modal opens correctly
- [ ] Status update saves changes

---

## Performance Testing

### Load Testing Recommendations

1. **Database Indexes**
   - Ensure all indexes are created
   - Monitor query performance

2. **Concurrent Bookings**
   - Test simultaneous appointments
   - Verify double-booking prevention works under load

3. **Slot Generation**
   - Populate slots for 6 months
   - Monitor memory and query time

---

## Error Handling Validation

✅ Test all error scenarios:
- Invalid doctor ID
- Invalid hospital ID
- Invalid date format
- Missing required fields
- Expired JWT token
- Database connection failure
- Invalid status values

---

**All test scenarios should pass before production deployment.**
