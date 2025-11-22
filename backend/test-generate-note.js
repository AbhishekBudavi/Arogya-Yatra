/**
 * Test script to diagnose the clinical note generation issue
 */

const axios = require("axios");
const jwt = require("jsonwebtoken");

const BACKEND_URL = "http://localhost:5000";
const JWT_SECRET = "53919b18e772b50b2ddece706a582ed8f4f64447550c99f848f5ac21991c18bb";

// Generate a test JWT token for a doctor
const generateDoctorToken = () => {
  const payload = {
    doctor_id: "DC006",
    role: "doctor",
    email: "doctor@test.com",
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "24h" });
};

const testGenerateNote = async () => {
  try {
    const token = generateDoctorToken();

    console.log("🔍 Testing clinical note generation endpoint...\n");
    console.log(`📍 URL: ${BACKEND_URL}/api/doctor-notes/generate`);
    console.log(`🔐 Token: ${token.substring(0, 20)}...\n`);

    const requestBody = {
      doctor_id: "DC006",
      patient_id: 6,  // Sending as number to test the fix
      raw_input:
        "62-year-old female presenting with persistent cough for 3 weeks, low-grade fever, weight loss. Chest X-ray shows infiltrates in left lower lobe. History of TB contact. O2 sat 94%. Referred for TB screening.",
      current_symptoms:
        "Chronic cough with minimal sputum, fatigue, night sweats",
      additional_notes: "Patient is a healthcare worker. Lives with family.",
    };

    console.log("📤 Request Body:");
    console.log(JSON.stringify(requestBody, null, 2));
    console.log("\n⏳ Sending request...\n");

    const response = await axios.post(
      `${BACKEND_URL}/api/doctor-notes/generate`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 120000, // 2 minute timeout for Ollama processing
      }
    );

    console.log("✅ Response received:");
    console.log(JSON.stringify(response.data, null, 2));

    if (response.data.success) {
      console.log("\n✅ SUCCESS! Clinical note generated.");
      if (response.data.note) {
        console.log("\n📋 Generated Note Details:");
        console.log(`- ID: ${response.data.note.id}`);
        console.log(`- Status: ${response.data.note.status}`);
        console.log(
          `- Presenting Complaints: ${response.data.note.presenting_complaints}`
        );
        console.log(
          `- Assessment: ${response.data.note.assessment_impression.substring(0, 100)}...`
        );
      }
    } else {
      console.log("\n⚠️ Response indicates failure:", response.data);
    }
  } catch (err) {
    console.error("\n❌ Error:", err.message);
    if (err.response) {
      console.error("\n📋 Response Status:", err.response.status);
      console.error("📋 Response Data:", JSON.stringify(err.response.data, null, 2));
    }
    process.exit(1);
  }
};

testGenerateNote();
