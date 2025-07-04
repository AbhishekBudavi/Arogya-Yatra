// app/api/patients/route.js

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get('phone');

  if (!phone || phone.length !== 10) {
    return new Response(
      JSON.stringify({ error: 'Invalid phone number' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // TODO: Replace this with real DB fetch based on phone
  const allPatients = [
    { id: '1', name: 'John Doe', dob: '1990-01-01', phone: '9876543210' },
    { id: '2', name: 'John Doe', dob: '1992-05-20', phone: '9876543210' },
    { id: '3', name: 'Jane Doe', dob: '1985-03-15', phone: '9999999999' },
  ];

  const matched = allPatients.filter(p => p.phone === phone);

  return new Response(
    JSON.stringify(matched),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
