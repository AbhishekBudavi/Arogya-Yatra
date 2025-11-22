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
    
  
          <main className="flex-1 overflow-y-auto px-6 py-6">
            {children}
          </main>
</div>
 
  );
}
