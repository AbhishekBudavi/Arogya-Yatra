'use client'
import React, { useState } from 'react';
import { User, Search, Plus, Trash2, Eye } from 'lucide-react';

export default function PatientRecords({ hospitalData, onShowToast }) {
  const [patients, setPatients] = useState([
    { id: 1, name: 'John Doe', age: 45, gender: 'Male', phone: '+1234567890', email: 'john@email.com', admissionDate: '2024-11-15', status: 'Active' },
    { id: 2, name: 'Sarah Wilson', age: 38, gender: 'Female', phone: '+1234567891', email: 'sarah@email.com', admissionDate: '2024-11-18', status: 'Active' },
    { id: 3, name: 'Mike Brown', age: 52, gender: 'Male', phone: '+1234567892', email: 'mike@email.com', admissionDate: '2024-11-10', status: 'Discharged' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    phone: '',
    email: ''
  });

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPatient = () => {
    if (!formData.name || !formData.age || !formData.phone || !formData.email) {
      onShowToast('Please fill all required fields', 'error');
      return;
    }
    const newPatient = {
      id: Date.now(),
      ...formData,
      age: parseInt(formData.age),
      admissionDate: new Date().toISOString().split('T')[0],
      status: 'Active'
    };
    setPatients([...patients, newPatient]);
    setFormData({ name: '', age: '', gender: 'Male', phone: '', email: '' });
    setShowForm(false);
    onShowToast('Patient added successfully', 'success');
  };

  const handleDeletePatient = (id) => {
    setPatients(patients.filter(p => p.id !== id));
    onShowToast('Patient record removed', 'success');
  };

  return (
    <div className="space-y-6 ml-8 mr-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <User className="w-8 h-8 text-blue-600" />
            Patient Records
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            View and manage patient information
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium 
            transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Patient
        </button>
      </div>

      {/* Add Patient Form */}
      {showForm && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Register New Patient</h2>
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
            <input
              type="number"
              placeholder="Age"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
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
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleAddPatient}
              className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              Save Patient
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
          placeholder="Search patients by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
            bg-white dark:bg-gray-800 text-gray-900 dark:text-white
            focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Patients Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden mt-6">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Name</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Age</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Gender</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Phone</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Admission Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Status</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 dark:text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                    No patients found
                  </td>
                </tr>
              ) : (
                filteredPatients.map(patient => (
                  <tr key={patient.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 text-sm text-gray-900 dark:text-white font-medium">{patient.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{patient.age}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{patient.gender}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{patient.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">{patient.admissionDate}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        patient.status === 'Active'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
                          : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors">
                          <Eye className="w-4 h-4 text-blue-600" />
                        </button>
                        <button
                          onClick={() => handleDeletePatient(patient.id)}
                          className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                        </button>
                      </div>
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
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Patients</p>
          <p className="text-3xl font-bold text-blue-600">{patients.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Active Patients</p>
          <p className="text-3xl font-bold text-green-600">
            {patients.filter(p => p.status === 'Active').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Discharged</p>
          <p className="text-3xl font-bold text-purple-600">
            {patients.filter(p => p.status === 'Discharged').length}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Avg. Age</p>
          <p className="text-3xl font-bold text-orange-600">
            {(patients.reduce((sum, p) => sum + p.age, 0) / patients.length).toFixed(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
