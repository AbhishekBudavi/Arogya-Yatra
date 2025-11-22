# Hospital Registration & Authentication API

## Overview
This document describes the hospital registration, login, and authentication system for the Arogya Yatra application.

## Setup Instructions

### 1. Database Setup

Run the following SQL query in your PostgreSQL database:

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
  departments TEXT,
  bed_count INT,
  icu_available BOOLEAN DEFAULT false,
  emergency_services BOOLEAN DEFAULT false,
  created_by VARCHAR(255),
  updated_by VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT true
);

CREATE INDEX idx_hospital_custom_id ON hospitals(custom_hospital_id);
CREATE INDEX idx_hospital_mobile ON hospitals(admin_mobile_number);
CREATE INDEX idx_hospital_email ON hospitals(email);
CREATE INDEX idx_hospital_active ON hospitals(is_active);
```

### 2. Ensure Dependencies

The following npm packages are already installed and required:
- `bcrypt` - For password hashing
- `jsonwebtoken` - For JWT token generation
- `cookie-parser` - For cookie management
- `express` - Web framework

### 3. Environment Variables

Ensure your `.env` file contains:
```
JWT_SECRET=your_secret_key_here
NODE_ENV=development
DB_USER=your_db_user
DB_HOST=localhost
DB_NAME=arogya_yatra
DB_PASS=your_db_password
DB_PORT=5432
```

---

## API Endpoints

### 1. Register Hospital
**POST** `/api/hospital/register`

**Request Body:**
```json
{
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
}
```

**Response (201 - Created):**
```json
{
  "success": true,
  "message": "Hospital registered successfully",
  "data": {
    "hospital_id": 1,
    "custom_hospital_id": "HOSP001",
    "hospital_name": "City General Hospital",
    "admin_name": "Dr. Sharma",
    "admin_mobile_number": "9876543210",
    "email": "admin@cityhospital.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- **400**: Missing required fields
- **409**: Hospital with this mobile number or custom ID already exists
- **500**: Server error

---

### 2. Login Hospital
**POST** `/api/hospital/login`

**Request Body:**
```json
{
  "admin_mobile_number": "9876543210",
  "password": "securePassword123"
}
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "hospital_id": 1,
    "custom_hospital_id": "HOSP001",
    "hospital_name": "City General Hospital",
    "admin_name": "Dr. Sharma",
    "admin_mobile_number": "9876543210",
    "email": "admin@cityhospital.com"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error Responses:**
- **400**: Missing mobile number or password
- **404**: Hospital not found
- **401**: Invalid credentials
- **500**: Server error

---

### 3. Get Hospital Dashboard
**GET** `/api/hospital/dashboard`

**Headers:**
```
Authorization: Bearer <token>
OR
Cookie: hospitalAuthToken=<token>
```

**Response (200 - OK):**
```json
{
  "success": true,
  "data": {
    "hospital_id": 1,
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
    "departments": "Cardiology, General Medicine, Surgery",
    "bed_count": 150,
    "icu_available": true,
    "emergency_services": true,
    "created_at": "2025-11-21T10:30:00Z",
    "updated_at": "2025-11-21T10:30:00Z"
  }
}
```

**Error Responses:**
- **401**: Token not provided
- **403**: Invalid or expired token
- **404**: Hospital not found
- **500**: Server error

---

### 4. Logout Hospital
**POST** `/api/hospital/logout`

**Headers:**
```
Authorization: Bearer <token>
OR
Cookie: hospitalAuthToken=<token>
```

**Response (200 - OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## JWT Token Structure

The JWT token contains the following payload:
```json
{
  "hospital_id": 1,
  "custom_hospital_id": "HOSP001",
  "hospital_name": "City General Hospital",
  "admin_mobile_number": "9876543210",
  "role": "hospital",
  "iat": 1637500200,
  "exp": 1638105000
}
```

**Token Duration:** 7 days

---

## Security Features

1. **Password Hashing:** Passwords are hashed using bcrypt (10 salt rounds)
2. **HTTP-Only Cookies:** JWT tokens are stored in HTTP-only cookies to prevent XSS attacks
3. **Unique Fields:** Custom hospital ID and mobile number are enforced as unique
4. **Role-Based Access:** JWT includes a 'hospital' role for authorization
5. **Token Expiration:** Tokens expire after 7 days

---

## Middleware

### verifyJWT (Universal Middleware)
Located at: `/Backend/middlewares/verifyJWT.js`

This middleware supports multiple roles including 'hospital'. For hospital routes:

```javascript
app.get('/api/hospital/protected-route', verifyJWT('hospital'), controllerFunction);
```

The middleware:
- Extracts JWT from cookies (`hospitalAuthToken`) or Authorization header
- Verifies token validity
- Checks for the required role (in this case 'hospital')
- Attaches decoded data to `req.user`

**Usage for Hospital:**
```javascript
// In routes
app.get('/api/hospital/dashboard', verifyJWT('hospital'), getHospitalDashboard);

// In controller
const { hospital_id } = req.user; // Access user data from req.user
```

**Supported Roles:**
- `patient` - Uses `patientAuthToken` cookie
- `doctor` - Uses `doctorAuthToken` cookie  
- `hospital` - Uses `hospitalAuthToken` cookie

---

## Model Methods

Located at: `/Backend/models/hospital.model.js`

### Available Methods:

1. **createHospital(data)** - Creates a new hospital record
2. **getHospitalByMobileNumber(phone)** - Retrieves hospital by mobile number
3. **getHospitalById(id)** - Retrieves hospital by hospital_id
4. **getHospitalByCustomId(custom_id)** - Retrieves hospital by custom_hospital_id

---

## Frontend Integration Example

### Using Axios (React/Next.js)

```javascript
// Register Hospital
const registerHospital = async (formData) => {
  try {
    const response = await axiosInstance.post('/hospital/register', formData);
    console.log('Hospital registered:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error:', error.response.data);
  }
};

// Login Hospital
const loginHospital = async (mobileNumber, password) => {
  try {
    const response = await axiosInstance.post('/hospital/login', {
      admin_mobile_number: mobileNumber,
      password: password
    });
    console.log('Login successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response.data);
  }
};

// Get Hospital Dashboard
const getHospitalDashboard = async () => {
  try {
    const response = await axiosInstance.get('/hospital/dashboard');
    return response.data;
  } catch (error) {
    console.error('Dashboard error:', error.response.data);
  }
};

// Logout
const logoutHospital = async () => {
  try {
    const response = await axiosInstance.post('/hospital/logout');
    console.log('Logout successful:', response.data);
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response.data);
  }
};
```

---

## Testing with cURL

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

### Login Hospital
```bash
curl -X POST http://localhost:5000/api/hospital/login \
  -H "Content-Type: application/json" \
  -d '{
    "admin_mobile_number": "9876543210",
    "password": "securePassword123"
  }'
```

### Get Dashboard (with token)
```bash
curl -X GET http://localhost:5000/api/hospital/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Files Modified/Created

1. **Updated:** `/Backend/middlewares/verifyJWT.js` - Added hospital token support
2. **Updated:** `/Backend/models/hospital.model.js` - Added all hospital fields to create query
3. **Updated:** `/Backend/controllers/hospital.controller.js` - Complete registration/login logic with all fields
4. **Updated:** `/Backend/server.js` - Added hospital routes using verifyJWT('hospital')
5. **Created:** `/Backend/migrations/create_hospitals_table.sql` - Database migration

**Note:** The separate `verifyJWTHospital.js` middleware is no longer needed. The existing `verifyJWT` middleware now supports hospital authentication.

---

## Troubleshooting

### Common Issues:

1. **"Token not provided" error**
   - Ensure the Authorization header includes "Bearer " prefix
   - Or ensure cookies are being sent with the request

2. **"Invalid credentials" error**
   - Check that the password is correct
   - Verify the mobile number exists in the database

3. **"Hospital already exists" error**
   - The custom_hospital_id or admin_mobile_number is already in use
   - Use a unique custom_hospital_id and mobile number

4. **CORS errors**
   - Ensure the frontend URL matches the CORS configuration in server.js
   - Enable credentials in axios: `withCredentials: true`

---

## Next Steps

1. Run the SQL migration to create the hospitals table
2. Install dependencies: `npm install`
3. Start the backend server: `npm run dev`
4. Test the endpoints using the provided cURL commands or Postman
5. Integrate frontend components with the API endpoints

