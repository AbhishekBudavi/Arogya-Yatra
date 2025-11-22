import 'dotenv/config';
import express, { Request, Response } from "express";
import cors from "cors";
import axios from "axios";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🧰 Config
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama2";
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL || "http://localhost:5000";

/**
 * Build comprehensive clinical context from available data
 * Structures all medical information into a organized context
 */
function buildClinicalContext(data: any) {
  const {
    doctor_keywords,
    medical_history,
    lab_reports,
    current_symptoms,
    additional_notes,
  } = data;

  let context = `DOCTOR'S CLINICAL OBSERVATIONS AND KEYWORDS:\n${doctor_keywords}\n\n`;

  if (current_symptoms) {
    context += `CURRENT SYMPTOMS REPORTED:\n${current_symptoms}\n\n`;
  }

  if (medical_history) {
    try {
      const history = typeof medical_history === 'string' ? JSON.parse(medical_history) : medical_history;
      context += `RELEVANT MEDICAL HISTORY:\n`;
      context += `- Chronic Conditions: ${history.chronicconditions || "None reported"}\n`;
      context += `- Past Surgeries: ${history.pastsurgeries || "None reported"}\n`;
      context += `- Past Illnesses: ${history.pastillnesses || "None reported"}\n`;
      context += `- Current Medications: ${history.currentmedications || "None reported"}\n`;
      context += `- Blood Pressure: ${history.bloodpressure || "Not recorded"}\n`;
      context += `- Fasting Blood Sugar: ${history.fastingbloodsugar || "Not recorded"}\n`;
      context += `- Post-prandial Blood Sugar: ${history.postprandialbloodsugar || "Not recorded"}\n`;
      context += `- Blood Group: ${history.bloodgroup || "Unknown"}\n`;
      context += `- Family Chronic History: ${history.familychronichistory || "Unremarkable"}\n`;
      context += `- Nutritional Deficiency: ${history.nutritionaldeficiency || "None"}\n`;
      context += `- Smoking Status: ${history.smoking || "Not recorded"}\n`;
      context += `- Alcohol Consumption: ${history.alcoholconsumption || "Not recorded"}\n\n`;
    } catch (e) {
      context += `RELEVANT MEDICAL HISTORY:\n${medical_history}\n\n`;
    }
  }

  if (lab_reports) {
    try {
      const reports = typeof lab_reports === 'string' ? JSON.parse(lab_reports) : lab_reports;
      context += `LABORATORY REPORTS AND TEST RESULTS:\n`;
      if (Array.isArray(reports)) {
        reports.forEach((report: any, idx: number) => {
          context += `Report ${idx + 1}: ${report.document_name || report.test_name || report.name || 'Lab Report'}\n`;
          if (report.metadata) {
            context += `  Details: ${typeof report.metadata === 'string' ? report.metadata : JSON.stringify(report.metadata)}\n`;
          }
        });
      } else {
        context += JSON.stringify(reports, null, 2) + "\n";
      }
      context += "\n";
    } catch (e) {
      context += `LABORATORY REPORTS:\n${lab_reports}\n\n`;
    }
  }

  if (additional_notes) {
    context += `ADDITIONAL CLINICAL NOTES AND PATIENT INFORMATION:\n${additional_notes}\n`;
  }

  return context;
}

/**
 * Build a medically-accurate prompt for Ollama
 * Instructs the model to use proper medical terminology and structure
 */
function buildPromptForClinicialNote(clinicalContext: string): string {
  return `You are an expert medical documentation specialist with extensive knowledge of clinical terminology, medical abbreviations, and healthcare standards. Your task is to transform doctor's clinical observations into a professionally formatted medical note using proper medical terminology and clinical documentation standards.

CLINICAL DATA PROVIDED:
${clinicalContext}

CRITICAL INSTRUCTIONS FOR NOTE GENERATION:
1. Use ONLY established medical terminology and clinical abbreviations (e.g., HTN for Hypertension, DM for Diabetes Mellitus, etc.)
2. Ensure accuracy - do NOT fabricate or hallucinate clinical findings
3. Base all interpretations strictly on the clinical data provided
4. Use proper medical terminology from standard medical dictionaries (MeSH, ICD-10, SNOMED CT)
5. Follow standard SOAP note format (Subjective, Objective, Assessment, Plan) where applicable
6. Maintain clinical accuracy and professional medical writing standards
7. Avoid colloquialisms and patient-friendly language in medical sections
8. Only include findings and observations that are clinically relevant and documented

OUTPUT FORMAT - Return ONLY valid JSON with these exact fields:
{
  "presenting_complaints": "Clear, medically-worded description of chief complaint(s) using proper terminology",
  "clinical_interpretation": "Detailed medical analysis and interpretation of findings using appropriate medical terminology",
  "relevant_medical_history": "Chronological summary of pertinent positive and negative medical history relevant to presentation",
  "lab_report_summary": "Clinical significance of abnormal findings with reference ranges where applicable",
  "assessment_impression": "Clinical assessment and differential diagnosis impressions",
  "full_structured_note": "Complete professional medical note in narrative format combining all sections"
}

Return ONLY the JSON object with no additional text, markdown, or code blocks. Ensure all medical terminology is accurate and clinically appropriate.`;
}

/**
 * Call Ollama API to generate clinical note
 * Handles timeouts and connection errors gracefully
 */
async function callOllama(prompt: string): Promise<string> {
  try {
    console.log("📤 Initiating Ollama API call...");
    console.log(`   Model: ${OLLAMA_MODEL}`);
    console.log(`   URL: ${OLLAMA_API_URL}/api/generate`);
    
    const response = await axios.post(
      `${OLLAMA_API_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        temperature: 0.2, // Low temperature for consistent medical output
        top_p: 0.9, // Nucleus sampling for quality
      },
      {
        timeout: 300000, // 5 minutes timeout
      }
    );

    console.log("✅ Ollama response received successfully");
    return response.data.response || "";
  } catch (err: any) {
    console.error("❌ Ollama API error:", err.message);
    
    if (err.code === "ECONNREFUSED") {
      throw new Error(
        `Ollama service is not running. Start it with: ollama serve`
      );
    } else if (err.message.includes("timeout")) {
      throw new Error(
        `Ollama request timed out after 5 minutes. Try a simpler prompt or check Ollama performance.`
      );
    }
    
    throw new Error(`Failed to generate clinical note: ${err.message}`);
  }
}

/**
 * Parse and structure Ollama response
 * Attempts to extract JSON and gracefully handles parsing errors
 */
function parseStructuredNote(response: string): any {
  try {
    // Try to extract JSON from response
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        presenting_complaints: parsed.presenting_complaints || "",
        clinical_interpretation: parsed.clinical_interpretation || "",
        relevant_medical_history: parsed.relevant_medical_history || "",
        lab_report_summary: parsed.lab_report_summary || "",
        assessment_impression: parsed.assessment_impression || "",
        full_structured_note: parsed.full_structured_note || "",
      };
    }

    // Fallback: Return structured response from raw text
    return {
      presenting_complaints: extractSection(response, "presenting_complaints"),
      clinical_interpretation: extractSection(response, "clinical_interpretation"),
      relevant_medical_history: extractSection(response, "relevant_medical_history"),
      lab_report_summary: extractSection(response, "lab_report_summary"),
      assessment_impression: extractSection(response, "assessment_impression"),
      full_structured_note: response,
    };
  } catch (err) {
    console.error("Error parsing clinical note:", err);
    return {
      presenting_complaints: "",
      clinical_interpretation: "",
      relevant_medical_history: "",
      lab_report_summary: "",
      assessment_impression: "",
      full_structured_note: response,
    };
  }
}

/**
 * Extract specific section from response
 */
function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}[:\s]+([^\n]*(?:\n(?!\\w+:)[^\n]*)*)`, "i");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

// ✅ Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "MCP Server HTTP Bridge is running",
    timestamp: new Date().toISOString(),
    ollama: {
      url: OLLAMA_API_URL,
      model: OLLAMA_MODEL,
    },
  });
});

// ✅ HTTP Endpoint for Backend Integration
/**
 * POST /api/generate-clinical-note
 * 
 * Accepts doctor's keywords and patient clinical data
 * Returns structured medical note with proper terminology
 * 
 * Request body:
 * {
 *   "doctor_keywords": "string (required) - doctor's observations",
 *   "medical_history": "string (optional) - JSON serialized medical history",
 *   "lab_reports": "string (optional) - JSON serialized lab reports",
 *   "current_symptoms": "string (optional) - patient's reported symptoms",
 *   "additional_notes": "string (optional) - any additional clinical notes"
 * }
 */
app.post("/api/generate-clinical-note", async (req: Request, res: Response) => {
  try {
    console.log("\n📥 Received request to generate clinical note");
    const {
      doctor_keywords,
      medical_history,
      lab_reports,
      current_symptoms,
      additional_notes,
    } = req.body;

    if (!doctor_keywords) {
      console.error("❌ Missing doctor_keywords");
      return res.status(400).json({
        success: false,
        error: "Missing required field: doctor_keywords",
        details: "doctor_keywords must contain the doctor's clinical observations",
      });
    }

    console.log("🔧 Building clinical context...");
    // Build comprehensive clinical context
    const clinicalContext = buildClinicalContext({
      doctor_keywords,
      medical_history,
      lab_reports,
      current_symptoms,
      additional_notes,
    });

    console.log("📝 Building prompt for Ollama with medical terminology guidelines...");
    // Call Ollama to generate structured note
    const prompt = buildPromptForClinicialNote(clinicalContext);
    
    console.log("⏳ Waiting for Ollama to generate note (this may take 30-60 seconds)...");
    console.log("   Model is analyzing clinical data and generating medically accurate note...");
    const generatedContent = await callOllama(prompt);

    console.log("🔄 Parsing structured note...");
    // Parse and structure the response
    const structuredOutput = parseStructuredNote(generatedContent);

    console.log("✅ Clinical note generated successfully");
    return res.status(200).json({
      success: true,
      message: "Clinical note generated successfully using Ollama",
      structured_output: structuredOutput,
      raw_response: generatedContent,
      metadata: {
        model: OLLAMA_MODEL,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (err: any) {
    console.error("❌ Error in /api/generate-clinical-note:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to generate clinical note",
      details: err.message || "Unknown error",
      troubleshooting: {
        ensureOllamaRunning: "ollama serve",
        ensureModelPulled: `ollama pull ${OLLAMA_MODEL}`,
        checkUrl: OLLAMA_API_URL,
      },
    });
  }
});

// ✅ Start server
const HTTP_PORT = parseInt(process.env.MCP_HTTP_PORT || "3001", 10);
const server = app.listen(HTTP_PORT, "0.0.0.0", () => {
  console.log(`\n✅ MCP HTTP Bridge is running on http://localhost:${HTTP_PORT}`);
  console.log(`📍 Health check: http://localhost:${HTTP_PORT}/health`);
  console.log(`📍 Generate note: POST http://localhost:${HTTP_PORT}/api/generate-clinical-note`);
  console.log(`🧠 Ollama Model: ${OLLAMA_MODEL}`);
  console.log(`🔗 Ollama URL: ${OLLAMA_API_URL}`);
  console.log(`🚀 Ready to accept requests!\n`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⏹️ Shutting down MCP HTTP Bridge...');
  server.close(() => {
    console.log('✅ Server closed');
    process.exit(0);
  });
});

// Keep process alive
process.on('uncaughtException', (err) => {
  console.error('❌ Uncaught Exception:', err);
  process.exit(1);
});
