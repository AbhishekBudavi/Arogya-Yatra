'use client'
import React, { useState, useCallback } from 'react';
import { Building2, MapPin, Phone, Heart, User, Shield, AlertCircle, CheckCircle, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { hospitalAPI } from '../../../../utils/api';

const HospitalRegistrationForm = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    custom_hospital_id: '',
    hospital_name: '',
    hospital_type: '',
    address: '',
    pincode: '',
    city: '',
    state: '',
    country: 'India',
    email: '',
    admin_name: '',
    admin_mobile_number: '',
    password: '',
    departments: [],
    bed_count: '',
    icu_available: false,
    emergency_services: false
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [successData, setSuccessData] = useState(null);

  const hospitalTypes = ['Government', 'Private', 'Trust', 'NGO'];
  
  const departmentOptions = [
    'General Medicine', 'Cardiology', 'Orthopedics', 'Neurology', 
    'Pediatrics', 'Gynecology', 'Surgery', 'Dermatology', 
    'Psychiatry', 'Radiology', 'Pathology', 'Emergency'
  ];

  // Toast notification component
  const showToast = useCallback((message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  }, []);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    if (!formData.custom_hospital_id.trim()) {
      newErrors.custom_hospital_id = 'Hospital ID is required';
    }
    if (!formData.hospital_name.trim()) {
      newErrors.hospital_name = 'Hospital name is required';
    }
    if (!formData.hospital_type) {
      newErrors.hospital_type = 'Hospital type is required';
    }
    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      newErrors.pincode = 'Valid 6-digit pincode is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    if (!formData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!formData.admin_name.trim()) {
      newErrors.admin_name = 'Admin name is required';
    }
    if (!formData.admin_mobile_number.trim()) {
      newErrors.admin_mobile_number = 'Admin mobile number is required';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    }
    if (!formData.bed_count || parseInt(formData.bed_count) < 1) {
      newErrors.bed_count = 'Valid bed count is required';
    }
    if (!Array.isArray(formData.departments) || formData.departments.length === 0) {
      newErrors.departments = 'At least one department is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleDepartmentChange = (dept) => {
    setFormData(prev => {
      const deptArray = Array.isArray(prev.departments) ? prev.departments : [];
      return {
        ...prev,
        departments: deptArray.includes(dept)
          ? deptArray.filter(d => d !== dept)
          : [...deptArray, dept]
      };
    });
    // Clear error for departments when user selects one
    if (errors.departments) {
      setErrors(prev => ({ ...prev, departments: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('Please fix the errors in the form', 'error');
      return;
    }

    setLoading(true);

    try {
      // Format departments as comma-separated string
      const departmentsString = Array.isArray(formData.departments) 
        ? formData.departments.join(', ')
        : formData.departments;

      const registrationData = {
        custom_hospital_id: formData.custom_hospital_id,
        hospital_name: formData.hospital_name,
        hospital_type: formData.hospital_type,
        address: formData.address,
        pincode: formData.pincode,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        email: formData.email,
        admin_name: formData.admin_name,
        admin_mobile_number: formData.admin_mobile_number,
        password: formData.password,
        departments: departmentsString,
        bed_count: parseInt(formData.bed_count),
        icu_available: formData.icu_available,
        emergency_services: formData.emergency_services
      };

      const response = await hospitalAPI.register(registrationData);

      setSuccessData(response.data);
      showToast('Hospital registered successfully!', 'success');
      
      // Store token if provided
      if (response.token) {
        localStorage.setItem('hospitalToken', response.token);
      }

      // Redirect to login or dashboard after 2 seconds
      setTimeout(() => {
        router.push('/auth/login/hospital');
      }, 2000);
    } catch (error) {
      const errorMessage = error.message || 'Registration failed. Please try again.';
      showToast(errorMessage, 'error');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg text-white flex items-center gap-2 shadow-lg ${
          toast.type === 'success' ? 'bg-green-500' : toast.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
        }`}>
          {toast.type === 'success' ? (
            <CheckCircle className="w-5 h-5" />
          ) : (
            <AlertCircle className="w-5 h-5" />
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Success Modal */}
      {successData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 max-w-md w-full">
            <div className="flex justify-center mb-4">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-center mb-2">Registration Successful!</h2>
            <p className="text-gray-600 text-center mb-4">
              Hospital ID: <span className="font-semibold">{successData.custom_hospital_id}</span>
            </p>
            <p className="text-gray-600 text-center mb-6">Redirecting to login...</p>
          </div>
        </div>
      )}

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
          <form onSubmit={handleSubmit}>
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
                  name="hospital_name"
                  value={formData.hospital_name}
                  onChange={handleInputChange}
                  placeholder="Enter hospital or clinic name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.hospital_name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.hospital_name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.hospital_name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text font-medium text-gray-700 mb-2">
                  Hospital ID / Registration Number *
                </label>
                <input
                  type="text"
                  name="custom_hospital_id"
                  value={formData.custom_hospital_id}
                  onChange={handleInputChange}
                  placeholder="Enter registration number (e.g., HOSP001)"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.custom_hospital_id ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.custom_hospital_id && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.custom_hospital_id}
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text font-medium text-gray-700 mb-2">
                  Hospital Type *
                </label>
                <select
                  name="hospital_type"
                  value={formData.hospital_type}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.hospital_type ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                >
                  <option value="">Select hospital type</option>
                  {hospitalTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.hospital_type && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.hospital_type}
                  </p>
                )}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none ${
                    errors.address ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.address && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.address}
                  </p>
                )}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.pincode ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.pincode && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.pincode}
                  </p>
                )}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.city ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.city && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.city}
                  </p>
                )}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.state ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.state && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.state}
                  </p>
                )}
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
              <div className="md:col-span-2">
                <label className="block text font-medium text-gray-700 mb-2">
                  Official Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="hospital@example.com"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.email ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.email}
                  </p>
                )}
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
                <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-4 border rounded-lg ${
                  errors.departments ? 'border-red-500' : 'border-gray-200'
                }`}>
                  {departmentOptions.map(dept => (
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
                {errors.departments && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.departments}
                  </p>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-7">
                <div>
                  <label className="block text-[16px]  font-bold text-gray-900 mb-2">
                    Total Bed Count <span className='text text-red-900'>*</span>
                  </label>
                  <input
                    type="number"
                    name="bed_count"
                    value={formData.bed_count}
                    onChange={handleInputChange}
                    placeholder="Enter bed count"
                    min="1"
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      errors.bed_count ? 'border-red-500' : 'border-gray-200'
                    }`}
                    required
                  />
                  {errors.bed_count && (
                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" /> {errors.bed_count}
                    </p>
                  )}
                </div>
                
                <div className="flex items-center space-x-3 pt-8">
                  <input
                    type="checkbox"
                    name="icu_available"
                    checked={formData.icu_available}
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
                    name="emergency_services"
                    checked={formData.emergency_services}
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
                  name="admin_name"
                  value={formData.admin_name}
                  onChange={handleInputChange}
                  placeholder="Enter admin name"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.admin_name ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.admin_name && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.admin_name}
                  </p>
                )}
              </div>
              
              <div>
                <label className="block text font-medium text-gray-700 mb-2">
                  Admin Mobile Number *
                </label>
                <input
                  type="tel"
                  name="admin_mobile_number"
                  value={formData.admin_mobile_number}
                  onChange={handleInputChange}
                  placeholder="+91 9876543210"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.admin_mobile_number ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.admin_mobile_number && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.admin_mobile_number}
                  </p>
                )}
              </div>
              
              <div className="md:col-span-2">
                <label className="block text font-medium text-gray-700 mb-2">
                  Set Password *
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a secure password"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.password ? 'border-red-500' : 'border-gray-200'
                  }`}
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" /> {errors.password}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
              } text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 hover:scale-105 transform shadow-lg hover:shadow-xl flex items-center space-x-2`}
            >
              {loading ? (
                <>
                  <Loader className="h-5 w-5 animate-spin" />
                  <span className='pl-4'>Registering...</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5" />
                  <span className='pl-4'>Register Hospital</span>
                </>
              )}
            </button>
          </div>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegistrationForm;