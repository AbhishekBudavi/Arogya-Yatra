'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SelectPatientComponent() {
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!phone || phone.length !== 10) {
      setError('Invalid or missing phone number.');
      setLoading(false);
      return;
    }

    const fetchPatients = async () => {
      try {
        const res = await fetch(`/api/patients?phone=${phone}`);
        if (!res.ok) throw new Error('Failed to fetch patients');

        const data = await res.json();
        if (data.length === 0) {
          setError('No accounts found with this number.');
        } else {
          setPatients(data);
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [phone]);

  const handleSelect = (id) => {
    router.push(`/patient/dashboard?id=${id}`);
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="bg-white rounded-2xl shadow-md p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-center mb-4 text-gray-800">
          Select Your Account
        </h2>

        {loading ? (
          <div className="text-center text-gray-500">Loading patient records...</div>
        ) : error ? (
          <div className="text-center text-red-500 font-medium">{error}</div>
        ) : (
          <ul className="space-y-4">
            {patients.map((p) => (
              <li
                key={p.id}
                className="p-4 bg-gray-100 rounded-lg hover:bg-blue-50 cursor-pointer transition"
                onClick={() => handleSelect(p.id)}
              >
                <p className="font-medium text-gray-800">{p.name}</p>
                <p className="text-sm text-gray-500">DOB: {p.dob}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
