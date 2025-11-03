'use client';
import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  User,
  CreditCard,
  Stethoscope,
  MapPin,
  UserPlus,
  CheckCircle,
  Lock,
  Hospital,
  CheckCircle2,
  SuccessMessage
} from 'lucide-react';
import { api } from '../../../../utils/api';
// const specializations = [
//   { value: '', label: 'Select your specialization' },
//   { value: 'general-physician', label: 'General Physician' },
//   { value: 'cardiologist', label: 'Cardiologist' },
//   { value: 'dermatologist', label: 'Dermatologist' },
//   { value: 'pediatrician', label: 'Pediatrician' },
//   { value: 'neurologist', label: 'Neurologist' },
//   { value: 'orthopedic', label: 'Orthopedic Surgeon' },
//   { value: 'gynecologist', label: 'Gynecologist' },
//   { value: 'psychiatrist', label: 'Psychiatrist' },
//   { value: 'oncologist', label: 'Oncologist' },
// ];

const initialForm = {
  
  doctor_id: '',
  doctor_name: '',
  // hospitalName:'',
  // specialization: '',
  // address: '',

  password: '',
  confirmPassword: '',
  about_me:'',
};

function isStrongPassword(password) {
  // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_\-+=])[A-Za-z\d@$!%*?&#^()_\-+=]{8,}$/.test(password);
}

export default function DoctorRegistrationForm() {
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.doctor_name.trim()) newErrors.doctorName = 'Doctor name is required';
    else if (formData.doctor_name.trim().length < 2) newErrors.doctorName = 'Minimum 2 characters';

    if (!formData.doctor_id.trim()) newErrors.doctorId = 'Doctor ID is required';
    else if (formData.doctor_id.trim().length < 5) newErrors.doctorId = 'Minimum 5 characters';

    // if (!formData.specialization) newErrors.specialization = 'Select a specialization';

    //  if (!formData.hospitalName.trim()) newErrors.hospitalName = 'hospitalName is required';
    // else if (formData.hospitalName.trim().length < 10) newErrors.hospitalName = 'Please provide a full hospitalName';

    // if (!formData.address.trim()) newErrors.address = 'Address is required';
    // else if (formData.address.trim().length < 10) newErrors.address = 'Please provide a full address';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (!isStrongPassword(formData.password))
      newErrors.password =
        'Password must be at least 8 characters, include uppercase, lowercase, number, and special character';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    return newErrors;
  };

const handleSubmit = async (e) => { 
  e.preventDefault();
  if (!validateForm()) return;

  setIsLoading(true);
  setErrors({});

  try {
    const { confirmPassword, ...payload } = formData; // remove confirmPassword
    const { data } = await api.post(
      '/doctor/register',
      payload,
      {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true, 
      }
    );

    console.log('Registration successful:', data);
    setIsSubmitted(true);

    setTimeout(() => {
      router.push('/auth/login/doctor');
    }, 1000);

  } catch (error) {
    console.error('Registration error:', error.response?.data || error.message);

    setErrors({
      submit: error.response?.data?.message || 'Failed to register. Please try again.',
    });
  } finally {
    setIsLoading(false);
  }
};

function SuccessMessage({ onReset }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center animate-fade-in">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4 animate-bounce" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Registration Successful!
        </h2>
        <p className="text-gray-600 mb-6">
          Your profile has been created successfully.
        </p>
        
        
      </div>
    </div>
  );
}


  if (isSubmitted) {
   
    if (isSubmitted) {
    return <SuccessMessage onReset={() => {
      setFormData(FormData);
      setIsSubmitted(false);
      setActiveSection("personal");
      setErrors({});
    }} />;
  }
  }

  return (
    <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto pt-24 lg:pt-28 px-4 sm:px-6 md:px-8 pb-24 font-inter">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-blue-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-6 md:px-10 md:py-10">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-white flex items-center gap-3">
            <Stethoscope className="h-6 w-6 lg:h-8 lg:w-8" />
            Doctor Registration
          </h1>
          <p className="text-blue-100 mt-2 text-sm md:text-base">Join our network and connect with patients</p>
        </div>

        {/* Form */}
        <form className="p-6 sm:p-8 md:p-10 lg:p-12"  onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-6">
            {/* Doctor Name */}
          

            {/* Doctor ID */}
            <Field
              label="Doctor ID"
              name="doctor_id"
              value={formData.doctor_id}
              onChange={handleInputChange}
              placeholder="Registration or license number"
              icon={<CreditCard className="h-5 w-5 text-blue-500" />}
              error={errors.doctorId}
            />
              <Field
              label="Doctor Name"
              name="doctor_name"
              value={formData.doctor_name}
              onChange={handleInputChange}
              placeholder="Enter full name"
              icon={<User className="h-5 w-5 text-blue-500" />}
              error={errors.doctorName}
            />

            {/* Password */}
            <Field
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Create a strong password"
              icon={<Lock className="h-5 w-5 text-blue-500" />}
              error={errors.password}
            />

            {/* Confirm Password */}
            <Field
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Re-enter your password"
              icon={<Lock className="h-5 w-5 text-blue-500" />}
              error={errors.confirmPassword}
            /> 
{/*             
             <Field
              label="Hospital Name"
              name="hospitalName"
              value={formData.hospitalName}
              onChange={handleInputChange}
              placeholder="Valid Hospital Name"
              icon={<Hospital className="h-5 w-5 text-blue-500" />}
              error={errors.hospitalName}
            /> */}


            {/* Specialization */}
            {/* <div>
              <label htmlFor="specialization" className="block text-base font-semibold text-gray-700 mb-1">
                Specialization
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Stethoscope className="h-5 w-5 text-blue-500" />
                </span>
                <select
                  id="specialization"
                  name="specialization"
                  value={formData.specialization}
                  onChange={handleInputChange}
                  className={`w-full pl-11 pr-10 py-2.5 border-2 rounded-lg text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer ${
                    errors.specialization
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
                  }`}
                >
                  {specializations.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.value === ''}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <span className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </span>
              </div>
              {errors.specialization && (
                <p className="text-red-600 text-xs mt-1" role="alert">
                  {errors.specialization}
                </p>
              )}
            </div> */}

            {/* Address */}
            {/* <div>
              <label htmlFor="address" className="block text-base font-semibold text-gray-700 mb-1">
                Address
              </label>
              <div className="relative">
                <span className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                  <MapPin className="h-5 w-5 text-blue-500" />
                </span>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Clinic or hospital address"
                  rows={3}
                  className={`w-full pl-11 pr-4 py-2.5 border-2 rounded-lg text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                    errors.address
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.address && (
                <p className="text-red-600 text-xs mt-1" role="alert">
                  {errors.address}
                </p>
              )}
            </div> */}

            <div>
              <label htmlFor="address" className="block text-base font-semibold text-gray-700 mb-1">
             About Me
              </label>
              <div className="relative">
                <span className="absolute top-3 left-0 pl-3 flex items-start pointer-events-none">
                  <User className="h-5 w-5 text-blue-500" />
                </span>
                <textarea
                  id="aboutYou"
                  name="about_me"
                  value={formData.about_me}
                  onChange={handleInputChange}
                  placeholder="On your Specialization"
                  rows={3}
                  className={`w-full pl-11 pr-4 py-2.5 border-2 rounded-lg text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical ${
                    errors.address
                      ? 'border-red-300 bg-red-50'
                      : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
                  }`}
                />
              </div>
              {errors.address && (
                <p className="text-red-600 text-xs mt-1" role="alert">
                  {errors.address}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="mt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-blue-300 focus:ring-opacity-50 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5" />
                    Register
                  </>
                )}
              </button>
            </div>

            {/* Submit Error */}
            {errors.submit && (
              <div className="text-red-600 text-xs text-center bg-red-50 border border-red-200 rounded-lg p-2" role="alert">
                {errors.submit}
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}

// 📦 Reusable Input Field Component
const Field = ({ label, name, value, onChange, placeholder, icon, error, type = 'text' }) => (
  <div>
    <label htmlFor={name} className="block text-base font-semibold text-gray-700 mb-1">
      {label}
    </label>
    <div className="relative">
      <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">{icon}</span>
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full pl-11 pr-4 py-2.5 border-2 rounded-lg text-base transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-300 bg-red-50' : 'border-gray-200 hover:border-blue-300 focus:border-blue-500'
        }`}
        aria-describedby={error ? `${name}-error` : undefined}
        autoComplete={type === 'password' ? 'new-password' : undefined}
      />
    </div>
    {error && (
      <p id={`${name}-error`} className="text-red-600 text-xs mt-1" role="alert">
        {error}
      </p>
    )}
  </div>
);