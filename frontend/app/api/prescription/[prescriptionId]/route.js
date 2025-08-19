const PrescriptionData = [
  {
    id: 'MED-10001',
    title: 'Iron Supplement Prescription',
    type: 'Medication',
    date: '2025-07-07',
    uploadedBy: 'Doctor',
    doctorName: 'Dr. Ramesh Kumar',
    notes: 'For mild anemia detected in last blood test',
    status: 'Active',
    lastUpdated: '2025-07-08 14:30',
    medicines: [
      {
        name: 'Ferrous Sulfate 325mg',
        dosage: '1 tablet twice a day',
        duration: '3 months',
        instructions: 'Take after meals with water. Avoid tea/coffee for 1 hour after taking.',
      },
      {
        name: 'Vitamin C 500mg',
        dosage: '1 tablet once daily',
        duration: '3 months',
        instructions: 'Take in the morning to improve iron absorption.',
      },
    ],
    aiSummary:
      'Prescribed iron supplements and vitamin C to address mild anemia. Regular follow-up recommended in 3 months to assess hemoglobin levels.',
  },
  {
    id: 'MED-10002',
    title: 'Hydration & Urinary Health Prescription',
    type: 'Medication',
    date: '2025-07-06',
    uploadedBy: 'Doctor',
    doctorName: 'Dr. Neha Sharma',
    notes: 'Follow-up after normal urine test results',
    status: 'Completed',
    lastUpdated: '2025-07-06 11:00',
    medicines: [
      {
        name: 'ORS Solution',
        dosage: 'As needed',
        duration: '1 week',
        instructions: 'Mix in clean water and sip slowly when feeling dehydrated.',
      },
      {
        name: 'Cranberry Extract Capsules',
        dosage: '1 capsule daily',
        duration: '1 month',
        instructions: 'Take with breakfast to maintain urinary tract health.',
      },
    ],
    aiSummary:
      'No infection detected. Suggested hydration with ORS for occasional dehydration and cranberry supplements for urinary tract health.',
  },
];

export async function GET(req, { params }) {
  const { prescriptionId } = params;

  const prescription = PrescriptionData.find(
    (p) => p.id === prescriptionId
  );

  if (!prescription) {
    return new Response(JSON.stringify({ error: 'Prescription not found' }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(prescription), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
