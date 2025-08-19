'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { User, Phone, Calendar, ChevronRight, Search, AlertCircle, Loader2 } from 'lucide-react';
import api from '../utils/api';

export default function SelectPatientComponent() {
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone');
  const router = useRouter();

  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Format date for display
  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

  // Select patient and redirect
  const handleSelectPatient = async (patient) => {
    try {
      setLoading(true);
      setError('');

      const { data } = await api.post('/patient/select-profile', {
        patient_id: patient.patient_id,
      });
       console.log(data);
      router.push(`/dashboard/patient`);
    } catch (err) {
      console.error('Select patient error:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch patients by phone
  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError('');

      const { data } = await api.get(`/patients?phone=${phone}`);

      console.log("get response",data);

      if (!Array.isArray(data) || data.length === 0) {
        setError('No accounts found with this number.');
      } else {
        setPatients(data);
      }
    } catch (err) {
      console.error('Error fetching patients:', err.response?.data || err.message);
      setError('Failed to fetch patients');
    } finally {
      setLoading(false);
    }
  }, [phone]);

  // Trigger fetch on mount
  useEffect(() => {
    if (!phone || phone.length !== 10) {
      setError('Invalid or missing phone number.');
      setLoading(false);
      return;
    }
    fetchPatients();
  }, [phone, fetchPatients]);

  // UI rendering
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8 mt-20">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Select Your Account</h1>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Phone className="w-4 h-4" />
            <span className="text-sm">Phone: {phone}</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Loading patient records...</p>
              <p className="text-sm text-gray-500 mt-1">Please wait while we fetch your accounts</p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-600 font-semibold mb-2">Account Not Found</p>
              <p className="text-gray-600 text-sm">{error}</p>
              <button
                onClick={() => router.back()}
                className="mt-4 px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition-colors duration-200"
              >
                Go Back
              </button>
            </div>
          ) : (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-6">
                <Search className="w-5 h-5 text-gray-500" />
                <span className="text-gray-700 font-medium">
                  Found {patients.length} account{patients.length !== 1 ? 's' : ''}
                </span>
              </div>

              <div className="space-y-3">
                {patients.map((patient, index) => (
                  <div
                    key={patient.patient_id}
                    className="group relative bg-gradient-to-r from-white to-gray-50 rounded-2xl p-5 border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    onClick={() => handleSelectPatient(patient)}
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center shadow-md">
                          <User className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 text-lg group-hover:text-blue-700 transition-colors">
                            {patient.first_name +" "+ patient.last_name}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>DOB: {formatDate(patient.date_of_birth)}</span>
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                ))}
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">Select an account to access your dashboard</p>
              </div>
            </div>
          )}
        </div>

        {/* Back Button */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
          >
            ← Go back to phone verification
          </button>
        </div>
      </div>
    </div>
  );
}