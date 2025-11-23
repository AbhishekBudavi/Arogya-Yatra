'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function DoctorAppointmentsDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  // Get doctor ID and hospital ID from localStorage
  useEffect(() => {
    const token = localStorage.getItem('doctorToken');
    const dId = localStorage.getItem('doctorId');
    const hId = localStorage.getItem('hospitalId');
    
    if (!token || !dId) {
      window.location.href = '/auth';
      return;
    }
    setDoctorId(dId);
    setHospitalId(hId);
  }, []);

  // Fetch appointments
  useEffect(() => {
    if (!doctorId) return;
    fetchAppointments();
  }, [doctorId, selectedDate]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');

    try {
      const token = localStorage.getItem('doctorToken');
      const params = {
        date: selectedDate,
      };

      if (hospitalId) {
        params.hospital_id = hospitalId;
      }

      const response = await axios.get('/api/appointments/doctor/appointments', {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setAppointments(response.data.data || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'no-show':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(':');
    const hourNum = parseInt(hour);
    const ampm = hourNum >= 12 ? 'PM' : 'AM';
    const displayHour = hourNum % 12 || 12;
    return `${displayHour}:${minute} ${ampm}`;
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const selectedDateObj = new Date(selectedDate);
    selectedDateObj.setHours(0, 0, 0, 0);

    if (selectedDateObj.getTime() >= today.getTime()) {
      return appointments;
    }
    return [];
  };

  const upcomingAppointments = getUpcomingAppointments();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Your Appointments</h1>
          <p className="text-gray-600">View and manage your scheduled appointments</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {/* Date Selector */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-4">
            <label className="block text-gray-700 font-semibold">Select Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            <button
              onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Today
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg shadow p-6 border-l-4 border-blue-600">
            <p className="text-gray-600 text-sm font-semibold">Total Appointments</p>
            <p className="text-3xl font-bold text-blue-600">{upcomingAppointments.length}</p>
          </div>
          <div className="bg-green-50 rounded-lg shadow p-6 border-l-4 border-green-600">
            <p className="text-gray-600 text-sm font-semibold">Confirmed</p>
            <p className="text-3xl font-bold text-green-600">
              {upcomingAppointments.filter((a) => a.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-yellow-50 rounded-lg shadow p-6 border-l-4 border-yellow-600">
            <p className="text-gray-600 text-sm font-semibold">Scheduled</p>
            <p className="text-3xl font-bold text-yellow-600">
              {upcomingAppointments.filter((a) => a.status === 'scheduled').length}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg shadow p-6 border-l-4 border-red-600">
            <p className="text-gray-600 text-sm font-semibold">Cancelled</p>
            <p className="text-3xl font-bold text-red-600">
              {appointments.filter((a) => a.status === 'cancelled').length}
            </p>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          ) : upcomingAppointments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left">Time</th>
                      <th className="px-6 py-3 text-left">Patient</th>
                      <th className="px-6 py-3 text-left">Reason</th>
                      <th className="px-6 py-3 text-left">Contact</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {upcomingAppointments.map((appointment) => (
                      <tr key={appointment.appointment_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-bold text-lg text-indigo-600">
                            {formatTime(appointment.appointment_time)}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800">
                            {appointment.first_name} {appointment.last_name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Blood Type: {appointment.blood_group || 'N/A'}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-800">{appointment.reason_for_visit}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-800">{appointment.mobile_number}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadgeColor(
                              appointment.status
                            )}`}
                          >
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              // Could implement a modal or detailed view
                            }}
                            className="px-3 py-1 text-indigo-600 hover:text-indigo-700 font-semibold text-sm"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600 text-lg">No appointments scheduled for this date</p>
              <p className="text-gray-500 text-sm mt-2">
                Select a different date to view appointments
              </p>
            </div>
          )}
        </div>

        {/* Back to Dashboard */}
        <div className="text-center">
          <Link
            href="/dashboard/doctor"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← Back to Doctor Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
