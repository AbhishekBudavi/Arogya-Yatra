# Backend Integration: AppointmentScheduling Component

## Overview
The `AppointmentScheduling.jsx` component is now fully integrated with the backend appointment management system. This document explains how the integration works and what features are available.

## Components Involved

### Frontend Components
- **AppointmentScheduling.jsx**: Hospital dashboard component for managing appointments
- **api.js**: Contains API helper functions for appointment operations

### Backend Routes & Controllers
- **appointment.controller.js**: Main controller for appointment operations
- **appointment.routes.js**: API routes for appointment endpoints

## Integration Architecture

### Data Flow

```
Patient Books Appointment (patient/appointment/page.jsx)
           ↓
     Backend Endpoint: POST /api/appointments/book
           ↓
Backend Stores Appointment in Database
           ↓
Hospital Views Appointments (HospitalDashboard/AppointmentScheduling.jsx)
           ↓
     Backend Endpoint: GET /api/appointments/hospital/:hospital_id/appointments
           ↓
Display in Appointment Table
           ↓
Hospital Can Update Status/Cancel
           ↓
Backend Updates Database
```

## API Functions Implemented

### 1. **getHospitalAppointments(hospitalId, filters)**
- **Purpose**: Fetch all appointments for a hospital
- **Endpoint**: `GET /api/appointments/hospital/:hospital_id/appointments`
- **Parameters**:
  - `hospitalId`: Hospital ID
  - `filters`: Object containing `page`, `limit`, `status`, `date`
- **Returns**: List of appointments with pagination
- **Usage**:
```javascript
const response = await appointmentAPI.getHospitalAppointments(hospitalId, {
  page: 1,
  limit: 20,
  status: 'Pending',
  date: '2024-11-23'
});
```

### 2. **getHospitalDoctors(hospitalId)**
- **Purpose**: Fetch all doctors for a hospital
- **Endpoint**: `GET /api/hospital/doctors`
- **Parameters**: `hospitalId`
- **Returns**: Array of doctor objects
- **Usage**:
```javascript
const response = await appointmentAPI.getHospitalDoctors(hospitalId);
```

### 3. **getDoctorAvailability(doctorId, hospitalId, appointmentDate)**
- **Purpose**: Get available time slots for a doctor on a specific date
- **Endpoint**: `GET /api/appointments/slots`
- **Parameters**:
  - `doctorId`: Doctor ID
  - `hospitalId`: Hospital ID
  - `appointmentDate`: Date (YYYY-MM-DD format)
- **Returns**: Available time slots
- **Usage**:
```javascript
const response = await appointmentAPI.getDoctorAvailability(doctorId, hospitalId, '2024-11-23');
```

### 4. **updateAppointmentStatus(appointmentId, status)**
- **Purpose**: Update appointment status (Confirmed, Cancelled, Completed, etc.)
- **Endpoint**: `PATCH /api/appointments/:appointment_id/status`
- **Parameters**:
  - `appointmentId`: Appointment ID
  - `status`: New status (confirmed, pending, cancelled, completed, no-show, rescheduled)
- **Returns**: Updated appointment object
- **Usage**:
```javascript
await appointmentAPI.updateAppointmentStatus(appointmentId, 'confirmed');
```

### 5. **cancelAppointment(appointmentId, cancellationReason)**
- **Purpose**: Cancel an appointment
- **Endpoint**: `DELETE /api/appointments/:appointment_id/cancel`
- **Parameters**:
  - `appointmentId`: Appointment ID
  - `cancellationReason`: Reason for cancellation (optional)
- **Returns**: Cancelled appointment object
- **Usage**:
```javascript
await appointmentAPI.cancelAppointment(appointmentId, 'Cancelled by hospital');
```

### 6. **getAppointmentDetails(appointmentId)**
- **Purpose**: Get detailed information about a specific appointment
- **Endpoint**: `GET /api/appointments/:appointment_id`
- **Parameters**: `appointmentId`
- **Returns**: Appointment details
- **Usage**:
```javascript
const response = await appointmentAPI.getAppointmentDetails(appointmentId);
```

### 7. **rescheduleAppointment(appointmentId, appointmentDate, appointmentTime)**
- **Purpose**: Reschedule an appointment to a different date/time
- **Endpoint**: `PUT /api/appointments/:appointment_id/reschedule`
- **Parameters**:
  - `appointmentId`: Appointment ID
  - `appointmentDate`: New date (YYYY-MM-DD)
  - `appointmentTime`: New time
- **Returns**: Updated appointment object
- **Usage**:
```javascript
await appointmentAPI.rescheduleAppointment(appointmentId, '2024-11-25', '10:00 AM');
```

## Component Features

### 1. **Appointment List Display**
- Shows all appointments for the hospital
- Displays: Patient Name, Doctor, Date, Time, Status
- Searchable by patient name or doctor name
- Paginated display (20 appointments per page)
- Loading states and error handling

### 2. **Status Management**
- Update appointment status with dropdown selector
- Supported statuses:
  - Pending
  - Confirmed
  - Cancelled
  - Completed
  - No-show
- Real-time backend updates

### 3. **Appointment Cancellation**
- Delete/cancel appointments with single click
- Confirmation handled via toast notifications
- Backend validation ensures data integrity

### 4. **Manual Appointment Scheduling** (Hospital Staff)
- Schedule new appointments manually
- Select from available doctors
- Choose available time slots
- Add reason for visit
- Form validation on all required fields

### 5. **Doctor Availability Display**
- Dynamically fetches available time slots
- Based on selected date
- Shows "No slots available" if all booked
- Time slots populated from backend

### 6. **Statistics Dashboard**
- Total Appointments Count
- Confirmed Appointments Count
- Pending Appointments Count
- Today's Appointments Count

## Data Transformation

The component transforms backend data to UI format:

```javascript
// Backend Response
{
  appointment_id: "123",
  first_name: "John",
  last_name: "Doe",
  doctor_name: "Smith",
  appointment_date: "2024-11-23",
  appointment_time: "10:00 AM",
  status: "scheduled"
}

// Transformed for UI
{
  id: "123",
  patient: "John Doe",
  doctor: "Dr. Smith",
  date: "2024-11-23",
  time: "10:00 AM",
  status: "Pending",
  appointment_id: "123"
}
```

## Error Handling

The component implements comprehensive error handling:

```javascript
try {
  // API Call
} catch (err) {
  console.error('Error:', err);
  setError('User-friendly error message');
  onShowToast('Error message', 'error');
} finally {
  setLoading(false);
}
```

Error messages are displayed:
- As inline error banner
- Via toast notifications
- In browser console for debugging

## Loading States

- Loading spinner displayed while fetching appointments
- Disabled buttons during operations
- "Loading slots..." text when fetching time slots
- Prevents double-submission

## Authentication

All API calls include JWT authentication through:
- Cookie-based authentication (withCredentials: true)
- Hospital authentication via verifyJWT('hospital')
- Automatic token sending via axios interceptors

## Connection with Patient Appointment Booking

When a patient books an appointment from `/patient/appointment/page.jsx`:

1. **POST /api/appointments/book** is called with:
   - Patient ID
   - Doctor ID
   - Hospital ID
   - Appointment Date & Time
   - Reason for visit
   - Additional notes

2. **Backend** stores the appointment

3. **Hospital Dashboard** automatically displays it in the appointment list via:
   - Periodic fetch on component mount
   - Page change triggers new fetch
   - Status updates trigger list refresh

## Best Practices Implemented

1. **Separation of Concerns**: API logic separated in `api.js`
2. **Error Handling**: Try-catch blocks with user feedback
3. **Loading States**: Prevents UI freezing and multiple submissions
4. **Data Validation**: Required fields checked before submission
5. **Real-time Updates**: Status changes immediately reflected
6. **Accessibility**: Proper labels and disabled states
7. **Responsive Design**: Mobile and desktop friendly
8. **Dark Mode Support**: Full dark mode styling

## Testing Recommendations

### Unit Tests
- API functions call correct endpoints
- Data transformation works correctly
- Error handling displays proper messages

### Integration Tests
- Patient books appointment
- Appointment appears in hospital dashboard
- Hospital updates appointment status
- Patient sees status change

### E2E Tests
- Complete workflow from booking to completion
- Cancellation workflow
- Rescheduling workflow

## Future Enhancements

1. **Appointment Reminders**: Send notifications before appointments
2. **Doctor Availability Management**: Allow doctors to set their availability
3. **Patient Feedback**: Collect post-appointment feedback
4. **Analytics**: Generate reports on appointment trends
5. **Calendar View**: Visual calendar interface
6. **Bulk Operations**: Cancel/reschedule multiple appointments
7. **Notifications**: Real-time notifications for new bookings

## Database Schema Requirements

Ensure these fields exist in the `appointments` table:
- `appointment_id` (Primary Key)
- `patient_id` (Foreign Key)
- `doctor_id` (Foreign Key)
- `hospital_id` (Foreign Key)
- `appointment_date` (Date)
- `appointment_time` (Time)
- `status` (Enum: scheduled, confirmed, completed, cancelled, no-show, rescheduled)
- `reason_for_visit` (Text)
- `notes` (Text)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

## Troubleshooting

### Appointments not loading
- Check hospital ID is passed correctly
- Verify hospital authentication token
- Check backend `/api/appointments/hospital/:hospital_id/appointments` endpoint

### Doctors list empty
- Verify doctors are registered to hospital
- Check `getHospitalDoctors` endpoint returns data
- Ensure doctors are marked as active

### Status update fails
- Verify appointment ID is correct
- Check status value is valid (lowercase in backend)
- Ensure hospital has permission to update

### Time slots not showing
- Verify doctor and date are selected
- Check doctor availability data in backend
- Ensure date is in future (after today)

## API Endpoint Reference

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| GET | `/api/appointments/hospital/:hospital_id/appointments` | hospital | Get hospital appointments |
| GET | `/api/hospital/doctors` | hospital | Get hospital doctors |
| GET | `/api/appointments/slots` | public | Get available slots |
| PATCH | `/api/appointments/:appointment_id/status` | hospital | Update status |
| DELETE | `/api/appointments/:appointment_id/cancel` | hospital | Cancel appointment |
| GET | `/api/appointments/:appointment_id` | public | Get details |
| PUT | `/api/appointments/:appointment_id/reschedule` | patient | Reschedule |
