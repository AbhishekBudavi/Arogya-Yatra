'use client';
import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

const MobileLogin = () => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleInput = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setMobile(value);

    if (value.length === 10) {
      setIsButtonEnabled(true);
      setError('');
    } else {
      setIsButtonEnabled(false);
      setError('Please enter a valid 10-digit mobile number.');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save mobile number to sessionStorage
    sessionStorage.setItem('phone', mobile);

    // Check if current route is for registration or login
    const isRegistration = pathname.includes('/auth/register');
    const source = isRegistration ? 'register' : 'login';
console.log("Hello World")
    // Navigate to OTP page with source and phone in query params
    router.push(`/auth/otp?source=${source}&phone=${mobile}`);
  };

  return (
    <section className="mt-10 flex justify-center items-center min-h-screen bg-[#F2EFFE] px-2 sm:px-4 md:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg pt-8 px-4 sm:pt-10 sm:px-8 md:px-10 pb-6 sm:pb-8 tracking-wide">
        <h4 className="text-[20px] sm:text-[23px] font-semibold mb-2 text-black tracking-wide">
          Login or Create Account
        </h4>
        <p className="text-[13px] sm:text-[14px] text-gray-500 mb-6">
          Enter your mobile number to proceed
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-5">
            <div
              className={`flex h-[44px] sm:h-[50px] items-center border-2 rounded-lg overflow-hidden transition-colors duration-200 ${
                isFocused
                  ? 'outline-2 outline-purple-600 border-purple-600'
                  : 'border-gray-200'
              }`}
            >
              <span className="px-3 sm:px-4 py-2 border-r-2 border-gray-400 bg-white text-gray-600 font-semibold whitespace-nowrap text-sm sm:text-base">
                +91
              </span>
              <input
                type="tel"
                className="flex-1 px-3 sm:px-4 py-2 outline-none bg-white text-base"
                value={mobile}
                onChange={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="Mobile Number"
                maxLength={10}
                required
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </div>
            {error && (
              <small className="text-red-500 mt-2 block">{error}</small>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-lg transition-colors duration-200 ${
              isButtonEnabled
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-purple-200 cursor-not-allowed text-white'
            }`}
            disabled={!isButtonEnabled}
          >
            Continue
          </button>

          <p className="text-xs sm:text-xs text-gray-500 mt-4">
            By continuing, I agree to the{' '}
            <a
              href="https://www.digilocker.gov.in/web/about/tos"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 underline font-medium"
            >
              Terms of Services
            </a>
          </p>
        </form>

        <div className="mt-6">
          <p className="text-xs sm:text-sm text-gray-500">
            Facing trouble?{' '}
            <a
              href="/v3/aadhaar"
              className="text-purple-600 underline ml-1 font-medium"
            >
              Try using Aadhaar Number
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default MobileLogin;
