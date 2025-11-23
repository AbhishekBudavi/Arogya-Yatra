# Notification System Implementation - Patient Dashboard

## Overview
Complete real-time appointment status update notification system for the patient dashboard. When hospital updates an appointment status, the patient receives an immediate notification in the navbar with status transition details.

## 📋 Components Created & Modified

### 1. **NotificationContext.js** (CREATED)
**Location:** `FrontEnd/app/context/NotificationContext.js`

**Purpose:** Global state management for appointment notifications using React Context API

**Key Features:**
- `NotificationProvider` wrapper component for app-wide notification access
- `useNotifications()` hook for consuming notification functions
- `NotificationsContainer` component for rendering all active notifications
- Auto-dismiss notifications after configurable duration (default: 5 seconds)
- Stores notification metadata: id, type, title, message, appointmentId, oldStatus, newStatus, timestamp

**Exports:**
```javascript
export function NotificationProvider({ children })
export function useNotifications()
export function NotificationsContainer()
```

**State Structure:**
```javascript
notifications: [
  {
    id: number,
    type: 'success' | 'info' | 'warning' | 'error',
    title: string,
    message: string,
    appointmentId: string,
    oldStatus: string,        // e.g., 'pending'
    newStatus: string,        // e.g., 'confirmed'
    timestamp: Date,
    duration: number (ms)
  }
]
```

---

### 2. **NotificationToast.jsx** (CREATED)
**Location:** `FrontEnd/app/components/NotificationToast.jsx`

**Purpose:** UI component for displaying individual notifications

**Features:**
- Status transition badges showing old → new status
- Type-based icons: CheckCircle (success), AlertCircle (error/warning), Info (info)
- Type-based colors: green (success), red (error), yellow (warning), blue (info)
- Auto-slide animation from bottom-right
- Close button (X) for manual dismissal
- Timestamp display
- Fixed positioning: bottom-4 right-4 with z-50

**Component Exports:**
- `NotificationToast({ notification, onClose })` - Single notification display
- `NotificationsContainer()` - Multi-notification manager

---

### 3. **nav-main.jsx** (MODIFIED)
**Location:** `FrontEnd/app/components/patientdashboard/nav-main.jsx`

**Changes Made:**
1. Added imports:
   - `useNotifications` hook from NotificationContext
   
2. Added state variables:
   ```javascript
   const [previousAppointments, setPreviousAppointments] = useState({});
   const [notificationCount, setNotificationCount] = useState(0);
   const [notificationDropdown, setNotificationDropdown] = useState(false);
   const [recentNotifications, setRecentNotifications] = useState([]);
   ```

3. Added appointment polling useEffect:
   - Fetches appointments every 30 seconds
   - Compares previous status with current status
   - Automatically generates notifications on status changes
   - Notification format: "Your appointment with [Doctor] on [Date] is now [Status]"
   - Success notification (green) for 'confirmed' status
   - Info notification (blue) for other statuses

4. Added notification UI:
   - Bell icon with red badge showing pending appointment count
   - Notification dropdown menu showing recent 5 notifications
   - Each notification displays:
     - Colored dot indicator (green/yellow/blue based on type)
     - Title and message
     - Status transition badges (old → new)
     - Timestamp
   - Link to view all appointments at bottom of dropdown
   - Overlay closes dropdown on outside click

5. Updated `handleOverlayClick` to also close notification dropdown

---

### 4. **patient/layout.jsx** (MODIFIED)
**Location:** `FrontEnd/app/(dashboard)/dashboard/patient/layout.jsx`

**Changes Made:**
1. Added imports:
   ```javascript
   import { NotificationProvider, NotificationsContainer } from '../../../context/NotificationContext';
   ```

2. Wrapped entire layout with `NotificationProvider`:
   - Enables all child components to access notification context
   - Provides global notification state management

3. Added `<NotificationsContainer />` at bottom of layout:
   - Renders all active notifications as toasts
   - Positioned fixed bottom-right
   - Auto-dismisses after duration
   - Can be manually closed by user

---

### 5. **RecentAppointmentsPage.jsx** (CREATED - PREVIOUSLY)
**Location:** `FrontEnd/app/(dashboard)/dashboard/patient/appointment/recent-appointments/page.jsx`

**Features:**
- Displays all patient appointments from backend
- 30-second auto-refresh polling
- Status filtering: all, pending, confirmed, completed, cancelled
- Shows appointment details: doctor name, specialization, date, time, hospital, reason
- Color-coded status badges
- "View Details" and "Reschedule" action buttons
- Last refresh timestamp
- Manual refresh button
- Empty state messaging
- Responsive design with dark mode support

---

## 🔄 Data Flow

```
Patient Dashboard (layout.jsx)
    ↓
    ├─ NotificationProvider (wraps entire layout)
    │   ├─ Provides global notification context
    │   └─ Stores notifications array
    │
    ├─ Navbar (nav-main.jsx)
    │   ├─ Polls /appointments/patient every 30s
    │   ├─ Detects status changes
    │   ├─ Calls addNotification() on status change
    │   └─ Shows notification dropdown with recent notifications
    │
    ├─ RecentAppointmentsPage
    │   ├─ Displays all appointments
    │   ├─ Filters by status
    │   └─ Also polls every 30s for live updates
    │
    └─ NotificationsContainer
        └─ Renders all notifications as toasts (fixed bottom-right)
            └─ NotificationToast (individual notification UI)
```

---

## 🔌 API Integration

**Endpoint:** `GET /appointments/patient`

**Response Format:**
```javascript
{
  success: true,
  data: [
    {
      appointment_id: string,
      doctor_name: string,
      appointment_date: string,     // YYYY-MM-DD
      appointment_time: string,     // HH:MM
      status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show' | 'rescheduled',
      hospital_name: string,
      specialization: string,
      reason_for_visit: string,
      notes: string
    }
  ]
}
```

---

## 🎨 Notification UI Design

### Notification Toast (Individual)
```
┌─ Slide-in animation from bottom-right
│
├─ Status Indicator (colored dot)
│  └─ Green for success, Yellow for warning, Blue for info, Red for error
│
├─ Content
│  ├─ Title (bold, primary text)
│  ├─ Message (secondary text)
│  ├─ Status Transition (old → new badges)
│  └─ Timestamp (small, tertiary text)
│
└─ Close Button (X)
```

### Notification Dropdown (Navbar)
```
┌─ Title: "Appointment Updates"
├─ Pending count
│
├─ Recent Notifications (max 5)
│  ├─ Colored indicator dot
│  ├─ Title
│  ├─ Message (truncated)
│  ├─ Status badges (old → new)
│  └─ Timestamp
│
└─ Link to view all appointments
```

---

## 🔔 Notification Types & Colors

| Type | Color | Icon | Use Case |
|------|-------|------|----------|
| `success` | Green | CheckCircle | Appointment confirmed |
| `error` | Red | AlertCircle | Appointment cancelled, error |
| `warning` | Yellow | AlertCircle | Appointment pending, needs attention |
| `info` | Blue | Info | Appointment rescheduled, no-show, completed |

---

## ⚙️ Configuration

### Polling Interval
- **Default:** 30 seconds
- **Location:** `nav-main.jsx` and `RecentAppointmentsPage.jsx`
- **Adjustable:** Modify `setInterval(fetchAppointments, 30000)` value

### Notification Duration
- **Default:** 8 seconds (navbar notification), 5 seconds (context default)
- **Location:** `nav-main.jsx` - `duration: 8000`
- **Adjustable:** Modify `notification.duration` value

### Max Notifications Displayed
- **Dropdown:** 5 most recent notifications
- **Toast:** All notifications simultaneously (stacked)

---

## 📱 Responsive Design

- **Desktop:** Full navbar with dropdown, notifications in bottom-right
- **Tablet:** Responsive layout, dropdown adapts to screen
- **Mobile:** Hamburger menu, notification dropdown full-width dropdown

---

## ✅ Testing Checklist

- [ ] Patient boots appointment → appointment appears in Recent Appointments
- [ ] Hospital updates appointment status → notification appears in navbar within 30 seconds
- [ ] Notification shows correct status transition (old → new)
- [ ] Notification auto-dismisses after 8 seconds
- [ ] User can manually close notification with X button
- [ ] Notification dropdown shows recent 5 notifications
- [ ] Bell icon shows pending count badge
- [ ] "View all appointments" link navigates to Recent Appointments page
- [ ] Dropdown closes on outside click
- [ ] Page auto-refreshes every 30 seconds
- [ ] Multiple status changes show multiple notifications
- [ ] Notification colors match status types correctly

---

## 🚀 Deployment Notes

1. **Provider Placement:** NotificationProvider must wrap patient dashboard for all appointment features to work
2. **Context Import:** All components using notifications must import `useNotifications` hook
3. **Error Handling:** API errors are logged to console; graceful fallback to no notifications
4. **Performance:** 30-second polling optimizes server load while maintaining responsiveness
5. **JWT Authentication:** All API calls include credentials via axios withCredentials

---

## 📝 File Manifest

| File | Status | Lines | Purpose |
|------|--------|-------|---------|
| `NotificationContext.js` | ✅ Created | 82 | Global notification state + UI container |
| `NotificationToast.jsx` | ✅ Created | 91 | Toast UI component |
| `RecentAppointmentsPage.jsx` | ✅ Created | 318 | Appointment list with filtering & polling |
| `nav-main.jsx` | ✅ Modified | 356 | Navbar with notification dropdown & polling |
| `patient/layout.jsx` | ✅ Modified | 60 | Added NotificationProvider wrapper |

---

## 🔗 Related Documentation

- `APPOINTMENT_SYSTEM_DIAGRAMS.md` - System architecture overview
- `APPOINTMENT_INTEGRATION_SUMMARY.md` - Backend integration details
- `README_APPOINTMENT_FEATURE.md` - Feature overview
- `BACKEND_INTEGRATION_GUIDE.md` - API integration guide

---

**Last Updated:** November 23, 2025
**Status:** ✅ COMPLETE - Ready for testing and deployment
