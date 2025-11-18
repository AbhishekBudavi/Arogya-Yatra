import 'dotenv/config';
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import axios from "axios";
import pkg from "pg";

const { Pool } = pkg;

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

// ✅ Main MCP Connection
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("🚀 MCP Server is running and connected via stdio");
}

main().catch((err) => {
  console.error("Fatal error in main():", err);
  process.exit(1);
});
