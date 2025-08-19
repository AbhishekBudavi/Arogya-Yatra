'use client';
import React, { useState, useEffect } from 'react';
import DoctorDashboardSidebar from '../../../components/DoctorDashboard/DoctorDashSidebar'
import DoctorDashboardNavbar from '../../../components/DoctorDashboard/DoctorDashNav'
import Breadcrumb from '../../../components/patientdashboard/Breadcrumb';

export default function PatientDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('QR Code');

  // Prevent scrolling when sidebar is open on mobile
  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [sidebarOpen]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1 min-h-screen bg-gray-50">
        {/* Sidebar */}
        <DoctorDashboardSidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-50 bg-opacity-40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        {/* Main content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Top Navigation */}
          <div className="pl-6">
            <DoctorDashboardNavbar
              collapsed={collapsed}
              setSidebarOpen={setSidebarOpen}
              sidebarOpen={sidebarOpen}
            />
          </div>

          {/* Breadcrumb */}
          <Breadcrumb />

          {/* Page Content */}
          <main className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
