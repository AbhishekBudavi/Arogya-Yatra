const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { createDoctor, findDoctorById } = require("../models/doctor.model");
// Register a new patient
const registerDoctor = async (req, res) => {
  try {
    const {
      doctor_id,
      doctor_name,
      password,
      about_me,
      created_by,
      updated_by,
    } = req.body;

    // check if doctor already exists
    const existing = await findDoctorById(doctor_id);
    if (existing)
      return res.status(400).json({ message: "Doctor ID already exists" });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const doctor = await createDoctor({
      doctor_id,
      doctor_name,
      password: hashedPassword,
      about_me,
      created_by,
      updated_by,
    });

    res.status(201).json({ message: "Doctor registered successfully", doctor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to register doctor" });
  }
};
// Login patient by mobile number

const loginDoctor = async (req, res) => {
  try {
    const { doctor_id, password } = req.body;
    console.log(`Docotr Id: ${doctor_id}`);
    if (!doctor_id || !password)
      return res.status(400).json({ message: "Doctor ID and password required" });

    const doctor = await findDoctorById(doctor_id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    const isPasswordValid = await bcrypt.compare(password, doctor.password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        doctor_id: doctor.doctor_id,
        doctor_name: doctor.doctor_name,
        role: "doctor",
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    // Clear any patient temp token
  // Do not clear the patient's cookie here. Allow both doctor and patient
  // cookies to coexist so the frontend can handle role switching.

    // Set doctor auth cookie using the same naming and options as patient flow
    // Middleware expects `doctorAuthToken` and cross-site cookies need sameSite='none' in production.
    res.cookie("doctorAuthToken", token, {
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login successful",
      doctor: {
        doctor_id: doctor.doctor_id,
        doctor_name: doctor.doctor_name,
      },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getDoctorDashboard = async (req, res) => {
  try {
    const { doctor_id } = req.user;
    console.log("Doctor Id:", doctor_id);

    const doctor = await findDoctorById(doctor_id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    return res.status(200).json({
      doctor,
      message: "Dashboard data retrieved successfully",
    });
  } catch (err) {
    console.error("Error in getDoctorDashboard:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Exporting the controller functions
module.exports = {
  registerDoctor,
  loginDoctor,
  getDoctorDashboard
};
