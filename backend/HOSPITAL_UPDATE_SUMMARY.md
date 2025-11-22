# Hospital Authentication System - Update Summary

## Changes Made

### 1. ✅ Removed Separate Hospital JWT Middleware
- **Deleted:** The separate `verifyJWTHospital.js` middleware is **no longer needed**
- **Reason:** The existing `verifyJWT` middleware now supports all roles (patient, doctor, hospital)

### 2. ✅ Enhanced verifyJWT Middleware
**File:** `Backend/middlewares/verifyJWT.js`

Updated to support hospital tokens:
```javascript
const hospitalToken = cookies.hospitalAuthToken || null;

// Choose token according to requiredRole or fallback order
let token = null;
if (requiredRole === 'patient') token = patientToken || bearerToken;
else if (requiredRole === 'doctor') token = doctorToken || bearerToken;
else if (requiredRole === 'hospital') token = hospitalToken || bearerToken;
else token = patientToken || doctorToken || hospitalToken || bearerToken;
```

**Usage in routes:**
```javascript
app.get('/api/hospital/dashboard', verifyJWT('hospital'), getHospitalDashboard);
```

### 3. ✅ Updated Hospital Controller
**File:** `Backend/controllers/hospital.controller.js`

Added support for all hospital fields:
- `departments` - Hospital departments (TEXT)
- `bed_count` - Total bed count (INT)
- `icu_available` - Boolean flag (BOOLEAN)
- `emergency_services` - Boolean flag (BOOLEAN)

**Registration now handles:**
```javascript
const {
  custom_hospital_id, 
  hospital_name, 
  hospital_type, 
  address, 
  pincode, 
  city, 
  state, 
  country, 
  admin_name, 
  admin_mobile_number, 
  email,
  password,
  departments,        // NEW
  bed_count,          // NEW
  icu_available,      // NEW
  emergency_services  // NEW
} = req.body;
```

**Changed `req.hospital` to `req.user`:**
- Since we're now using the unified `verifyJWT` middleware, the decoded token is attached to `req.user` instead of `req.hospital`

### 4. ✅ Updated Hospital Model
**File:** `Backend/models/hospital.model.js`

Updated `createHospital` method to include all fields:
```javascript
const result = await db.query(
  `INSERT INTO hospitals (
     custom_hospital_id, hospital_name, hospital_type, address, pincode, city, 
     state, country, admin_name, admin_mobile_number, password, email, 
     departments, bed_count, icu_available, emergency_services, 
     created_by, updated_by
  ) VALUES (
    $1, $2, $3, $4, $5, $6, $7, $8,
    $9, $10, $11, $12, $13, $14, $15, $16, $17, $18
  ) RETURNING ...`,
  [
    custom_hospital_id, hospital_name, hospital_type, address, pincode, city, 
    state, country, admin_name, admin_mobile_number, password, email,
    departments, bed_count, icu_available, emergency_services,
    created_by, updated_by
  ]
);
```

### 5. ✅ Updated Server Routes
**File:** `Backend/server.js`

**Before:**
```javascript
const { verifyHospitalJWT } = require('./middlewares/verifyJWTHospital');
app.get('/api/hospital/dashboard', verifyHospitalJWT, getHospitalDashboard);
app.post('/api/hospital/logout', verifyHospitalJWT, logoutHospital);
```

**After:**
```javascript
app.get('/api/hospital/dashboard', verifyJWT('hospital'), getHospitalDashboard);
app.post('/api/hospital/logout', verifyJWT('hospital'), logoutHospital);
```

Removed import of `verifyHospitalJWT` middleware.

### 6. ✅ Updated Documentation
**File:** `Backend/HOSPITAL_AUTH_GUIDE.md`

- Updated middleware section to explain the unified `verifyJWT` middleware
- Added all new fields to API examples (departments, bed_count, icu_available, emergency_services)
- Updated request/response examples
- Updated cURL examples with new fields
- Clarified that separate middleware is no longer needed

## Database Schema

The hospital table now includes:
```sql
CREATE TABLE hospitals (
  hospital_id SERIAL PRIMARY KEY,
  custom_hospital_id VARCHAR(255) UNIQUE NOT NULL,
  hospital_name VARCHAR(255) NOT NULL,
  hospital_type VARCHAR(50),
  address TEXT,
  pincode VARCHAR(10),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(100),
  admin_name VARCHAR(255) NOT NULL,
  admin_mobile_number VARCHAR(20) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  contact_number VARCHAR(20),
  alternate_contact VARCHAR(20),
  departments TEXT,                    -- NEW
  bed_count INT,                       -- NEW
  icu_available BOOLEAN DEFAULT false, -- NEW
  emergency_services BOOLEAN DEFAULT false, -- NEW
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);
```

## API Request Example

### Register Hospital
```bash
curl -X POST http://localhost:5000/api/hospital/register \
  -H "Content-Type: application/json" \
  -d '{
    "custom_hospital_id": "HOSP001",
    "hospital_name": "City General Hospital",
    "hospital_type": "Private",
    "address": "123 Medical Street",
    "pincode": "400001",
    "city": "Mumbai",
    "state": "Maharashtra",
    "country": "India",
    "admin_name": "Dr. Sharma",
    "admin_mobile_number": "9876543210",
    "email": "admin@cityhospital.com",
    "password": "securePassword123",
    "departments": "Cardiology, General Medicine, Surgery",
    "bed_count": 150,
    "icu_available": true,
    "emergency_services": true
  }'
```

## Files Changed

| File | Status | Changes |
|------|--------|---------|
| `/Backend/middlewares/verifyJWT.js` | ✅ Updated | Added hospital token support |
| `/Backend/controllers/hospital.controller.js` | ✅ Updated | Added new fields, changed req.hospital to req.user |
| `/Backend/models/hospital.model.js` | ✅ Updated | Added all hospital fields to INSERT query |
| `/Backend/server.js` | ✅ Updated | Removed verifyHospitalJWT import, use verifyJWT('hospital') |
| `/Backend/HOSPITAL_AUTH_GUIDE.md` | ✅ Updated | Updated documentation with new fields and unified middleware |
| `/Backend/middlewares/verifyJWTHospital.js` | ❌ Removed | No longer needed - use verifyJWT instead |

## Key Benefits

1. **Unified Middleware:** Single `verifyJWT` middleware handles all user types (patient, doctor, hospital)
2. **Cleaner Code:** Less duplication, easier to maintain
3. **Consistent Patterns:** All roles follow the same authentication pattern
4. **Better Scalability:** Easy to add new roles in the future
5. **Complete Hospital Data:** All hospital-specific fields are now captured and managed

## Next Steps

1. Ensure the PostgreSQL hospital table is created using the provided SQL
2. Restart the backend server
3. Test the updated endpoints with the new fields
4. Update frontend components to send the new hospital fields during registration
