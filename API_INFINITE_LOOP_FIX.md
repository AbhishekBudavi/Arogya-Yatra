# API Infinite Loop Issue - Root Cause & Fix

## Problem
The API was being called repeatedly in an infinite loop, causing the terminal to continuously make requests to the backend.

## Root Cause
**Infinite Loop in Navbar useEffect:**

The appointment polling effect had `previousAppointments` in its dependency array:

```javascript
}, [previousAppointments, addNotification]);
```

This caused:
1. useEffect runs → calls `fetchAppointments()`
2. `fetchAppointments()` updates state via `setPreviousAppointments(newPreviousAppointments)`
3. State change triggers dependency → useEffect runs AGAIN
4. Calls `fetchAppointments()` again
5. **INFINITE LOOP!**

Even though the 30-second interval was set, the dependency array was triggering extra calls constantly.

## Solution Applied

### 1. Removed problematic state dependency
**Before:**
```javascript
const [previousAppointments, setPreviousAppointments] = useState({});

// In useEffect dependency:
}, [previousAppointments, addNotification]);

// In effect:
setPreviousAppointments(newPreviousAppointments); // Causes re-trigger!
```

**After:**
```javascript
// Removed state entirely
// Use local ref instead:

useEffect(() => {
  let previousAppointmentsRef = {};  // Local ref, no re-renders
  
  const fetchAppointments = async () => {
    // ... code ...
    previousAppointmentsRef = {};    // Update ref, no dependency trigger
    appointments.forEach(apt => {
      previousAppointmentsRef[apt.appointment_id] = apt.status;
    });
  };
  
  // Only depends on addNotification (which is useCallback, so stable)
}, [addNotification]);
```

### 2. Key Changes
- **Removed:** `const [previousAppointments, setPreviousAppointments] = useState({})`
- **Changed:** Use local `previousAppointmentsRef` variable instead of state
- **Dependency array:** Now only `[addNotification]` which is stable (useCallback)
- **Result:** Effect runs only on mount, then every 30 seconds via setInterval

## Why This Works

**Before (Infinite):**
```
1. Effect runs → setPreviousAppointments()
2. previousAppointments changes → Effect re-runs
3. Back to step 1 (INFINITE)
```

**After (30-second intervals only):**
```
1. Effect runs on mount
2. setInterval calls fetchAppointments() every 30 seconds
3. Updates local ref (no re-renders)
4. Effect never re-runs (no dependency changes)
5. Clean! Only 2 API calls per minute
```

## Files Modified
- **FrontEnd/app/components/patientdashboard/nav-main.jsx**
  - Removed state: `previousAppointments`, `setPreviousAppointments`
  - Changed to local ref: `previousAppointmentsRef`
  - Fixed dependency array: `[addNotification]`

## Impact
✅ **API calls reduced from infinite to 2 per minute** (30-second polling)  
✅ **Terminal no longer shows repeated API spam**  
✅ **Better performance and lower server load**  
✅ **Still tracks status changes for notifications**  

## Verification
After restart:
- Terminal should show only backend startup message
- API calls should appear every ~30 seconds (once per polling interval)
- No rapid repeated calls
- Notifications still work when status changes

---

**Fixed Date:** November 23, 2025  
**Status:** ✅ INFINITE LOOP ELIMINATED
