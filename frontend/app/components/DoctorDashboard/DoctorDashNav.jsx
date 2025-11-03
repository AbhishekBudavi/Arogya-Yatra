"use client";

import React, { useEffect, useState, useRef } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { api } from "app/utils/api";

const DoctorDashboardNavbar = ({ setSidebarOpen }) => {
  const [notificationCount, setNotificationCount] = useState(3);
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch Doctor Dashboard Data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/dashboard/doctor", { withCredentials: true });
        setDoctorData(res.data.doctor || res.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        setError("Failed to load doctor dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // ✅ Loading & Error States
  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );

  if (!doctorData)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">No doctor data found.</p>
      </div>
    );

  const { doctor_name, specialization, lastVisit } = doctorData;

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 rounded-3xl shadow-md sticky top-0 z-40">
      <div className="px-6 py-4 flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-6">
          {/* Mobile Menu */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>

          {/* Greeting */}
          <div className="hidden md:flex items-center space-x-2">
            <span className="text-gray-800 font-semibold">
              Hello, Dr. {doctor_name}
            </span>
            <span className="text-2xl pl-2 animate-bounce">👋</span>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-2 px-2">
          {/* Notifications */}
          <div className="relative">
            <button className="relative p-3 bg-gray-50 hover:bg-gray-100 rounded-2xl transition duration-300 hover:scale-105">
              <Bell className="h-5 w-5 text-gray-600" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow">
                  {notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* Profile Dropdown */}
          <ProfileDropdown doctor={{ doctor_name, specialization, lastVisit }} />
        </div>
      </div>
    </nav>
  );
};

// ✅ Reusable Profile Dropdown Component
const ProfileDropdown = ({ doctor }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const generateAvatar = (name) => {
    if (!name) return "DR";
    return name
      .split(" ")
      .map((word) => word[0]?.toUpperCase())
      .join("")
      .slice(0, 3);
  };

  const avatar = generateAvatar(doctor.doctor_name);

  // ✅ Close on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative px-4" ref={dropdownRef}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-2xl transition-all duration-300 hover:scale-105"
      >
        {/* Avatar */}
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow">
            {avatar}
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
        </div>

        {/* Info */}
        <div className="hidden md:flex flex-col items-start">
          <span className="text-sm font-semibold text-gray-800">
            {doctor.doctor_name}
          </span>
          <span className="text-xs text-gray-500">
            {doctor.specialization || "Doctor"}
          </span>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 py-2 z-50">
          <div className="px-4 py-3 border-b border-gray-100/50 flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow">
              {avatar}
            </div>
            <div>
              <p className="font-semibold text-gray-800">{doctor.doctor_name}</p>
              <p className="text-sm text-gray-500">
                {doctor.specialization || "Physician"}
              </p>
              <p className="text-xs text-gray-400">
                Last visit: {doctor.lastVisit || "N/A"}
              </p>
            </div>
          </div>

          {/* Menu Options */}
          <div className="border-t border-gray-100 mt-2 pt-2">
            <Link href="/auth/login/doctor">
              <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition">
                <LogOut className="h-4 w-4 mr-3" /> Sign Out
              </button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboardNavbar;
