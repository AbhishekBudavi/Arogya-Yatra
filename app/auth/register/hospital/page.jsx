'use client'
import React, { useState } from 'react';
import { Building2, MapPin, Phone, Heart, User, Shield } from 'lucide-react';

const HospitalRegistrationForm = () => {
  const [formData, setFormData] = useState({
    hospitalName: '',
    hospitalId: '',
    hospitalType: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India',
    email: '',
    primaryContact: '',
    alternateContact: '',
    departments: [],
    bedCount: '',
    icuAvailable: false,
    emergencyServices: false,
    adminName: '',
    adminMobile: '',
    password: ''
  });

  const hospitalTypes = ['Government', 'Private', 'Trust', 'NGO'];
  
  const departments = [
    'General Medicine', 'Cardiology', 'Orthopedics', 'Neurology', 
    'Pediatrics', 'Gynecology', 'Surgery', 'Dermatology', 
    'Psychiatry', 'Radiology', 'Pathology', 'Emergency'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleDepartmentChange = (dept) => {
    setFormData(prev => ({
      ...prev,
      departments: prev.departments.includes(dept)
        ? prev.departments.filter(d => d !== dept)
        : [...prev.departments, dept]
    }));
  };

  const handleSubmit = () => {
    console.log('Hospital Registration Data:', formData);
    alert('Hospital registration submitted successfully!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto mt-[88px]">
        {/* Header */}
       <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative p-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg">
              <Building2 className="h-10 w-10 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
            Hospital Registration Portal
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our healthcare network and provide better patient care with our advanced platform
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8">

          {/* Hospital Details Section */}
          <div className='p-10'>
          <div className="mb-8 ">
            <div className="flex items-center mb-4">
              <Building2 className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Hospital Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text font-medium text-gray-700 mb-2">
                  Hospital Name *
                </label>
                <input
                  type="text"
                  name="hospitalName"
                  value={formData.hospitalName}
                  onChange={handleInputChange}
                  placeholder="Enter hospital or clinic name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text font-medium text-gray-700 mb-2">
                  Hospital ID / Registration Number *
                </label>
                <input
                  type="text"
                  name="hospitalId"
                  value={formData.hospitalId}
                  onChange={handleInputChange}
                  placeholder="Enter registration number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text font-medium text-gray-700 mb-2">
                  Hospital Type *
                </label>
                <select
                  name="hospitalType"
                  value={formData.hospitalType}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                >
                  <option value="">Select hospital type</option>
                  {hospitalTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Location Information Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <MapPin className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Location Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text font-medium text-gray-700 mb-2">
                  Full Address *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Enter complete address"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                  required
                />
              </div>
              
              <div>
                <label className="block text font-medium text-gray-700 mb-2">
                  Pincode *
                </label>
                <input
                  type="text"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleInputChange}
                  placeholder="6-digit pincode"
                  maxLength="6"
                  pattern="[0-9]{6}"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="Enter city"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="Enter state"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 cursor-not-allowed"
                  readOnly
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Phone className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text font-medium text-gray-700 mb-2">
                  Official Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="hospital@example.com"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text font-medium text-gray-700 mb-2">
                  Primary Contact Number *
                </label>
                <input
                  type="tel"
                  name="primaryContact"
                  value={formData.primaryContact}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text font-medium text-gray-700 mb-2">
                  Alternate Contact Number
                </label>
                <input
                  type="tel"
                  name="alternateContact"
                  value={formData.alternateContact}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210 (Optional)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>

          {/* Facilities Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Heart className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Facilities</h2>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text font-medium text-gray-700 mb-3">
                  Departments Available *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {departments.map(dept => (
                    <label key={dept} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.departments.includes(dept)}
                        onChange={() => handleDepartmentChange(dept)}
                        className="w-4 h-4 bg-white accent-blue-600 border-white rounded focus:ring-blue-500"
                      />
                      <span className="text text-gray-700 pl-2">{dept}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-7">
                <div>
                  <label className="block text-[16px]  font-bold text-gray-900 mb-2">
                    Total Bed Count <span className='text text-red-900'>*</span>
                  </label>
                  <input
                    type="number"
                    name="bedCount"
                    value={formData.bedCount}
                    onChange={handleInputChange}
                    placeholder="Enter bed count"
                    min="1"
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>
                
                <div className="flex items-center space-x-3 pt-8">
                  <input
                    type="checkbox"
                    name="icuAvailable"
                    checked={formData.icuAvailable}
                    onChange={handleInputChange}
                    className="w-5 h-5 bg-white accent-blue-600 border-white rounded focus:ring-blue-500"
                  />
                  <label className="text font-medium text-gray-700">
                    ICU Available
                  </label>
                </div>
                
                <div className="flex items-center space-x-3 pt-8">
                  <input
                    type="checkbox"
                    name="emergencyServices"
                    checked={formData.emergencyServices}
                    onChange={handleInputChange}
                    className="w-5 h-5 accent-blue-600 border-gray-200  bg-white rounded focus:ring-blue-500"
                  />
                  <label className="text font-medium text-gray-700">
                    Emergency Services
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Details Section */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <User className="h-5 w-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Admin Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text font-medium text-gray-700 mb-2">
                  Admin Name *
                </label>
                <input
                  type="text"
                  name="adminName"
                  value={formData.adminName}
                  onChange={handleInputChange}
                  placeholder="Enter admin name"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <label className="block text font-medium text-gray-700 mb-2">
                  Admin Mobile Number *
                </label>
                <input
                  type="tel"
                  name="adminMobile"
                  value={formData.adminMobile}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
              
              <div className="md:col-span-2">
                <label className="block text font-medium text-gray-700 mb-2">
                  Set Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a secure password (optional)"
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Leave blank if using OTP login
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-105 transform shadow-lg hover:shadow-xl flex items-center space-x-2"
            >
              <Shield className="h-5 w-5" />
              <span className='pl-4'>Register Hospital</span>
            </button>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default HospitalRegistrationForm;