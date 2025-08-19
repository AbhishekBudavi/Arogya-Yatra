"use client";
import React, { useState } from "react";
import { Eye, EyeOff, Lock, User, Stethoscope, Heart } from "lucide-react";
import Link from "next/link";

const DoctorLogin = () => {
  const [doctorId, setDoctorId] = useState("");
  const [password, setPassword] = useState("");
  const [isFocused, setIsFocused] = useState({ id: false, pass: false });
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!doctorId || !password) {
      setError("Please fill in all fields.");
      return;
    }

    // 🔐 You can call your API here
    console.log("Doctor ID:", doctorId);
    console.log("Password:", password);

    setError("");
    // Navigate or handle login logic here
  };

  return (
    <section className="mt-10 flex justify-center items-center min-h-screen bg-[#F2EFFE] px-2 sm:px-4 md:px-8">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg pt-8 px-4 sm:pt-10 sm:px-8 md:px-10 pb-6 sm:pb-8 tracking-wide">
        <div className="w-full max-w-md relative z-10">
          {/* Header Card */}
          <div>
            <div className="text-center mb-6">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <Stethoscope className="w-10 h-10 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Doctor Portal
              </h1>
              <p className="text-gray-600 text-sm">
                Secure access to your medical dashboard
              </p>
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            {/* Doctor ID Field */}
            <div className="mb-4">
              <div className="space-y-2">
                <label className="text-sm pb-2 pl-1 font-bold text-gray-700 flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Doctor ID
                </label>

                <div
                  className={`flex h-[44px] sm:h-[50px] items-center border-2 rounded-lg overflow-hidden transition-colors duration-200 ${
                    isFocused.id
                      ? "outline-2 outline-purple-600 border-purple-600"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="text"
                    className="w-full px-3 sm:px-4 py-2 outline-none bg-white text-base"
                    placeholder="Enter your doctor id"
                    value={doctorId}
                    onChange={(e) => setDoctorId(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, id: true })}
                    onBlur={() => setIsFocused({ ...isFocused, id: false })}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Password Field */}
            <div className="mb-5">
              <div className="space-y-2">
                <label className="text-sm pb-2 pl-1 font-bold text-gray-700 flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Password
                </label>
                <div
                  className={`flex h-[44px] sm:h-[50px] items-center border-2 rounded-lg overflow-hidden transition-colors duration-200 ${
                    isFocused.pass
                      ? "outline-2 outline-purple-600 border-purple-600"
                      : "border-gray-200"
                  }`}
                >
                  <input
                    type="password"
                    className="w-full px-3 sm:px-4 py-2 outline-none bg-white text-base"
                    placeholder="Enter your Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setIsFocused({ ...isFocused, pass: true })}
                    onBlur={() => setIsFocused({ ...isFocused, pass: false })}
                    required
                  />
                </div>
                {error && (
                  <small className="text-red-500 mt-2 block">{error}</small>
                )}
              </div>
            </div>
            <Link href="/dashboard/doctor">
              <button
                type="submit"
                className={`w-full py-2 sm:py-3 text-base sm:text-lg font-semibold rounded-lg transition-colors duration-200 bg-blue-600 hover:bg-blue-700 text-white`}
              >
                Login
              </button>
            </Link>
            <p className="text-xs sm:text-xs text-gray-500 mt-4 text-center">
              Forgot password?{" "}
              <a href="#" className="text-purple-600 underline font-medium">
                Reset here
              </a>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default DoctorLogin;
