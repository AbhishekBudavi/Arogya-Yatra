# Hospital Authentication - Quick Reference

## Using verifyJWT Middleware for Hospital Routes

### Unified Middleware Pattern
The `verifyJWT` middleware now supports all roles. Use it consistently:

```javascript
// Patient routes
app.get('/api/patient/dashboard', verifyJWT('patient'), getPatientDashboard);

// Doctor routes
app.get('/api/doctor/profile', verifyJWT('doctor'), getDoctorProfile);

// Hospital routes
app.get('/api/hospital/dashboard', verifyJWT('hospital'), getHospitalDashboard);
```

---

## Controller Access Pattern

### Before (Old Pattern)
```javascript
const getHospitalDashboard = async (req, res) => {
  const { hospital_id } = req.hospital;  // ❌ Wrong
  // ...
};
```

### After (New Pattern)
```javascript
const getHospitalDashboard = async (req, res) => {
  const { hospital_id } = req.user;  // ✅ Correct
  // ...
};
```

---

## Available Fields for Hospital Registration

```javascript
{
  // Required Fields
  custom_hospital_id: string,        // Unique identifier
  hospital_name: string,              // Hospital name
  admin_name: string,                 // Admin name
  admin_mobile_number: string,        // Admin phone (unique)
  password: string,                   // Will be hashed with bcrypt
  
  // Optional but Recommended
  hospital_type: string,              // e.g., "Private", "Government"
  address: string,                    // Full address
  pincode: string,                    // Postal code
  city: string,                       // City name
  state: string,                      // State name
  country: string,                    // Country name
  email: string,                      // Email address
  
  // New Hospital-Specific Fields
  departments: string,                // Comma-separated departments
  bed_count: number,                  // Total beds
  icu_available: boolean,             // ICU available flag
  emergency_services: boolean         // Emergency services flag
}
```

---

## JWT Token Claims

The hospital JWT token contains:
```javascript
{
  hospital_id: number,
  custom_hospital_id: string,
  hospital_name: string,
  admin_mobile_number: string,
  role: "hospital",
  iat: number,        // Issued at time
  exp: number         // Expiration time (7 days)
}
```

---

## Cookie Configuration

### Registration/Login
- **Cookie Name:** `hospitalAuthToken`
- **Type:** httpOnly (secure in production)
- **Duration:** 7 days
- **SameSite:** Strict

### JavaScript Cookie Access
```javascript
// The cookie is automatically sent with every request
// No need to manually set it
// Just ensure axios has: withCredentials: true
```

---

## Database Timestamps

Automatically managed by PostgreSQL:
- **created_at:** Set when hospital is registered
- **updated_at:** Set when hospital is registered (updates on modifications)
- **created_by:** Set to "system" on registration
- **updated_by:** Set to "system" on registration

---

## Verifying Hospital in Request

In any protected hospital route:
```javascript
app.get('/api/hospital/info', verifyJWT('hospital'), async (req, res) => {
  // req.user contains the decoded JWT
  const hospitalData = {
    hospital_id: req.user.hospital_id,
    custom_hospital_id: req.user.custom_hospital_id,
    hospital_name: req.user.hospital_name,
    admin_mobile_number: req.user.admin_mobile_number,
    role: req.user.role  // Always "hospital"
  };
  
  res.json(hospitalData);
});
```

---

## Common Error Responses

| Status | Message | Cause |
|--------|---------|-------|
| 400 | Missing required fields | Not all required fields in request |
| 409 | Hospital already exists | Duplicate mobile or custom_id |
| 401 | Token not provided | No cookie or Bearer token |
| 403 | Invalid or expired token | Token verification failed |
| 403 | Access denied | Role mismatch (expected 'hospital') |
| 404 | Hospital not found | Hospital doesn't exist in DB |

---

## Testing with cURL

### Test Registration
```bash
curl -X POST http://localhost:5000/api/hospital/register \
  -H "Content-Type: application/json" \
  -d '{"custom_hospital_id":"TEST001","hospital_name":"Test Hospital","hospital_type":"Private","address":"Test St","pincode":"12345","city":"TestCity","state":"TestState","country":"India","admin_name":"John","admin_mobile_number":"9999999999","email":"test@hospital.com","password":"Test@123","departments":"General Medicine","bed_count":50,"icu_available":true,"emergency_services":false}'
```

### Test Login
```bash
curl -X POST http://localhost:5000/api/hospital/login \
  -H "Content-Type: application/json" \
  -d '{"admin_mobile_number":"9999999999","password":"Test@123"}'
```

### Test Protected Route (with token from response)
```bash
curl -X GET http://localhost:5000/api/hospital/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Frontend Integration (React/Next.js)

### Using Axios
```javascript
// Ensure withCredentials is true in axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true  // ✅ Important!
});

// Register
const response = await axiosInstance.post('/hospital/register', {
  custom_hospital_id: 'HOSP001',
  hospital_name: 'My Hospital',
  // ... other fields
});

// Dashboard (token automatically sent via cookie)
const dashboard = await axiosInstance.get('/hospital/dashboard');
```

---

## Security Notes

1. ✅ Passwords are hashed with bcrypt (10 rounds)
2. ✅ Tokens are stored in httpOnly cookies (not accessible via JS)
3. ✅ Custom ID and mobile number are unique at database level
4. ✅ Token expires after 7 days
5. ✅ Role is enforced at middleware level
6. ✅ All dates automatically tracked by PostgreSQL

