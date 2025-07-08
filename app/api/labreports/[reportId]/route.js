// app/api/labreports/[reportId]/route.js

const ReportData = [
  {
    id: 'RPT-00891',
    title: 'Blood Test - July 2025',
    type: 'Blood Test',
    date: '2025-07-07',
    uploadedBy: 'Patient',
    doctorName: 'Dr. Ramesh Kumar',
    notes: 'Routine blood test check-up',
    status: 'Verified',
    lastUpdated: '2025-07-08 14:30',
    fileName: 'blood-test-report.pdf',
    fileSize: '2.4 MB',
    aiSummary:
      'Hemoglobin is slightly below normal (11.2 g/dL) suggesting mild anemia. All other parameters including glucose (89 mg/dL), cholesterol (195 mg/dL), and liver function markers are within normal range. Recommendation: Include iron-rich foods in diet and follow up in 3 months.',
  },
  {
    id: 'RPT-00892',
    title: 'Urine Test - July 2025',
    type: 'Urine Test',
    date: '2025-07-06',
    uploadedBy: 'Doctor',
    doctorName: 'Dr. Neha Sharma',
    notes: 'Follow-up after medication',
    status: 'Pending Review',
    lastUpdated: '2025-07-06 11:00',
    fileName: 'urine-test-report.pdf',
    fileSize: '1.1 MB',
    aiSummary:
      'Urine analysis appears within normal range. No signs of infection. Recommend hydration and re-check in 6 months.',
  },
];

export async function GET(req, { params }) {
  const { reportId } = params;

  // Find the report with the matching ID from the mock data
  const report = ReportData.find((r) => r.id === reportId);

  if (!report) {
    return new Response(JSON.stringify({ error: 'Report not found' }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(report), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
