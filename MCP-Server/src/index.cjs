const { MCPServer } = require('@modelcontextprotocol/sdk/server');
const dotenv = require('dotenv');
const { Pool } = require('pg');
const axios = require('axios');
const { z } = require('zod');

// Load environment variables
dotenv.config();

// Initialize MCP Server
const server = new MCPServer();

// Register tools
server.registerTool({
  name: 'getLabReports',
  description: 'Get lab reports for a patient',
  parameters: {
    type: 'object',
    properties: {
      patientId: { type: 'string', format: 'uuid' }
    },
    required: ['patientId']
  },
  async execute({ patientId }) {
    try {
      const response = await axios.get(`${process.env.BACKEND_BASE_URL}/api/labreports/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${process.env.JWT_SECRET}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching lab reports:', error);
      throw new Error('Failed to fetch lab reports');
    }
  }
});

// Start the server
async function startServer() {
  try {
    await server.start();
    console.log(`🚀 MCP Server is running on port ${process.env.PORT || 5000}`);
  } catch (error) {
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  }
}

startServer();