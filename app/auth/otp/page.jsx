'use client'
import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
const OTPVerification = () => {
    const router = useRouter();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(108); // 01:48 = 108 seconds
    const [isResendDisabled, setIsResendDisabled] = useState(true);
    const inputRefs = useRef([]);

    // Timer countdown effect
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

    // Format timer display
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    // Handle OTP input change
    const handleOtpChange = (index, value) => {
        if (value.length > 1) return; // Prevent multiple characters
        
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    // Handle backspace
    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    // Handle paste
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

    // Handle verify
    const handleVerify = () => {
        const otpValue = otp.join('');
        if (otpValue.length === 6) {
            console.log('OTP:', otpValue);
            // Add your verification logic here
             router.push('/auth/patientdetail'); 
        }
    };

    // Handle resend OTP
    const handleResendOtp = () => {
        setTimer(108);
        setIsResendDisabled(true);
        setOtp(['', '', '', '', '', '']);
        console.log('Resending OTP...');
        // Add your resend logic here
    };

    const isVerifyDisabled = otp.some(digit => digit === '');

    return (
        <div className='mt-8 sm:mt-12'>
            <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4">
                <div className="w-full max-w-xs sm:max-w-md">
                    {/* Main Card */}
                    <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-8 relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute top-0 right-0 w-20 h-20 sm:w-32 sm:h-32 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full -translate-y-8 sm:-translate-y-16 translate-x-8 sm:translate-x-16 opacity-50"></div>
                        
                        {/* Header */}
                        <div className="text-center mb-6 sm:mb-8">
                            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">Verify OTP</h1>
                            <p className="text-gray-900 text-xs sm:text-sm leading-relaxed mt-3 sm:mt-4">
                                Please enter One Time Password (OTP) sent on your<br className="hidden sm:block" />
                                mobile number (<span className="font-medium">*****2288</span>)
                            </p>
                        </div>

                        {/* OTP Input Fields */}
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

                            {/* Resend Timer */}
                            <div className="text-center mt-2">
                                <p className="text-xs sm:text-sm text-gray-600">
                                    Resend OTP in{' '}
                                    <span className="font-semibold text-purple-600">
                                        {formatTime(timer)}
                                    </span>
                                </p>
                            </div>
                        </div>

                        {/* Verify Button */}
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

                        {/* Instructions */}
                        <div className="mt-4 sm:mt-6 text-center ">
                            <p className="text-xs sm:text-[14px] text-gray-500 mb-2 sm:mb-3">
                                Wait few minutes for the OTP, do not refresh or close!
                            </p>
                            
                            {/* Resend Link */}
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
                                    Try using Aadhar
                                </button>
                            </p>
                        </div>
                    </div>

                    {/* Additional Action */}
                    <div className="mt-4 sm:mt-6 text-center">
                        <button
                            onClick={handleResendOtp}
                            disabled={isResendDisabled}
                            className={`text-sm sm:text-[16px] font-medium transition-colors duration-200 ${
                                isResendDisabled
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-purple-600 hover:text-purple-700 hover:underline'
                            }`}
                        >
                            Didn't receive OTP? Resend
                        </button>
                    </div>
                </div>

                {/* Accessibility Button (from screenshot) */}
                
            </div>
        </div>
    );
};

export default OTPVerification;
