'use client';
import React, { useState } from 'react';
import { Building2, Lock, User } from 'lucide-react';
import Link from 'next/link';

const HospitalLogin = () => {
  const [hospitalId, setHospitalId] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isFocused, setIsFocused] = useState({ id: false, pass: false });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!hospitalId || !adminPassword) {
      setError('Please fill in all fields.');
      return;
    }

    console.log('Hospital ID:', hospitalId);
    console.log('Admin Password:', adminPassword);

    setError('');
    // ⬇️ Call your login API or handle redirection here
  };

  return (
    <section className="mt-10 flex justify-center items-center min-h-screen bg-[#F2EFFE] px-2 sm:px-4 md:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg pt-8 px-4 sm:pt-10 sm:px-8 md:px-10 pb-6 sm:pb-8 tracking-wide">
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Building2 className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Hospital Portal</h1>
          <p className="text-gray-600 text-sm">Secure login for hospital administrators</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Hospital ID */}
          <div className="mb-4">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
              <User className="w-4 h-4" />
              Hospital ID
            </label>
            <div className={`flex h-[44px] sm:h-[50px] items-center border-2 rounded-lg overflow-hidden transition duration-200 ${isFocused.id ? 'outline-2 outline-purple-600 border-purple-600' : 'border-gray-200'}`}>
              <input
                type="text"
                value={hospitalId}
                onChange={(e) => setHospitalId(e.target.value)}
                onFocus={() => setIsFocused({ ...isFocused, id: true })}
                onBlur={() => setIsFocused({ ...isFocused, id: false })}
                placeholder="Enter Hospital ID"
                className="w-full px-4 py-2 outline-none bg-white text-base"
                required
              />
            </div>
          </div>

          {/* Admin Password */}
          <div className="mb-5">
            <label className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-2">
              <Lock className="w-4 h-4" />
              Admin Password
            </label>
            <div className={`flex h-[44px] sm:h-[50px] items-center border-2 rounded-lg overflow-hidden transition duration-200 ${isFocused.pass ? 'outline-2 outline-purple-600 border-purple-600' : 'border-gray-200'}`}>
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                onFocus={() => setIsFocused({ ...isFocused, pass: true })}
                onBlur={() => setIsFocused({ ...isFocused, pass: false })}
                placeholder="Enter Admin Password"
                className="w-full px-4 py-2 outline-none bg-white text-base"
                required
              />
            </div>
            {error && <small className="text-red-500 mt-2 block">{error}</small>}
          </div>

          <button
            type="submit"
            className="w-full py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition duration-200"
          >
            Login
          </button>

          <p className="text-xs sm:text-xs text-gray-500 mt-4 text-center">
            Forgot password?{' '}
            <a href="#" className="text-purple-600 underline font-medium">
              Reset here
            </a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default HospitalLogin;
