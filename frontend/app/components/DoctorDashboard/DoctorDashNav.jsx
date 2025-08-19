"use client";
import React, { useState } from "react";
import DoctorDashboardSidebar from "./DoctorDashSidebar";
import {
  Calendar,
  ChevronDown,
  Menu,
  Bell,
  User,
  Settings,
  LogOut,
  Stethoscope,
} from "lucide-react";
import Link from 'next/link'

// Responsive Sidebar Wrapper

// Enhanced Navbar Component
const DoctorDashboardNavbar = ({ collapsed, setSidebarOpen }) => {
  const [profileDropdown, setProfileDropdown] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);

  const patientData = {
    name: "Dr.Baloji..",
    role: "Physician",
    avatar: "BJ",
    lastVisit: "Today, 2:30 PM",
  };
      const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setProfileDropdown(false);
        }
    };

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100/50 rounded-3xl shadow-lg transition-all duration-300 sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left section */}
          <div className="flex items-center space-x-6">
            {/* Hamburger for mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:block lg:hidden p-2 rounded hover:bg-gray-100"
            >
              <Menu className="h-6 w-6 text-gray-600" />
            </button>

            {/* Greeting */}
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-gray-800 font-semibold">Hello,  </span>
              <span className="text-gray-800 font-semibold pl-2">
                {patientData.name}
              </span>
              {/*Need too add animation */}
              <span className="text-2xl pl-3">👋</span>
            </div>
          </div>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            {/* Quick Stats */}
            

            {/* Notifications Need to add Animation*/}
            <div className="relative pl-4 pr-4">
              <button className="relative p-3 bg-gray-50/50 hover:bg-gray-100/50 rounded-2xl transition-all duration-300 hover:scale-105 group">
                <Bell className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg">
                    {notificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdown(!profileDropdown)}
                className="flex items-center space-x-3 p-2 hover:bg-gray-50/50 rounded-2xl transition-all duration-300 hover:scale-105 group"
              >
                {/* Avatar */}
                <div className="relative pr-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                    {patientData.avatar}
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>

                {/* Info */}
                <div className="hidden pr-3 md:flex flex-col items-start">
                  <span className="text-md sm:text-sm font-semibold text-gray-800">
                    {patientData.name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {patientData.role}
                  </span>
                </div>

                <ChevronDown
                  className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${profileDropdown ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown */}
               {profileDropdown && (
               <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:block lg:hidden transition-all duration-300"
                    onClick={handleOverlayClick}
                    aria-hidden="true"
                />)}
              {profileDropdown && (
                
                <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/50 py-2 z-50">
                  <div className="px-4 py-3 border-b border-gray-100/50">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center font-bold text-white shadow-lg">
                        {patientData.avatar}
                      </div>
                      <div className="pl-4 md:pl-4">
                        <p className="font-semibold text-gray-800">
                          {patientData.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {patientData.role}
                        </p>
                        <p className="text-xs text-gray-400">
                          Last visit: {patientData.lastVisit}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="py-2">
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors">
                      <User className="h-4 w-4 mr-3" />
                      View Profile
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors">
                      <Settings className="h-4 w-4 mr-3" />
                      Settings
                    </button>
                    <button className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50/50 transition-colors">
                      <Stethoscope className="h-4 w-4 mr-3" />
                      Medical Records
                    </button>
                    <div className="border-t border-gray-100/50 mt-2 pt-2">
                    <Link href='/auth/register/patient'>
                      <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50/50 transition-colors">
                        <LogOut className="h-4 w-4 mr-3" />
                        Sign Out
                      </button>
                      </Link>
                    </div>
                  </div>
                </div>
                
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default DoctorDashboardNavbar;
