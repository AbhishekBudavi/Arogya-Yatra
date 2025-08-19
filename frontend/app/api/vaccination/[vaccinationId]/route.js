// app/api/vaccination/[vaccinationId]/route.js

const VaccinationData = [
  {
    id: 'VCX-10001',
    title: 'Blood Test - July 2025',
    doctorName: 'Dr. Ramesh Kumar',
    status: 'Verified',
    date: '2025-07-07',
    aiSummary: 'This is a sample summary...',
    fileSize: '2.4 MB',
  },
  {
    id: 'VCX-10002',
    title: 'Urine Test - July 2025',
    doctorName: 'Dr. Neha Sharma',
    status: 'Pending Review',
    date: '2025-07-06',
    aiSummary: 'Urine is normal...',
    fileSize: '1.1 MB',
  },
];

export async function GET(req, { params }) {
  const { vaccinationId } = params;
  const record = VaccinationData.find((item) => item.id === vaccinationId);

  if (!record) {
    return new Response(JSON.stringify({ error: 'Not Found' }), { status: 404 });
  }

  return new Response(JSON.stringify(record), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
