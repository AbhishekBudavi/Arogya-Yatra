# AppointmentScheduling Integration - Quick Setup & Testing Guide

## Quick Start

### What's Been Integrated
✅ API helper functions in `FrontEnd/app/utils/api.js`  
✅ AppointmentScheduling component fully connected to backend  
✅ Real-time appointment fetching and management  
✅ Doctor availability system  
✅ Status tracking and updates  
✅ Error handling and loading states  

## File Changes Summary

### 1. **FrontEnd/app/utils/api.js**
Added new `appointmentAPI` object with 7 functions:
- `getHospitalAppointments()` - Fetch hospital appointments
- `getHospitalDoctors()` - Get doctors for hospital
- `getDoctorAvailability()` - Get available time slots
- `updateAppointmentStatus()` - Change appointment status
- `cancelAppointment()` - Cancel appointment
- `getAppointmentDetails()` - Get appointment details
- `rescheduleAppointment()` - Reschedule appointment

### 2. **FrontEnd/app/components/HospitalDashboard/AppointmentScheduling.jsx**
Completely rewritten with:
- Real backend API integration
- Dynamic doctor list fetching
- Available slots management
- Status update functionality
- Appointment cancellation
- Pagination support
- Search/filter capabilities
- Loading states
- Error handling
- Statistics dashboard
- Form validation

## How to Test

### Prerequisites
1. Backend server running on `http://localhost:5000`
2. Hospital admin logged in
3. At least one doctor registered for the hospital

### Testing Workflow

#### Test 1: View Appointments
1. Navigate to Hospital Dashboard → Appointment Scheduling
2. Should see list of all appointments for the hospital
3. If no appointments: "No appointments scheduled" message
4. Check pagination at bottom if multiple pages

```bash
# API Called:
GET /api/appointments/hospital/:hospital_id/appointments?page=1&limit=20
```

#### Test 2: Update Appointment Status
1. Click status dropdown on any appointment
2. Select new status (Confirmed, Cancelled, Completed, No-show)
3. Should see success toast notification
4. Status should update immediately in table

```bash
# API Called:
PATCH /api/appointments/:appointment_id/status
Body: { "status": "confirmed" }
```

#### Test 3: Cancel Appointment
1. Click trash icon on any appointment
2. Should see success message
3. Appointment should disappear from list

```bash
# API Called:
DELETE /api/appointments/:appointment_id/cancel
Body: { "cancellation_reason": "Cancelled by hospital" }
```

#### Test 4: Schedule New Appointment
1. Click "Schedule Appointment" button
2. Fill in form:
   - Patient Name: "John Doe"
   - Doctor: Select from dropdown
   - Date: Pick a future date
   - Time: Should auto-populate based on availability
   - Reason: Enter reason for visit
3. Click "Schedule" button
4. Should see success message
5. New appointment appears in list

```bash
# Backend Calls:
GET /api/hospital/doctors - Get doctor list
GET /api/appointments/slots - Get available slots when date selected
POST /api/appointments/book - Book the appointment
```

#### Test 5: Search Functionality
1. Type patient name in search box
2. Appointments list filters in real-time
3. Type doctor name (format: "Dr. Smith")
4. Should show matching appointments

#### Test 6: Pagination
1. If appointments > 20, pagination buttons appear at bottom
2. Click page 2, 3, etc.
3. New page of appointments loads
4. Current page highlighted

### Expected Responses

#### Success Response (getHospitalAppointments)
```json
{
  "success": true,
  "data": [
    {
      "appointment_id": "123",
      "patient_id": "P001",
      "first_name": "John",
      "last_name": "Doe",
      "doctor_name": "Smith",
      "specialization": "Cardiology",
      "appointment_date": "2024-11-23",
      "appointment_time": "10:00 AM",
      "status": "scheduled",
      "reason_for_visit": "Checkup",
      "notes": "Follow-up needed"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

#### Success Response (updateAppointmentStatus)
```json
{
  "success": true,
  "message": "Appointment status updated successfully",
  "data": {
    "appointment_id": "123",
    "status": "confirmed"
  }
}
```

## Integration Points - Patient → Hospital Flow

### When Patient Books Appointment:
1. Patient navigates to `/dashboard/patient/appointment/`
2. Searches for doctor by specialty
3. Selects date and time
4. Books appointment
5. **Backend stores in database**

### When Hospital Views Appointments:
1. Hospital admin navigates to `HospitalDashboard/AppointmentScheduling`
2. Component fetches appointments via `getHospitalAppointments()`
3. Displays in table format
4. Hospital can update status or cancel

### Appointment Flow Diagram:
```
Patient Booking Flow:
  Patient Search → Select Doctor → Pick Date/Time → Book
         ↓
  POST /api/appointments/book
         ↓
  Database Stores Appointment
         ↓
         
Hospital Management Flow:
  View Appointments → Update Status → Save Changes
         ↓
  GET /api/appointments/hospital/:hospital_id/appointments
         ↓
  PATCH /api/appointments/:appointment_id/status
         ↓
  Database Updates
```

## Debugging

### Enable Console Logging
All API calls log to browser console:
```javascript
console.log('Error fetching appointments:', err);
console.error('Error updating appointment status:', err);
```

Open DevTools → Console tab to see:
- API request/response data
- Error messages
- Component state changes

### Check Network Tab
1. Open DevTools → Network tab
2. Perform appointment action
3. Look for API calls:
   - `GET /api/appointments/hospital/:hospital_id/appointments`
   - `PATCH /api/appointments/:appointment_id/status`
   - `DELETE /api/appointments/:appointment_id/cancel`
4. Check response status (200, 400, 401, 404, 500)

### Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| No appointments showing | Check hospital_id in hospitalData prop, verify appointments exist in DB |
| Doctors list empty | Ensure doctors are registered to hospital, check getHospitalDoctors endpoint |
| Status update fails | Check appointment_id format, verify hospital authentication |
| API 401 Unauthorized | Check JWT token, ensure hospital is logged in |
| API 404 Not Found | Verify appointment/hospital IDs exist in database |
| Time slots not loading | Select date first, check doctor availability data |

## Code Structure

### Component Structure
```
AppointmentScheduling.jsx
├── State Management
│   ├── appointments - Array of appointment objects
│   ├── doctors - Array of doctor objects
│   ├── availableSlots - Array of time strings
│   ├── loading - Boolean for loading state
│   ├── error - String for error messages
│   └── pagination - Pagination state
│
├── Effects
│   ├── useEffect (mount) - Fetch initial data
│   └── useEffect (page change) - Refetch on pagination
│
├── Data Fetching Functions
│   ├── fetchAppointments() - GET hospital appointments
│   ├── fetchDoctors() - GET hospital doctors
│   └── handleDateChange() - GET available slots
│
├── Action Functions
│   ├── handleAddAppointment() - Manual scheduling
│   ├── handleStatusChange() - PATCH status
│   └── handleDeleteAppointment() - DELETE appointment
│
└── UI Sections
    ├── Header
    ├── Error Banner
    ├── Appointment Form
    ├── Search Bar
    ├── Appointments Table
    ├── Pagination
    └── Statistics Cards
```

## Performance Considerations

1. **Pagination**: Limits 20 appointments per page to reduce data load
2. **Caching**: Component refetches only on page change or explicit action
3. **Debouncing**: Search is instant but filters locally (no API call)
4. **Loading States**: Prevents multiple simultaneous API calls
5. **Error Recovery**: Errors caught and displayed without crashing app

## Security Measures

1. **Authentication**: All endpoints require hospital JWT
2. **Authorization**: Backend validates hospital ownership of appointments
3. **Input Validation**: Form validates required fields
4. **Error Messages**: Generic messages don't expose sensitive data
5. **CORS**: Backend configured with proper CORS headers

## Environment Variables Needed

In `.env.local` (Frontend):
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

In `.env` (Backend):
```
DATABASE_URL=your_db_connection
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Testing Checklist

- [ ] Appointments load on page visit
- [ ] Search filters appointments in real-time
- [ ] Status dropdown changes status with API call
- [ ] Cancel button removes appointment
- [ ] Pagination works with multiple pages
- [ ] Schedule form validates required fields
- [ ] Date picker shows future dates only
- [ ] Time slots load when date selected
- [ ] Loading spinner shows during operations
- [ ] Error messages display on failures
- [ ] Toast notifications appear for actions
- [ ] Statistics update after each action

## Next Steps

1. **Verify Backend**: Run migrations and seed data
2. **Test Workflows**: Follow testing workflow above
3. **Deploy**: Push changes to staging/production
4. **Monitor**: Check logs for any errors
5. **Enhance**: Add more features based on feedback

---

For detailed integration documentation, see `BACKEND_INTEGRATION_GUIDE.md`
