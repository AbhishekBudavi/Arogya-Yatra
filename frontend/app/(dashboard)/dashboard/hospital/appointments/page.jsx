'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { getHospitalId } from '../../../../utils/jwt'

// Utility function to get cookie value
const getCookie = (name) => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export default function HospitalAppointmentsDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [hospitalToken, setHospitalToken] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, pages: 1 });

  // Get hospital ID from localStorage (stored during hospital login)
  useEffect(() => {
    const token = getCookie('hospitalAuthToken');
    const hId = getHospitalId(); // Get from localStorage
    
    console.log('Cookie Check:', { hospitalAuthToken: token, hospitalId: hId });
    
    if (!token || !hId) {
      console.warn('Missing hospital authentication - redirecting to auth');
      window.location.href = '/auth/login/hospital';
      return;
    }
    setHospitalToken(token);
    setHospitalId(hId);
  }, []);

  // Fetch appointments
  useEffect(() => {
    if (!hospitalId) return;
    fetchAppointments();
  }, [hospitalId, statusFilter, dateFilter, pagination.page]);

  const fetchAppointments = async () => {
    setLoading(true);
    setError('');

    try {
      if (!hospitalToken) {
        setError('Authentication missing. Please login again.');
        window.location.href = '/auth';
        return;
      }

      const params = {
        page: pagination.page,
        limit: pagination.limit,
      };

      if (statusFilter !== 'all') {
        params.status = statusFilter;
      }

      if (dateFilter) {
        params.date = dateFilter;
      }

      const response = await axios.get(
        `/api/appointments/hospital/${hospitalId}/appointments`,
        {
          params,
          headers: {
            Authorization: `Bearer ${hospitalToken}`,
          },
        }
      );

      setAppointments(response.data.data);
      setFilteredAppointments(response.data.data);
      setPagination({
        page: response.data.pagination.page,
        limit: response.data.pagination.limit,
        pages: response.data.pagination.pages,
      });
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to fetch appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (appointmentId, newStatus) => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!hospitalToken) {
        setError('Authentication missing. Please login again.');
        window.location.href = '/auth';
        return;
      }

      const response = await axios.patch(
        `/api/appointments/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${hospitalToken}`,
          },
        }
      );

      setSuccess('Appointment status updated successfully');
      setSelectedAppointment(null);
      setUpdateStatus('');

      // Refresh appointments
      setTimeout(() => {
        fetchAppointments();
      }, 1000);
    } catch (err) {
      console.error('Update error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to update appointment status');
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
      case 'rescheduled':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Hospital Appointments</h1>
          <p className="text-gray-600">Manage and track all appointments at your hospital</p>
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

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="no-show">No-Show</option>
                <option value="rescheduled">Rescheduled</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Filter by Date</label>
              <input
                type="date"
                value={dateFilter}
                onChange={(e) => {
                  setDateFilter(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
              />
            </div>

            {/* Clear Filters */}
            <div className="flex items-end">
              <button
                onClick={() => {
                  setStatusFilter('all');
                  setDateFilter('');
                  setPagination({ ...pagination, page: 1 });
                }}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition font-semibold"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          ) : appointments.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-3 text-left">Patient</th>
                      <th className="px-6 py-3 text-left">Doctor</th>
                      <th className="px-6 py-3 text-left">Specialty</th>
                      <th className="px-6 py-3 text-left">Date & Time</th>
                      <th className="px-6 py-3 text-left">Status</th>
                      <th className="px-6 py-3 text-left">Contact</th>
                      <th className="px-6 py-3 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {appointments.map((appointment) => (
                      <tr key={appointment.appointment_id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800">
                            {appointment.first_name} {appointment.last_name}
                          </p>
                          <p className="text-sm text-gray-600">{appointment.patient_id}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-800">
                            Dr. {appointment.doctor_name}
                          </p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-800">{appointment.specialization}</p>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-gray-800">
                            {formatDate(appointment.appointment_date)}
                          </p>
                          <p className="text-sm text-gray-600">{appointment.appointment_time}</p>
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
                          <p className="text-gray-800">{appointment.mobile_number}</p>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => {
                              setSelectedAppointment(appointment);
                              setUpdateStatus(appointment.status);
                            }}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-sm"
                          >
                            Update Status
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="bg-gray-50 px-6 py-4 flex justify-center gap-2 border-t border-gray-200">
                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: Math.max(1, pagination.page - 1),
                      })
                    }
                    disabled={pagination.page === 1}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
                  >
                    Previous
                  </button>

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

                  <button
                    onClick={() =>
                      setPagination({
                        ...pagination,
                        page: Math.min(pagination.pages, pagination.page + 1),
                      })
                    }
                    disabled={pagination.page === pagination.pages}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-600">No appointments found</p>
            </div>
          )}
        </div>

        {/* Status Update Modal */}
        {selectedAppointment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Update Appointment Status</h2>

              <div className="mb-6">
                <p className="text-gray-600 mb-2">
                  <strong>Patient:</strong> {selectedAppointment.first_name}{' '}
                  {selectedAppointment.last_name}
                </p>
                <p className="text-gray-600 mb-2">
                  <strong>Doctor:</strong> Dr. {selectedAppointment.doctor_name}
                </p>
                <p className="text-gray-600 mb-4">
                  <strong>Current Status:</strong> {selectedAppointment.status}
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">New Status</label>
                <select
                  value={updateStatus}
                  onChange={(e) => setUpdateStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="no-show">No-Show</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => handleStatusUpdate(selectedAppointment.appointment_id, updateStatus)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition disabled:opacity-50 font-semibold"
                >
                  {loading ? 'Updating...' : 'Update Status'}
                </button>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  disabled={loading}
                  className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition disabled:opacity-50 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Back to Dashboard */}
        <div className="text-center">
          <Link
            href="/dashboard/hospital"
            className="text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            ← Back to Hospital Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
