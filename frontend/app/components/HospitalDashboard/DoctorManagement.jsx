'use client'
import React, { useState } from 'react';
import { Users, Plus, Trash2, Edit2, Search } from 'lucide-react';

export default function DoctorManagement({ hospitalData, onShowToast }) {
  const [doctors, setDoctors] = useState([
    { id: 1, name: 'Dr. John Smith', specialization: 'Cardiology', email: 'john@hospital.com', phone: '+1234567890' },
    { id: 2, name: 'Dr. Sarah Johnson', specialization: 'Neurology', email: 'sarah@hospital.com', phone: '+1234567891' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    specialization: '',
    email: '',
    phone: ''
  });

  const specializations = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Surgery', 'Radiology', 'Psychiatry'];

  const filteredDoctors = doctors.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.specialization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddDoctor = () => {
    if (!formData.name || !formData.specialization || !formData.email || !formData.phone) {
      onShowToast('Please fill all fields', 'error');
      return;
    }
    const newDoctor = {
      id: Date.now(),
      ...formData
    };
    setDoctors([...doctors, newDoctor]);
    setFormData({ name: '', specialization: '', email: '', phone: '' });
    setShowForm(false);
    onShowToast('Doctor added successfully', 'success');
  };

  const handleDeleteDoctor = (id) => {
    setDoctors(doctors.filter(doc => doc.id !== id));
    onShowToast('Doctor removed', 'success');
  };

  return (
    <div className="space-y-6 ml-8 mr-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-8 h-8 text-blue-600" />
            Doctor Management
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Register and manage hospital doctors
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium 
            transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Doctor
        </button>
      </div>

      {/* Add Doctor Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Register New Doctor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Full Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={formData.specialization}
              onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Select Specialization</option>
              {specializations.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddDoctor}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Doctor
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
          placeholder="Search doctors by name or specialization..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Doctors List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {filteredDoctors.length === 0 ? (
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-12 text-center">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">No doctors found</p>
          </div>
        ) : (
          filteredDoctors.map(doctor => (
            <div
              key={doctor.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{doctor.name}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{doctor.specialization}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    aria-label="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteDoctor(doctor.id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Email:</span> {doctor.email}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Phone:</span> {doctor.phone}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Doctors</p>
          <p className="text-3xl font-bold text-blue-600">{doctors.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Specializations</p>
          <p className="text-3xl font-bold text-purple-600">
            {new Set(doctors.map(d => d.specialization)).size}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Available Today</p>
          <p className="text-3xl font-bold text-green-600">{doctors.length}</p>
        </div>
      </div>
    </div>
  );
}
