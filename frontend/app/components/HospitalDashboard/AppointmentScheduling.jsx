'use client'
import React, { useState } from 'react';
import { Calendar, Plus, Trash2, Clock, User, Search } from 'lucide-react';

export default function AppointmentScheduling({ hospitalData, onShowToast }) {
  const [appointments, setAppointments] = useState([
    { id: 1, patient: 'John Doe', doctor: 'Dr. Smith', date: '2024-11-22', time: '09:00 AM', status: 'Confirmed' },
    { id: 2, patient: 'Sarah Wilson', doctor: 'Dr. Johnson', date: '2024-11-22', time: '10:30 AM', status: 'Pending' },
    { id: 3, patient: 'Mike Brown', doctor: 'Dr. Davis', date: '2024-11-23', time: '02:00 PM', status: 'Confirmed' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    patient: '',
    doctor: '',
    date: '',
    time: '',
    reason: ''
  });

  const doctors = ['Dr. Smith', 'Dr. Johnson', 'Dr. Davis', 'Dr. Martinez', 'Dr. Williams'];
  const timeSlots = ['09:00 AM', '10:00 AM', '11:00 AM', '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];

  const filteredAppointments = appointments.filter(apt =>
    apt.patient.toLowerCase().includes(searchTerm.toLowerCase()) ||
    apt.doctor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddAppointment = () => {
    if (!formData.patient || !formData.doctor || !formData.date || !formData.time) {
      onShowToast('Please fill all required fields', 'error');
      return;
    }
    const newAppointment = {
      id: Date.now(),
      ...formData,
      status: 'Pending'
    };
    setAppointments([...appointments, newAppointment]);
    setFormData({ patient: '', doctor: '', date: '', time: '', reason: '' });
    setShowForm(false);
    onShowToast('Appointment scheduled successfully', 'success');
  };

  const handleDeleteAppointment = (id) => {
    setAppointments(appointments.filter(apt => apt.id !== id));
    onShowToast('Appointment cancelled', 'success');
  };

  const handleStatusChange = (id, newStatus) => {
    setAppointments(appointments.map(apt =>
      apt.id === id ? { ...apt, status: newStatus } : apt
    ));
    onShowToast('Appointment status updated', 'success');
  };

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
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium 
            transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Schedule Appointment
        </button>
      </div>

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
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={formData.doctor}
              onChange={(e) => setFormData({ ...formData, doctor: e.target.value })}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Doctor</option>
              {doctors.map(doc => (
                <option key={doc} value={doc}>{doc}</option>
              ))}
            </select>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Time</option>
              {timeSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
            <textarea
              placeholder="Reason for appointment"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent md:col-span-2"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddAppointment}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Schedule
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
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
          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Appointments Table */}
      <div className="bg-white mt-6 dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
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
                    No appointments found
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
                        onChange={(e) => handleStatusChange(apt.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border-0 cursor-pointer ${
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
                      </select>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => handleDeleteAppointment(apt.id)}
                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
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
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Appointments</p>
          <p className="text-3xl font-bold text-blue-600">{appointments.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Confirmed</p>
          <p className="text-3xl font-bold text-green-600">
            {appointments.filter(a => a.status === 'Confirmed').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">
            {appointments.filter(a => a.status === 'Pending').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Today's</p>
          <p className="text-3xl font-bold text-purple-600">2</p>
        </div>
      </div>
    </div>
  );
}
