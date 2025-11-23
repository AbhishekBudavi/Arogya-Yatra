'use client'
import React, { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, Clock, User, Search, AlertCircle, Loader } from 'lucide-react';
import { appointmentAPI } from '../../utils/api';

export default function AppointmentScheduling({ hospitalData, onShowToast }) {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 20, pages: 1 });
  
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });

  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  // Fetch appointments and doctors on component mount
  useEffect(() => {
    if (hospitalData?.hospital_id) {
      fetchAppointments();
      fetchDoctors();
    }
  }, [hospitalData?.hospital_id]);

  // Fetch appointments when page changes
  useEffect(() => {
    if (hospitalData?.hospital_id) {
      fetchAppointments();
    }
  }, [pagination.page]);

  // Fetch appointments from backend
  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await appointmentAPI.getHospitalAppointments(
        hospitalData.hospital_id,
        {
          page: pagination.page,
          limit: pagination.limit,
        }
      );
      
      if (response.success && response.data) {
        // Transform backend data to match UI format
        const transformedAppointments = response.data.map(apt => ({
          id: apt.appointment_id,
          patient: `${apt.first_name || ''} ${apt.last_name || ''}`.trim(),
          doctor: `Dr. ${apt.doctor_name}`,
          date: apt.appointment_date,
          time: apt.appointment_time,
          reason: apt.reason_for_visit,
          status: apt.status?.charAt(0).toUpperCase() + apt.status?.slice(1).toLowerCase() || 'Pending',
          appointment_id: apt.appointment_id,
          doctor_id: apt.doctor_id,
          patient_id: apt.patient_id,
          notes: apt.notes,
          mobile_number: apt.mobile_number,
        }));
        
        setAppointments(transformedAppointments);
        if (response.pagination) {
          setPagination({
            page: response.pagination.page,
            limit: response.pagination.limit,
            pages: response.pagination.pages,
          });
        }
      }
    } catch (err) {
      console.error('Error fetching appointments:', err);
      setError('Failed to load appointments');
      onShowToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch doctors for the hospital
  const fetchDoctors = async () => {
    try {
      const response = await appointmentAPI.getHospitalDoctors(hospitalData.hospital_id);
      if (response.success && response.data) {
        setDoctors(response.data);
      }
    } catch (err) {
      console.error('Error fetching doctors:', err);
      onShowToast('Failed to load doctors', 'error');
    }
  };

  // Fetch available slots when date changes
  const handleDateChange = async (date) => {
    setFormData(prev => ({ ...prev, date, time: '' }));
    setAvailableSlots([]);

    if (!date || !formData.doctor) {
      return;
    }

    try {
      setLoading(true);
      const response = await appointmentAPI.getDoctorAvailability(
        formData.doctor,
        hospitalData.hospital_id,
        date
      );
      
      if (response.success && response.data) {
        setAvailableSlots(response.data.available_slots || []);
        if (!response.data.available_slots || response.data.available_slots.length === 0) {
          onShowToast('No available slots for this date', 'info');
        }
      }
    } catch (err) {
      console.error('Error fetching available slots:', err);
      onShowToast('Failed to load available time slots', 'error');
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle adding a new appointment (manual scheduling by hospital)
  const handleAddAppointment = async () => {
    if (!formData.patient || !formData.doctor || !formData.date || !formData.time) {
      onShowToast('Please fill all required fields', 'error');
      return;
    }

    // Note: This is for manual scheduling by hospital staff
    // In a real scenario, you might need a separate endpoint or pre-book patient appointments
    const newAppointment = {
      id: Date.now(),
      ...formData,
      status: 'Pending',
      appointment_id: Date.now(),
    };
    
    setAppointments([...appointments, newAppointment]);
    setFormData({ patient: '', doctor: '', date: '', time: '', reason: '' });
    setShowForm(false);
    onShowToast('Appointment scheduled successfully', 'success');
  };

  // Update appointment status
  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      setLoading(true);
      await appointmentAPI.updateAppointmentStatus(appointmentId, newStatus.toLowerCase());
      
      setAppointments(appointments.map(apt =>
        apt.appointment_id === appointmentId
          ? { ...apt, status: newStatus }
          : apt
      ));
      
      onShowToast('Appointment status updated successfully', 'success');
    } catch (err) {
      console.error('Error updating appointment status:', err);
      onShowToast('Failed to update appointment status', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Delete/Cancel appointment
  const handleDeleteAppointment = async (appointmentId) => {
    try {
      setLoading(true);
      await appointmentAPI.cancelAppointment(appointmentId, 'Cancelled by hospital');
      
      setAppointments(appointments.filter(apt => apt.appointment_id !== appointmentId));
      onShowToast('Appointment cancelled successfully', 'success');
    } catch (err) {
      console.error('Error cancelling appointment:', err);
      onShowToast('Failed to cancel appointment', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  // Get maximum date (90 days from today)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 90);
    return maxDate.toISOString().split('T')[0];
  };

  // Filter appointments based on search term
  const filteredAppointments = appointments.filter(apt =>
    apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Count appointments by status
  const confirmedCount = appointments.filter(a => a.status === 'Confirmed').length;
  const pendingCount = appointments.filter(a => a.status === 'Pending').length;
  const todayCount = appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length;

  return (
    <div className="space-y-6 ml-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Calendar className="w-8 h-8 text-blue-600" />
            Appointment Scheduling
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage patient appointments and schedules
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium 
            transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Schedule Appointment
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900/20 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          {error}
        </div>
      )}

      {/* Schedule Appointment Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">New Appointment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Patient Name"
              value={formData.patient}
              onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
              disabled={loading}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
            <select
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              disabled={loading || doctors.length === 0}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="">
                {doctors.length === 0 ? 'No doctors available' : 'Select Doctor'}
              </option>
              {doctors.map((doc) => (
                <option key={doc.doctor_id || doc} value={doc.doctor_id || doc}>
                  Dr. {doc.doctor_name || doc}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleDateChange(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
              disabled={loading}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            />
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              disabled={loading || !formData.date}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            >
              <option value="">{loading ? 'Loading slots...' : 'Select Time'}</option>
              {availableSlots.length > 0 ? (
                availableSlots.map(slot => (
                  <option key={slot} value={slot}>{slot}</option>
                ))
              ) : !formData.date ? (
                <option disabled>Select a date first</option>
              ) : (
                <option disabled>No slots available</option>
              )}
            </select>
            <textarea
              placeholder="Reason for appointment"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              disabled={loading}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2 disabled:opacity-50"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddAppointment}
              disabled={loading}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Schedule'
              )}
            </button>
            <button
              onClick={() => setShowForm(false)}
              disabled={loading}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative mt-6">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search appointments by patient or doctor name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          disabled={loading}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
        />
      </div>

      {/* Appointments Table */}
      <div className="bg-white mt-6 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
        {loading && appointments.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <Loader className="w-8 h-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Loading appointments...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Patient</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Doctor</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Time</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      {appointments.length === 0 ? 'No appointments scheduled' : 'No appointments match your search'}
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map(apt => (
                    <tr key={apt.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{apt.patient}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{apt.doctor}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Calendar className="w-4 h-4" /> {apt.date}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Clock className="w-4 h-4" /> {apt.time}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <select
                          value={apt.status}
                          onChange={(e) => handleStatusChange(apt.appointment_id, e.target.value)}
                          disabled={loading}
                          className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer disabled:opacity-50 ${
                            apt.status === 'Confirmed'
                              ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                              : apt.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                              : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                          }`}
                        >
                          <option>Pending</option>
                          <option>Confirmed</option>
                          <option>Cancelled</option>
                          <option>Completed</option>
                          <option>No-show</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => handleDeleteAppointment(apt.appointment_id)}
                          disabled={loading}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setPagination({ ...pagination, page })}
              disabled={loading}
              className={`px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
                pagination.page === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Appointments</p>
          <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Confirmed</p>
          <p className="text-3xl font-bold text-green-600">{confirmedCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Today's</p>
          <p className="text-3xl font-bold text-purple-600">{todayCount}</p>
        </div>
      </div>
    </div>
  );
}
