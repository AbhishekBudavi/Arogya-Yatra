'use client';
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '../../../utils/api'
export default function OTPVerification() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const phone = searchParams.get('phone') || sessionStorage.getItem('phone');
  const source = searchParams.get('source') || 'login';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(108);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const inputRefs = useRef([]);

  // ⏱️ Timer countdown
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setIsResendDisabled(false);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newOtp = [...otp];
    for (let i = 0; i < pastedData.length && i < 6; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newOtp[i] = pastedData[i];
      }
    }
    setOtp(newOtp);
  };

 const handleVerify = async () => {
  const otpValue = otp.join('');
  if (otpValue.length === 6) {
    try {
      const response = await api.post('/patient/verify-otp', {
        mobile: phone,
        otp: otpValue,
      });

      // OTP verified successfully
      if (response.status === 200) {
        console.log('OTP Verified Successfully!');

        // Redirect depending on source
        if (source === 'register') {
          router.push(`/auth/patientdetail/?phone=${phone}`);
        } else {
          router.push(`/auth/login/select-patient?phone=${phone}`);
        }
      } 
    } catch (error) {
      console.error('OTP verification error:', error.response?.data || error);
      alert(error.response?.data?.error || 'OTP verification failed.');
    }
  }
};


 const handleResendOtp = async () => {
  setOtp(['', '', '', '', '', '']);
  setTimer(108);
  setIsResendDisabled(true);

  try {
    const response = await api.post('/patient/send-otp', { mobile: phone });
    if (response.success) {
      alert('OTP resent successfully');
    } else {
      alert(response.message || 'Failed to resend OTP');
      setIsResendDisabled(false);
    }
  } catch (err) {
    console.error('Resend OTP error:', err);
    setIsResendDisabled(false);
  }
};

  const isVerifyDisabled = otp.some(digit => digit === '');

  return (
    <div className="mt-8 sm:mt-12">
      <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4">
        <div className="w-full max-w-xs sm:max-w-md">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full -translate-y-8 sm:-translate-y-16 translate-x-8 sm:translate-x-16 opacity-50"></div>

            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Verify OTP</h1>
              <p className="text-gray-900 text-xs sm:text-sm leading-relaxed mt-3 sm:mt-4">
                Enter the OTP sent to your mobile number <br className="hidden sm:block" />
                (<span className="font-medium">*****{phone?.slice(-4)}</span>)
              </p>
            </div>

            <div className="mb-4 sm:mb-6">
              <div className="flex justify-center gap-2 sm:gap-3">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    ref={el => inputRefs.current[index] = el}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={handlePaste}
                    className="w-9 h-9 sm:w-12 sm:h-12 md:w-14 md:h-14 text-center text-lg sm:text-xl font-semibold border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-purple-500 focus:ring-3 focus:ring-purple-500 focus:outline-none transition-all duration-200 bg-gray-50 focus:bg-white"
                  />
                ))}
              </div>

              <div className="text-center mt-2">
                <p className="text-xs sm:text-sm text-gray-600">
                  Resend OTP in{' '}
                  <span className="font-semibold text-purple-600">
                    {formatTime(timer)}
                  </span>
                </p>
              </div>
            </div>

            <button
              onClick={handleVerify}
              disabled={isVerifyDisabled}
              className={`w-full py-3 sm:py-4 rounded-xl sm:rounded-2xl font-semibold text-base sm:text-lg transition-all duration-200 ${
                isVerifyDisabled
                  ? 'bg-purple-200 text-white cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:from-purple-600 hover:to-blue-600 active:scale-95 shadow-lg hover:shadow-xl'
              }`}
            >
              Verify
            </button>

            <div className="mt-4 sm:mt-6 text-center">
              <p className="text-xs sm:text-sm text-gray-500 mb-2 sm:mb-3">
                Wait a few minutes for the OTP. Please do not refresh or close!
              </p>

              <p className="text-xs sm:text-sm text-gray-600">
                Facing trouble?{' '}
                <button
                  onClick={handleResendOtp}
                  disabled={isResendDisabled}
                  className={`font-medium transition-colors duration-200 ${
                    isResendDisabled
                      ? 'text-gray-400 cursor-not-allowed'
                      : 'text-blue-500 hover:text-blue-600 hover:underline'
                  }`}
                >
                  Try using Aadhaar
                </button>
              </p>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 text-center">
            <button
              onClick={handleResendOtp}
              disabled={isResendDisabled}
              className={`text-sm sm:text-base font-medium transition-colors duration-200 ${
                isResendDisabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-purple-600 hover:text-purple-700 hover:underline'
              }`}
            >
              Didn't receive OTP? Resend
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
