'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '../../../../utils/api';
import { getPatientId } from '../../../../utils/jwt';

// Utility function to get cookie value
const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export default function PatientAppointmentPage() {
  const router = useRouter();
  const [step, setStep] = useState(1); // 1: Search, 2: Select Doctor, 3: Select Date/Time, 4: Confirm
  const [specialty, setSpecialty] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [reasonForVisit, setReasonForVisit] = useState('');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, pages: 1 });

  // Get patient ID from cookies
  const [patientId, setPatientId] = useState('');
  const [patientToken, setPatientToken] = useState('');

  useEffect(() => {
    // Get patient ID from localStorage (stored during patient selection)
    const pId = getPatientId();
    
    console.log('Patient ID from localStorage:', pId);
    
    if (!pId) {
      console.warn('Patient ID not found in localStorage - redirecting to login');
      // Redirect to patient selection if ID is missing
      window.location.href = '/auth/login/select-patient';
      return;
    }
    
    setPatientId(pId);
    // Token is automatically sent via cookies (withCredentials: true in api.js)
    setPatientToken('AUTHENTICATED');
  }, []);

  // Search doctors by specialty
  const handleSearchDoctors = async (e) => {
    e.preventDefault();
    if (!specialty.trim()) {
      setError('Please enter a specialty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const params = {
        specialty,
        page: pagination.page,
        limit: pagination.limit,
      };

      if (hospitalId) {
        params.hospital_id = hospitalId;
      }

      const response = await api.get('/appointments/search', { params });

      setDoctors(response.data.data);
      setPagination({
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        pages: response.data.pagination.pages,
      });

      if (response.data.data.length === 0) {
        setError('No doctors found for this specialty');
      } else {
        setStep(2);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to search doctors');
    } finally {
      setLoading(false);
    }
  };

  // Select a doctor and get available slots
  const handleSelectDoctor = async (doctor) => {
    setSelectedDoctor(doctor);
    setStep(3);
    setSelectedDate('');
    setSelectedTime('');
    setAvailableSlots([]);
  };

  // Fetch available slots
  const handleDateChange = async (date) => {
    setSelectedDate(date);
    setSelectedTime('');

    if (!date) {
      setAvailableSlots([]);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.get('/appointments/slots', {
        params: {
          doctor_id: selectedDoctor.doctor_id,
          hospital_id: selectedDoctor.hospital_id,
          appointment_date: date,
        },
      });

      setAvailableSlots(response.data.data.available_slots || []);

      if (!response.data.data.available_slots || response.data.data.available_slots.length === 0) {
        setError('No available slots for this date');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch available slots');
    } finally {
      setLoading(false);
    }
  };

  // Confirm appointment
  const handleConfirmAppointment = async (e) => {
    e.preventDefault();

    if (!selectedTime) {
      setError('Please select a time slot');
      return;
    }

    if (!reasonForVisit.trim()) {
      setError('Please enter reason for visit');
      return;
    }

    if (!patientToken || !patientId) {
      setError('Authentication missing. Please login again.');
      router.push('/auth');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Booking appointment with:', {
        patient_id: patientId,
        doctor_id: selectedDoctor.doctor_id,
        hospital_id: selectedDoctor.hospital_id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
      });

      const response = await api.post(
        '/appointments/book',
        {
          patient_id: patientId, // Use patient ID from localStorage
          doctor_id: selectedDoctor.doctor_id,
          hospital_id: selectedDoctor.hospital_id,
          appointment_date: selectedDate,
          appointment_time: selectedTime,
          reason_for_visit: reasonForVisit,
          notes: notes,
        }
        // Token is automatically sent via cookies (withCredentials: true)
      );

      setSuccess('Appointment booked successfully!');
      
      // Reset form and redirect after 2 seconds
      setTimeout(() => {
        setStep(1);
        setSpecialty('');
        setHospitalId('');
        setDoctors([]);
        setSelectedDoctor(null);
        setSelectedDate('');
        setSelectedTime('');
        setReasonForVisit('');
        setNotes('');
        router.push('/dashboard/patient/appointments');
      }, 2000);
    } catch (err) {
      console.error('Booking error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to book appointment');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (30 days from today)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Book an Appointment</h1>
          <p className="text-gray-600">Find doctors and schedule your visit</p>
        </div>

        {/* Step Indicator */}
        <div className="mb-8 flex justify-between items-center">
          {[1, 2, 3, 4].map((stepNum) => (
            <div key={stepNum} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= stepNum
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                {stepNum}
              </div>
              {stepNum < 4 && (
                <div
                  className={`w-20 h-1 mx-2 ${
                    step > stepNum ? 'bg-indigo-600' : 'bg-gray-300'
                  }`}
                ></div>
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="mb-8 flex justify-between text-center text-sm">
          <div className="flex-1">
            <p className={step >= 1 ? 'font-semibold text-indigo-600' : 'text-gray-600'}>
              Search Doctor
            </p>
          </div>
          <div className="flex-1">
            <p className={step >= 2 ? 'font-semibold text-indigo-600' : 'text-gray-600'}>
              Select Doctor
            </p>
          </div>
          <div className="flex-1">
            <p className={step >= 3 ? 'font-semibold text-indigo-600' : 'text-gray-600'}>
              Choose Date & Time
            </p>
          </div>
          <div className="flex-1">
            <p className={step >= 4 ? 'font-semibold text-indigo-600' : 'text-gray-600'}>
              Confirm
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-lg">
            {success}
          </div>
        )}

        {/* Step 1: Search Doctors */}
        {step === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <form onSubmit={handleSearchDoctors}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Search by Specialty
                </label>
                <input
                  type="text"
                  value={specialty}
                  onChange={(e) => setSpecialty(e.target.value)}
                  placeholder="e.g., Cardiology, Pediatrics, Dermatology"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  disabled={loading}
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Hospital (Optional)
                </label>
                <input
                  type="text"
                  value={hospitalId}
                  onChange={(e) => setHospitalId(e.target.value)}
                  placeholder="Enter hospital ID or leave blank"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Searching...' : 'Search Doctors'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Select Doctor */}
        {step === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="mb-6">
              <button
                onClick={() => setStep(1)}
                className="text-indigo-600 hover:text-indigo-700 font-semibold mb-4"
              >
                ← Back to Search
              </button>

              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Found {doctors.length} Doctors
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {doctors.map((doctor) => (
                  <div
                    key={doctor.doctor_id}
                    className="border border-gray-300 rounded-lg p-6 hover:shadow-lg transition cursor-pointer hover:border-indigo-600"
                    onClick={() => handleSelectDoctor(doctor)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">
                          Dr. {doctor.doctor_name}
                        </h3>
                        <p className="text-indigo-600 font-semibold">{doctor.specialization}</p>
                        <p className="text-gray-600">Email: {doctor.email}</p>
                        <p className="text-gray-600">Phone: {doctor.phone}</p>
                        <p className="text-gray-600">License: {doctor.license_id}</p>
                        <div className="mt-2 text-sm text-gray-600">
                          <p className="font-semibold">{doctor.hospital_name}</p>
                          <p>{doctor.hospital_address}</p>
                          <p>
                            {doctor.city}, {doctor.state}
                          </p>
                        </div>
                      </div>
                      <button
                        className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectDoctor(doctor);
                        }}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setPagination({ ...pagination, page })}
                      className={`px-4 py-2 rounded-lg ${
                        pagination.page === page
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 3: Select Date & Time */}
        {step === 3 && selectedDoctor && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <button
              onClick={() => setStep(2)}
              className="text-indigo-600 hover:text-indigo-700 font-semibold mb-4"
            >
              ← Back to Doctors
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Dr. {selectedDoctor.doctor_name}
            </h2>
            <p className="text-indigo-600 font-semibold mb-6">{selectedDoctor.specialization}</p>

            <form onSubmit={(e) => {
              e.preventDefault();
              setStep(4);
            }}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Select Date
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => handleDateChange(e.target.value)}
                  min={getMinDate()}
                  max={getMaxDate()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                  required
                  disabled={loading}
                />
              </div>

              {selectedDate && (
                <>
                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-4">
                      Available Time Slots
                    </label>
                    {loading ? (
                      <p className="text-gray-600">Loading slots...</p>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setSelectedTime(slot)}
                            className={`p-3 rounded-lg font-semibold transition ${
                              selectedTime === slot
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-red-600">No slots available for this date</p>
                    )}
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Reason for Visit
                    </label>
                    <textarea
                      value={reasonForVisit}
                      onChange={(e) => setReasonForVisit(e.target.value)}
                      placeholder="Describe your reason for visiting the doctor"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 h-24"
                      required
                    />
                  </div>

                  <div className="mb-6">
                    <label className="block text-gray-700 font-semibold mb-2">
                      Additional Notes (Optional)
                    </label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Any additional information for the doctor"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600 h-20"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!selectedTime}
                    className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Confirmation
                  </button>
                </>
              )}
            </form>
          </div>
        )}

        {/* Step 4: Confirm Appointment */}
        {step === 4 && selectedDoctor && selectedDate && selectedTime && (
          <div className="bg-white rounded-lg shadow-lg p-8">
            <button
              onClick={() => setStep(3)}
              className="text-indigo-600 hover:text-indigo-700 font-semibold mb-4"
            >
              ← Back to Date & Time
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Confirm Your Appointment</h2>

            <div className="bg-indigo-50 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Doctor</p>
                  <p className="text-gray-800 text-lg">Dr. {selectedDoctor.doctor_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Specialization</p>
                  <p className="text-gray-800 text-lg">{selectedDoctor.specialization}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Hospital</p>
                  <p className="text-gray-800 text-lg">{selectedDoctor.hospital_name}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Date</p>
                  <p className="text-gray-800 text-lg">
                    {new Date(selectedDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Time</p>
                  <p className="text-gray-800 text-lg">{selectedTime}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm font-semibold">Reason</p>
                  <p className="text-gray-800 text-lg">{reasonForVisit.substring(0, 30)}...</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleConfirmAppointment}>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white font-semibold py-3 rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed mb-3"
              >
                {loading ? 'Booking Appointment...' : 'Confirm Appointment'}
              </button>
              <button
                type="button"
                onClick={() => setStep(3)}
                disabled={loading}
                className="w-full bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Modify Details
              </button>
            </form>
          </div>
        )}

        {/* Back to Dashboard Link */}
        <div className="mt-8 text-center">
          <Link
            href="/dashboard/patient"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
