'use client'
import React, { useState } from 'react';
import Sidebar from '../../../components/patientdashboard/Sidebar';
import Navbar from '../../../components/patientdashboard/nav-main';
import Breadcrumb from '../../../components/patientdashboard/Breadcrumb'

export default function PatientDashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [activeItem, setActiveItem] = useState('QR Code');

  // Prevent scrolling when sidebar is open on mobile
  React.useEffect(() => {
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
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeItem={activeItem}
          setActiveItem={setActiveItem}
        />

        {/* Overlay for mobile when sidebar is open */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-gray-50 bg-opacity-40 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          />
        )}

        {/* Main Content Area */}
        <div className="flex flex-col flex-1 overflow-hidden px-6">
          {/* Top Navigation */}
          <div className='pl-6'>
          <Navbar
            collapsed={collapsed}
            setSidebarOpen={setSidebarOpen}
            sidebarOpen={sidebarOpen}
            
          />
          </div>
             <Breadcrumb />
          <main className="flex-1 overflow-y-auto px-6 py-6">
            
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}