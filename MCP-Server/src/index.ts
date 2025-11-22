import 'dotenv/config';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import pkg from "pg";
import express, { Request, Response } from "express";
import cors from "cors";

const { Pool } = pkg;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🧩 PostgreSQL Setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log("✅ PostgreSQL Connected Successfully"))
  .catch(err => console.error("❌ PostgreSQL Connection Failed:", err.message));

// 🧰 Backend Config
const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;
const BACKEND_API_KEY = process.env.BACKEND_API_KEY;
const OLLAMA_API_URL = process.env.OLLAMA_API_URL || "http://localhost:11434";
const OLLAMA_MODEL = process.env.OLLAMA_MODEL || "llama2";

// 🚀 MCP Server Initialization
const server = new McpServer({
  name: "Arogyayatra-MCP-Server",
  version: "1.0.0",
});

// 🧠 Register Tools

server.registerTool(
  "getLabReports",
  {
    title: "Get Lab Reports",
    description: "Fetch lab reports for a patient from backend.",
    inputSchema: { patientId: z.string() },
  },
  async ({ input }) => {
    const res = await axios.get(`${BACKEND_BASE_URL}/labreports/${input.patientId}`, {
      headers: { "x-api-key": BACKEND_API_KEY },
    });
    return { content: [{ type: "text", text: JSON.stringify(res.data) }] };
  }
);

server.registerTool(
  "getPrescriptions",
  {
    title: "Get Prescriptions",
    description: "Fetch prescriptions for a patient.",
    inputSchema: { patientId: z.string() },
  },
  async ({ input }) => {
    const res = await axios.get(`${BACKEND_BASE_URL}/prescriptions/${input.patientId}`, {
      headers: { "x-api-key": BACKEND_API_KEY },
    });
    return { content: [{ type: "text", text: JSON.stringify(res.data) }] };
  }
);

server.registerTool(
  "getMedicalHistory",
  {
    title: "Get Medical History",
    description: "Fetch medical history for a patient.",
    inputSchema: { patientId: z.string() },
  },
  async ({ input }) => {
    const res = await axios.get(`${BACKEND_BASE_URL}/medicalhistory/${input.patientId}`, {
      headers: { "x-api-key": BACKEND_API_KEY },
    });
    return { content: [{ type: "text", text: JSON.stringify(res.data) }] };
  }
);

server.registerTool(
  "getVaccinationRecords",
  {
    title: "Get Vaccination Records",
    description: "Fetch vaccination records for a patient.",
    inputSchema: { patientId: z.string() },
  },
  async ({ input }) => {
    const res = await axios.get(`${BACKEND_BASE_URL}/vaccinations/${input.patientId}`, {
      headers: { "x-api-key": BACKEND_API_KEY },
    });
    return { content: [{ type: "text", text: JSON.stringify(res.data) }] };
  }
);

/**
 * 🔹 Clinical Note Generation Tool
 * Transforms doctor keywords into a structured, professionally formatted medical note
 */
server.registerTool(
  "generateClinicalNote",
  {
    title: "Generate Structured Clinical Note",
    description: "Transform doctor keywords, lab reports, and medical history into a professional clinical note with structured sections",
    inputSchema: {
      doctor_keywords: z.string().describe("Short keywords or notes from the doctor"),
      medical_history: z.string().optional().describe("Patient medical history JSON string"),
      lab_reports: z.string().optional().describe("Patient lab reports JSON string"),
      current_symptoms: z.string().optional().describe("Current symptoms reported by patient"),
      additional_notes: z.string().optional().describe("Any additional clinical observations"),
    },
  },
  async ({ input }) => {
    try {
      const {
        doctor_keywords,
        medical_history,
        lab_reports,
        current_symptoms,
        additional_notes,
      } = input;

      // Build comprehensive clinical context
      const clinicalContext = buildClinicalContext({
        doctor_keywords,
        medical_history,
        lab_reports,
        current_symptoms,
        additional_notes,
      });

      // Call Ollama to generate structured note
      const prompt = buildPromptForClinicialNote(clinicalContext);
      const generatedContent = await callOllama(prompt);

      // Parse and structure the response
      const structuredOutput = parseStructuredNote(generatedContent);

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              structured_output: structuredOutput,
              raw_response: generatedContent,
            }),
          },
        ],
      };
    } catch (err) {
      console.error("Error in generateClinicalNote:", err);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: false,
              error: err.message,
            }),
          },
        ],
      };
    }
  }
);

/**
 * Build comprehensive clinical context from available data
 */
function buildClinicalContext(data: any) {
  const {
    doctor_keywords,
    medical_history,
    lab_reports,
    current_symptoms,
    additional_notes,
  } = data;

  let context = `DOCTOR'S KEYWORDS/NOTES:\n${doctor_keywords}\n\n`;

  if (current_symptoms) {
    context += `CURRENT SYMPTOMS:\n${current_symptoms}\n\n`;
  }

  if (medical_history) {
    try {
      const history = JSON.parse(medical_history);
      context += `MEDICAL HISTORY:\n`;
      context += `- Chronic Conditions: ${history.chronicconditions || "None reported"}\n`;
      context += `- Past Surgeries: ${history.pastsurgeries || "None reported"}\n`;
      context += `- Current Medications: ${history.currentmedications || "None reported"}\n`;
      context += `- Blood Pressure: ${history.bloodpressure || "Not recorded"}\n`;
      context += `- Blood Sugar: ${history.fastingbloodsugar || "Not recorded"}\n`;
      context += `- Family History: ${history.familychronichistory || "Unremarkable"}\n\n`;
    } catch (e) {
      context += `MEDICAL HISTORY:\n${medical_history}\n\n`;
    }
  }

  if (lab_reports) {
    try {
      const reports = JSON.parse(lab_reports);
      context += `LAB REPORTS:\n`;
      if (Array.isArray(reports)) {
        reports.forEach((report: any, idx: number) => {
          context += `Report ${idx + 1}: ${report.test_name || report.name || "Test"} - ${
            report.result || "Result not specified"
          }\n`;
        });
      } else {
        context += JSON.stringify(reports) + "\n";
      }
      context += "\n";
    } catch (e) {
      context += `LAB REPORTS:\n${lab_reports}\n\n`;
    }
  }

  if (additional_notes) {
    context += `ADDITIONAL NOTES:\n${additional_notes}\n`;
  }

  return context;
}

/**
 * Build prompt for Ollama model to generate clinical note
 */
function buildPromptForClinicialNote(clinicalContext: string): string {
  return `You are an expert medical documentation assistant. Your task is to transform doctor's keywords and clinical data into a professional, structured medical note.

CLINICAL DATA:
${clinicalContext}

INSTRUCTIONS:
1. Expand the doctor's keywords into clear, detailed medical sentences
2. Incorporate relevant details from lab reports and medical history
3. Use professional medical terminology while maintaining clarity
4. Ensure accuracy - do not hallucinate clinical findings
5. Follow a structured format with clear sections

REQUIRED OUTPUT FORMAT (JSON):
{
  "presenting_complaints": "Clear description of main presenting complaint(s)",
  "clinical_interpretation": "Detailed medical explanation of the doctor's observations and findings",
  "relevant_medical_history": "Pertinent past medical history, surgeries, and chronic conditions relevant to current presentation",
  "lab_report_summary": "Summary of relevant lab findings with values and clinical significance",
  "assessment_impression": "Clinical impression and assessment of the current condition",
  "full_structured_note": "Complete professional medical note combining all sections in narrative format"
}

Generate only valid JSON output with no additional text or markdown.`;
}

/**
 * Call Ollama API to generate con/Write tent
 */
async function callOllama(prompt: string): Promise<string> {
  try {
    const response = await axios.post(
      `${OLLAMA_API_URL}/api/generate`,
      {
        model: OLLAMA_MODEL,
        prompt: prompt,
        stream: false,
        temperature: 0.3, // Lower temperature for more consistent clinical output
      },
      {
        timeout: 30000,
      }
    );

    return response.data.response || "";
  } catch (err: any) {
    console.error("Ollama API error:", err.message);
    throw new Error(`Failed to generate clinical note: ${err.message}`);
  }
}

/**
 * Parse and structure Ollama response
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

// ✅ HTTP Endpoint for Backend Integration
app.post("/api/generate-clinical-note", async (req: Request, res: Response) => {
  try {
    const {
      doctor_keywords,
      medical_history,
      lab_reports,
      current_symptoms,
      additional_notes,
    } = req.body;

    if (!doctor_keywords) {
      return res.status(400).json({
        error: "Missing required field: doctor_keywords",
      });
    }

    // Build comprehensive clinical context
    const clinicalContext = buildClinicalContext({
      doctor_keywords,
      medical_history,
      lab_reports,
      current_symptoms,
      additional_notes,
    });

    // Call Ollama to generate structured note
    const prompt = buildPromptForClinicialNote(clinicalContext);
    const generatedContent = await callOllama(prompt);

    // Parse and structure the response
    const structuredOutput = parseStructuredNote(generatedContent);

    return res.status(200).json({
      success: true,
      structured_output: structuredOutput,
      raw_response: generatedContent,
    });
  } catch (err: any) {
    console.error("Error in /api/generate-clinical-note:", err);
    return res.status(500).json({
      success: false,
      error: "Failed to generate clinical note",
      details: err.message || "Unknown error",
    });
  }
});

// ✅ Health check endpoint
app.get("/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "MCP Server HTTP Bridge is running",
    timestamp: new Date().toISOString(),
  });
});

// ✅ Main MCP Connection and Express Server
function main() {
  // Start Express server immediately (non-blocking)
  const HTTP_PORT = parseInt(process.env.MCP_HTTP_PORT || "3001", 10);
  app.listen(HTTP_PORT, "0.0.0.0", () => {
    console.log(`🌐 HTTP Bridge running on http://localhost:${HTTP_PORT}`);
  });

  // Start MCP server on stdio (background)
  setImmediate(() => {
    const transport = new StdioServerTransport();
    server.connect(transport).then(() => {
      console.log("🚀 MCP Server is running and connected via stdio");
    }).catch((err) => {
      console.error("MCP connection error:", err);
    });
  });
}

main();
