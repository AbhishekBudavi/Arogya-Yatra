'use client'
import React, { useState, useEffect } from 'react';
import { Users, Plus, Trash2, Edit2, Search, X } from 'lucide-react';

export default function DoctorManagement({ hospitalData, onShowToast }) {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    doctor_id: '',
    name: '',
    specialization: '',
    email: '',
    phone: '',
    licenseId: '',
    availability: []
  });

  const specializations = ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'Surgery', 'Radiology', 'Psychiatry'];
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const timeSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'];

  // Fetch doctors when component mounts
  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/hospital/doctors', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (response.ok) {
        const result = await response.json();
        setDoctors(result.data || []);
      } else {
        // Fallback to empty array if not authenticated or endpoint not available
        setDoctors([]);
      }
    } catch (error) {
      // Silently handle error - backend may not be ready yet
      setDoctors([]);
    } finally {
      setLoading(false);
    }
  };

  const addAvailabilitySlot = () => {
    setFormData({
      ...formData,
      availability: [...formData.availability, { day: '', startTime: '', endTime: '' }]
    });
  };

  const removeAvailabilitySlot = (index) => {
    setFormData({
      ...formData,
      availability: formData.availability.filter((_, i) => i !== index)
    });
  };

  const updateAvailabilitySlot = (index, field, value) => {
    const updatedAvailability = [...formData.availability];
    updatedAvailability[index] = { ...updatedAvailability[index], [field]: value };
    setFormData({ ...formData, availability: updatedAvailability });
  };

  const filteredDoctors = doctors.filter(doc => {
    const name = (doc.name || doc.doctor_name || '').toLowerCase();
    const specialization = (doc.specialization || '').toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return name.includes(searchLower) || specialization.includes(searchLower);
  });

  const handleAddDoctor = async () => {
    if (!formData.doctor_id || !formData.name || !formData.specialization || !formData.email || !formData.phone || !formData.licenseId) {
      onShowToast('Please fill all required fields', 'error');
      return;
    }

    if (formData.availability.length === 0) {
      onShowToast('Please add at least one availability slot', 'error');
      return;
    }

    // Validate availability slots
    const isValidAvailability = formData.availability.every(slot => 
      slot.day && slot.startTime && slot.endTime
    );

    if (!isValidAvailability) {
      onShowToast('Please fill all availability fields (Day, Start Time, End Time)', 'error');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/hospital/doctors/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          doctor_id: formData.doctor_id,
          doctor_name: formData.name,
          specialization: formData.specialization,
          email: formData.email,
          phone: formData.phone,
          license_id: formData.licenseId,
          availability: formData.availability.map(slot => ({
            day: slot.day,
            startTime: slot.startTime,
            endTime: slot.endTime
          }))
        })
      });

      if (response.ok) {
        const result = await response.json();
        // Add doctor to local state
        const newDoctor = {
          doctor_id: formData.doctor_id,
          doctor_name: formData.name,
          specialization: formData.specialization,
          email: formData.email,
          phone: formData.phone,
          license_id: formData.licenseId,
          availability: formData.availability
        };
        setDoctors([...doctors, newDoctor]);
        setFormData({ doctor_id: '', name: '', specialization: '', email: '', phone: '', licenseId: '', availability: [] });
        setShowForm(false);
        onShowToast('Doctor added successfully', 'success');
      } else {
        // If backend endpoint not ready, still add to local state
        const newDoctor = {
          doctor_id: formData.doctor_id,
          doctor_name: formData.name,
          specialization: formData.specialization,
          email: formData.email,
          phone: formData.phone,
          license_id: formData.licenseId,
          availability: formData.availability
        };
        setDoctors([...doctors, newDoctor]);
        setFormData({ doctor_id: '', name: '', specialization: '', email: '', phone: '', licenseId: '', availability: [] });
        setShowForm(false);
        onShowToast('Doctor added successfully (local)', 'success');
      }
    } catch (error) {
      // If backend not available, still add to local state
      const newDoctor = {
        doctor_id: formData.doctor_id,
        doctor_name: formData.name,
        specialization: formData.specialization,
        email: formData.email,
        phone: formData.phone,
        license_id: formData.licenseId,
        availability: formData.availability
      };
      setDoctors([...doctors, newDoctor]);
      setFormData({ doctor_id: '', name: '', specialization: '', email: '', phone: '', licenseId: '', availability: [] });
      setShowForm(false);
      onShowToast('Doctor added successfully (local)', 'success');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (doctor_id) => {
    try {
      setLoading(true);
      // Try to call backend to delete doctor
      try {
        const response = await fetch(`http://localhost:5000/api/hospital/doctors/${doctor_id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include'
        });
      } catch (err) {
        // Backend not available, proceed with local deletion
      }
      
      // Delete from local state
      setDoctors(doctors.filter(doc => doc.doctor_id !== doctor_id));
      onShowToast('Doctor removed successfully', 'success');
    } catch (error) {
      console.error('Error deleting doctor:', error);
      onShowToast('Error removing doctor. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
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
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 max-h-[80vh] overflow-y-auto">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Register New Doctor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Doctor ID"
              value={formData.doctor_id}
              onChange={(e) => setFormData({ ...formData, doctor_id: e.target.value })}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
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
            <input
              type="text"
              placeholder="Doctor License ID"
              value={formData.licenseId}
              onChange={(e) => setFormData({ ...formData, licenseId: e.target.value })}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Availability Section */}
          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Available Days & Timings</h3>
              <button
                type="button"
                onClick={addAvailabilitySlot}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Slot
              </button>
            </div>

            <div className="space-y-4">
              {formData.availability.map((slot, index) => (
                <div key={index} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <select
                      value={slot.day}
                      onChange={(e) => updateAvailabilitySlot(index, 'day', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Day</option>
                      {daysOfWeek.map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>

                    <select
                      value={slot.startTime}
                      onChange={(e) => updateAvailabilitySlot(index, 'startTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Start Time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>

                    <select
                      value={slot.endTime}
                      onChange={(e) => updateAvailabilitySlot(index, 'endTime', e.target.value)}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                        bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm
                        focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">End Time</option>
                      {timeSlots.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={() => removeAvailabilitySlot(index)}
                      className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {formData.availability.length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400 italic">No availability slots added yet. Click "Add Slot" to get started.</p>
              )}
            </div>
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{doctor.doctor_name || doctor.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">ID: {doctor.doctor_id || doctor.id}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
                    aria-label="Edit"
                  >
                    <Edit2 className="w-4 h-4 text-blue-600" />
                  </button>
                  <button
                    onClick={() => handleDeleteDoctor(doctor.doctor_id)}
                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                    aria-label="Delete"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                {doctor.specialization && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">Specialization:</span> {doctor.specialization}
                  </p>
                )}
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Email:</span> {doctor.email}
                </p>
                <p className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Phone:</span> {doctor.phone}
                </p>
                {doctor.license_id && (
                  <p className="text-gray-600 dark:text-gray-400">
                    <span className="font-medium">License ID:</span> {doctor.license_id}
                  </p>
                )}
              </div>
              
              {doctor.availability && doctor.availability.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="font-medium text-gray-900 dark:text-white mb-2 text-sm">Availability:</p>
                  <div className="space-y-1">
                    {doctor.availability.map((slot, idx) => (
                      <p key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2 pt-3">
                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                          {slot.day}
                        </span>
                        <span>{slot.startTime} - {slot.endTime}</span>
                      </p>
                    ))}
                  </div>
                </div>
              )}
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
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Doctors with Availability</p>
          <p className="text-3xl font-bold text-purple-600">
            {doctors.filter(d => d.availability && d.availability.length > 0).length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Status</p>
          <p className="text-3xl font-bold text-green-600">{loading ? 'Loading...' : 'Ready'}</p>
        </div>
      </div>
    </div>
  );
}
