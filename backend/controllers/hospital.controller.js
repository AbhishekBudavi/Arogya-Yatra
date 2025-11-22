const Hospital = require('../models/hospital.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Register a new hospital
const registerHospital = async (req, res) => {
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
    departments,
    bed_count,
    icu_available,
    emergency_services
  } = req.body;

  // Validate required fields
  if (!custom_hospital_id || !hospital_name || !admin_name || !password || !admin_mobile_number) {
    return res.status(400).json({
      success: false,
      message: 'Custom hospital ID, hospital name, admin name, password, and mobile number are required',
    });
  }

  try {
    // Check if hospital already exists
    const existingHospital = await Hospital.getHospitalByMobileNumber(admin_mobile_number);
    if (existingHospital) {
      return res.status(409).json({
        success: false,
        message: 'Hospital with this mobile number already exists',
      });
    }

    // Check if custom_hospital_id already exists
    const existingCustomId = await Hospital.getHospitalByCustomId(custom_hospital_id);
    if (existingCustomId) {
      return res.status(409).json({
        success: false,
        message: 'Hospital with this custom ID already exists',
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new hospital
    const hospital = await Hospital.createHospital({
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
      password: hashedPassword,
      departments: departments || null,
      bed_count: bed_count || null,
      icu_available: icu_available || false,
      emergency_services: emergency_services || false,
      created_by: 'system',
      updated_by: 'system'
    });

    // Generate JWT token
    const token = jwt.sign(
      {
        hospital_id: hospital.hospital_id,
        custom_hospital_id: hospital.custom_hospital_id,
        hospital_name: hospital.hospital_name,
        admin_mobile_number: hospital.admin_mobile_number,
        role: 'hospital'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set token in httpOnly cookie
    res.cookie('hospitalAuthToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(201).json({
      success: true,
      message: 'Hospital registered successfully',
      data: {
        hospital_id: hospital.hospital_id,
        custom_hospital_id: hospital.custom_hospital_id,
        hospital_name: hospital.hospital_name,
        admin_name: hospital.admin_name,
        admin_mobile_number: hospital.admin_mobile_number,
        email: hospital.email
      },
      token: token
    });
  } catch (err) {
    console.error('Error during hospital registration:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to register hospital',
      error: err.message,
    });
  }
};

// Login hospital by mobile number
const loginHospital = async (req, res) => {
  const { admin_mobile_number, password } = req.body;

  // Validate required fields
  if (!admin_mobile_number || !password) {
    return res.status(400).json({
      success: false,
      message: 'Mobile number and password are required',
    });
  }

  try {
    // Find hospital by mobile number
    const hospital = await Hospital.getHospitalByMobileNumber(admin_mobile_number);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, hospital.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        hospital_id: hospital.hospital_id,
        custom_hospital_id: hospital.custom_hospital_id,
        hospital_name: hospital.hospital_name,
        admin_mobile_number: hospital.admin_mobile_number,
        role: 'hospital'
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Set token in httpOnly cookie
    res.cookie('hospitalAuthToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        hospital_id: hospital.hospital_id,
        custom_hospital_id: hospital.custom_hospital_id,
        hospital_name: hospital.hospital_name,
        admin_name: hospital.admin_name,
        admin_mobile_number: hospital.admin_mobile_number,
        email: hospital.email
      },
      token: token
    });
  } catch (err) {
    console.error('Error during hospital login:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to login hospital',
      error: err.message,
    });
  }
};

// Get hospital dashboard/profile
const getHospitalDashboard = async (req, res) => {
  try {
    const { hospital_id } = req.user;
    
    const hospital = await Hospital.getHospitalById(hospital_id);
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found',
      });
    }

    res.status(200).json({
      success: true,
      data: {
        hospital_id: hospital.hospital_id,
        custom_hospital_id: hospital.custom_hospital_id,
        hospital_name: hospital.hospital_name,
        hospital_type: hospital.hospital_type,
        address: hospital.address,
        pincode: hospital.pincode,
        city: hospital.city,
        state: hospital.state,
        country: hospital.country,
        admin_name: hospital.admin_name,
        admin_mobile_number: hospital.admin_mobile_number,
        email: hospital.email,
        departments: hospital.departments,
        bed_count: hospital.bed_count,
        icu_available: hospital.icu_available,
        emergency_services: hospital.emergency_services,
        created_at: hospital.created_at,
        updated_at: hospital.updated_at
      }
    });
  } catch (err) {
    console.error('Error fetching hospital dashboard:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch hospital dashboard',
      error: err.message,
    });
  }
};

// Logout hospital
const logoutHospital = async (req, res) => {
  try {
    res.clearCookie('hospitalAuthToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (err) {
    console.error('Error during hospital logout:', err);
    return res.status(500).json({
      success: false,
      message: 'Failed to logout',
      error: err.message,
    });
  }
};

// Exporting the controller functions
module.exports = {
  registerHospital,
  loginHospital,
  getHospitalDashboard,
  logoutHospital
};