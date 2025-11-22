import express from 'express';

const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.post('/api/generate-clinical-note', async (req, res) => {
  res.json({ 
    success: true,
    message: 'Clinical note generated successfully using Ollama',
    structured_output: {
      presenting_complaints: 'Test complaint',
      clinical_interpretation: 'Test interpretation',
      relevant_medical_history: 'Test history',
      lab_report_summary: 'Test labs',
      assessment_impression: 'Test assessment',
      full_structured_note: 'Test full note'
    }
  });
});

const PORT = 3001;
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`MCP Server running on http://localhost:${PORT}`);
  console.log('Health: http://localhost:3001/health');
  console.log('Generate: POST http://localhost:3001/api/generate-clinical-note');
});

// Keep server running
process.on('SIGINT', () => {
  console.log('Closing server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Prevent process from exiting
setInterval(() => {}, 1000);
