'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, User, AlertCircle, Loader, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { api } from '../../../../../utils/api';
import { useNotifications } from '../../../../../context/NotificationContext';

export default function RecentAppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, confirmed, completed, cancelled
  const [lastRefresh, setLastRefresh] = useState(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Access notifications from context
  const { notifications } = useNotifications();

  // Set hydration flag after component mounts
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  // Listen to notifications and refresh appointments immediately
  useEffect(() => {
    if (notifications && notifications.length > 0) {
      // Get the most recent notification
      const latestNotification = notifications[notifications.length - 1];
      
      // If it's an appointment status change, refresh immediately
      if (latestNotification?.appointmentId && latestNotification?.newStatus) {
        fetchAppointments();
      }
    }
  }, [notifications]);

  // Fetch appointments on component mount
  useEffect(() => {
    fetchAppointments();

    // Poll for updates every 30 seconds (as fallback)
    const interval = setInterval(fetchAppointments, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAppointments = async () => {
    try {
      setError('');
      const response = await api.get('/appointments/patient');

      if (response.data.success && response.data.data) {
        console.log('Appointments fetched with data:', response.data.data);
        setAppointments(response.data.data);
        if (isHydrated) {
          setLastRefresh(new Date());
        }
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualRefresh = async () => {
    setLoading(true);
    await fetchAppointments();
    setLoading(false);
  };

  // Filter appointments based on selected status
  const filteredAppointments = appointments.filter(apt => {
    if (filter === 'all') return true;
    // Map 'scheduled' to 'pending' for UI purposes
    const displayStatus = apt.status?.toLowerCase() === 'scheduled' ? 'pending' : apt.status?.toLowerCase();
    return displayStatus === filter;
  });

  // Sort appointments by date (upcoming first)
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    return new Date(b.appointment_date) - new Date(a.appointment_date);
  });

  // Get status badge color
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-600';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-600';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-600';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300 dark:border-blue-600';
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border border-red-300 dark:border-red-600';
      case 'no-show':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-300 dark:border-gray-600';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300 border border-gray-300 dark:border-gray-600';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Format time
  const formatTime = (timeString) => {
    return timeString || 'Time not specified';
  };

  // Map status display name (scheduled -> pending for UI)
  const getDisplayStatus = (status) => {
    const statusMap = {
      'scheduled': 'pending',
      'pending': 'pending',
      'confirmed': 'confirmed',
      'completed': 'completed',
      'cancelled': 'cancelled',
      'no-show': 'no-show'
    };
    return statusMap[status?.toLowerCase()] || status || 'Unknown';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            Recent Appointments
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            View and manage your scheduled appointments
          </p>
        </div>
        <button
          onClick={handleManualRefresh}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Last refresh time */}
      {isHydrated && lastRefresh && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Last updated: {lastRefresh.toLocaleTimeString()}
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium text-sm transition-colors capitalize ${
              filter === status
                ? 'text-blue-600 border-b-2 border-blue-600 dark:text-blue-400'
                : 'text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200'
            }`}
          >
            {status}
            {status !== 'all' && (
              <span className="ml-2 text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded-full">
                {appointments.filter(a => {
                  const displayStatus = a.status?.toLowerCase() === 'scheduled' ? 'pending' : a.status?.toLowerCase();
                  return displayStatus === status;
                }).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {loading && appointments.length === 0 && (
        <div className="flex items-center justify-center py-12">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mr-3" />
          <span className="text-gray-600 dark:text-gray-400">Loading appointments...</span>
        </div>
      )}

      {/* No Appointments */}
      {!loading && sortedAppointments.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-12 text-center">
          <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            {appointments.length === 0
              ? 'No appointments scheduled yet'
              : `No ${filter} appointments`}
          </p>
          <Link
            href="/dashboard/patient/appointment"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700 font-medium"
          >
            Book an appointment
          </Link>
        </div>
      )}

      {/* Appointments List */}
      {!loading && sortedAppointments.length > 0 && (
        <div className="space-y-4">
          {sortedAppointments.map((appointment) => {
            // Debug: log each appointment
            console.log('Rendering appointment:', {
              id: appointment.appointment_id,
              status: appointment.status,
              doctor: appointment.doctor_name,
              date: appointment.appointment_date,
              allKeys: Object.keys(appointment)
            });
            
            return (
            <div
              key={appointment.appointment_id}
              className="bg-white mt-5 dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border-l-4 border-blue-600"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  {/* Doctor Info */}
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-5 h-5 text-gray-400" />
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {appointment.doctor_name ? `Dr. ${appointment.doctor_name}` : 'Doctor'}
                    </h3>
                  </div>

                  {/* Specialization */}
                  {appointment.specialization && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                      {appointment.specialization}
                    </p>
                  )}

                  {/* Date and Time */}
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(appointment.appointment_date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>{formatTime(appointment.appointment_time)}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex flex-col items-end gap-2">
                  <span
                    className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all ${getStatusColor(
                      appointment.status
                    )}`}
                  >
                    {getDisplayStatus(appointment.status)}
                  </span>

                  {/* Appointment ID */}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    ID: {appointment.appointment_id}
                  </span>
                </div>
              </div>

              {/* Hospital Info */}
              {appointment.hospital_name && (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{appointment.hospital_name}</span>
                </div>
              )}

              {/* Reason for Visit */}
              {appointment.reason_for_visit && (
                <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded text-sm">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Reason:</p>
                  <p className="text-gray-600 dark:text-gray-400">{appointment.reason_for_visit}</p>
                </div>
              )}

              {/* Notes */}
              {appointment.notes && (
                <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded text-sm">
                  <p className="font-semibold text-gray-700 dark:text-gray-300">Notes:</p>
                  <p className="text-gray-600 dark:text-gray-400">{appointment.notes}</p>
                </div>
              )}

              {/* Action Buttons */}
              {/* <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Link
                  href={`/dashboard/patient/appointment/recent-appointments/${appointment.appointment_id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors text-center"
                >
                  View Details
                </Link>

                {appointment.status?.toLowerCase() !== 'cancelled' && (
                  <button
                    className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-medium py-2 px-4 rounded-lg transition-colors"
                    disabled
                  >
                    Reschedule
                  </button>
                )}
              </div> */}
            </div>
            );
          })}
        </div>
      )}

      {/* Automatic refresh info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4 text-sm text-blue-800 dark:text-blue-300">
        <p className="font-semibold mb-1">💡 Auto-refresh enabled</p>
        <p>Appointment statuses are checked every 30 seconds for the latest updates from the hospital.</p>
      </div>
    </div>
  );
}
