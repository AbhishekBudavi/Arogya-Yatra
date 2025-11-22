const jwt = require("jsonwebtoken");
const { findDoctorById, findDoctorByLicenseId } = require("../models/doctor.model");

const loginDoctor = async (req, res) => {
  try {
    const { license_id } = req.body;
    console.log(`Doctor Login Attempt: ${license_id}`);

    // Validate required fields
    if (!license_id) {
      return res.status(400).json({
        success: false,
        message: "License ID is required",
      });
    }

    // Find doctor by license ID
    const doctor = await findDoctorByLicenseId(license_id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found with this license ID",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        doctor_id: doctor.doctor_id,
        doctor_name: doctor.doctor_name,
        license_id: doctor.license_id,
        specialization: doctor.specialization,
        role: "doctor",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set doctor auth cookie
    res.cookie("doctorAuthToken", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        doctor_id: doctor.doctor_id,
        doctor_name: doctor.doctor_name,
        license_id: doctor.license_id,
        specialization: doctor.specialization,
        email: doctor.email,
        phone: doctor.phone,
      },
      token: token,
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: err.message,
    });
  }
};

const getDoctorDashboard = async (req, res) => {
  try {
    const { doctor_id } = req.user;
    console.log("Doctor Id:", doctor_id);

    const doctor = await findDoctorById(doctor_id);
    if (!doctor) {
      return res.status(404).json({
        success: false,
        error: "Doctor not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Dashboard data retrieved successfully",
      data: {
        doctor_id: doctor.doctor_id,
        doctor_name: doctor.doctor_name,
        specialization: doctor.specialization,
        email: doctor.email,
        phone: doctor.phone,
        license_id: doctor.license_id,
        hospital_id: doctor.hospital_id,
        created_at: doctor.created_at,
      },
    });
  } catch (err) {
    console.error("Error in getDoctorDashboard:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Exporting the controller functions
module.exports = {
  loginDoctor,
  getDoctorDashboard,
};
