'use client';

export default function PatientLoginPage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Doctor Login</h1>
      <form className="space-y-4">
        <input type="text" placeholder="Doctor ID" className="border p-2 w-full" />
        <input type="password" placeholder="Password" className="border p-2 w-full" />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Login</button>
      </form>
    </div>
  );
}
