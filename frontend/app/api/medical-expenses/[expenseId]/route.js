const mockData = [
  { id: "EXP-2024-001", patient: { fullName: "John" }, totalAmount: 1234 }
];

export async function GET(req, { params }) {
  const { expenseId } = params;

  const data = mockData.find((e) => e.id === expenseId);

  if (!data) {
    return new Response(JSON.stringify({ error: 'Expense not found' }), {
      status: 404,
    });
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
