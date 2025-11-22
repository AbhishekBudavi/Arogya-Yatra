'use client'
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, LogOut, Moon, Sun, Bell, Home, Building2, Bed, Users, User, Calendar } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { hospitalAPI } from '../../utils/api';
import DashboardOverview from '../../components/HospitalDashboard/DashboardOverview';
import DepartmentManagement from '../../components/HospitalDashboard/DepartmentManagement';
import BedManagement from '../../components/HospitalDashboard/BedManagement';
import DoctorManagement from '../../components/HospitalDashboard/DoctorManagement';
import PatientRecords from '../../components/HospitalDashboard/PatientRecords';
import AppointmentScheduling from '../../components/HospitalDashboard/AppointmentScheduling';

export default function HospitalDashboardPage() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [theme, setTheme] = useState('light');
  const [hospitalData, setHospitalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);
const mainRef = useRef(null);
  const menuItems = [
    { id: 'overview', label: 'Dashboard Overview', icon: Home },
    { id: 'departments', label: 'Departments', icon: Building2 },
    { id: 'beds', label: 'Bed Management', icon: Bed },
    { id: 'doctors', label: 'Doctors', icon: Users },
    { id: 'patients', label: 'Patients', icon: User },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
  ];
const scrollMainToTop = useCallback(() => {
    const el = mainRef.current;
    if (!el) return;
    try {
      // try smooth scroll
      el.scrollTo({ top: 0, behavior: 'smooth' });
      // ensure we end at top after rendering (some children measure/layout)
      requestAnimationFrame(() => {
        el.scrollTo({ top: 0, behavior: 'smooth' });
        setTimeout(() => el.scrollTo({ top: 0, behavior: 'instant' }), 120);
      });
    } catch (e) {
      // fallback
      el.scrollTop = 0;
    }
  }, []);

  // When activeTab changes, ensure scroll happens after render
  useEffect(() => {
    // small delay to allow child render/height changes
    const t = setTimeout(() => scrollMainToTop(), 30);
    console.log("Active tab changed", activeTab)
    return () => clearTimeout(t);
  }, [activeTab, scrollMainToTop]);

  // Use this handler for clicks so we can also early scroll if desired
  const handleTabClick = (id) => {
    if (id === activeTab) {
      // If clicking already active tab, still scroll to top
      scrollMainToTop();
      return;
    }
    setActiveTab(id);
    // Optional: scroll immediately while content updates
    // (the effect above will also run after state update)
    // small immediate attempt:
    requestAnimationFrame(() => {
      scrollMainToTop();
    });
  };

  // Fetch hospital data on component mount
  useEffect(() => {
    const fetchHospitalData = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await hospitalAPI.getDashboard();
        console.log('Hospital data fetched:', response);
        setHospitalData(response.data);
      } catch (err) {
        console.error('Failed to fetch hospital data:', err);
        setError(err.message || 'Failed to load hospital dashboard');
        // Redirect to login if unauthorized
        if (err.message?.includes('401') || err.message?.includes('Unauthorized')) {
          setTimeout(() => router.push('/auth/login/hospital'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchHospitalData();
  }, [router]);
console.log("HospitalName:",hospitalData?.hospital_name)

  // Load theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('hospitalTheme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('hospitalTheme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const handleLogout = async () => {
    try {
      await hospitalAPI.logout();
      localStorage.removeItem('hospitalToken');
      setToast({ message: 'Logged out successfully', type: 'success' });
      setTimeout(() => router.push('/auth/login/hospital'), 1500);
    } catch (err) {
      setToast({ message: 'Logout failed', type: 'error' });
      console.error('Logout error:', err);
    }
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 5000);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold mb-4">{error}</p>
          <button
            onClick={() => router.push('/auth/login/hospital')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Return to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg text-white shadow-lg flex items-center gap-2 ${
          toast.type === 'success' ? 'bg-green-500' : 
          toast.type === 'error' ? 'bg-red-500' : 
          'bg-blue-500'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'w-64' : 'w-0'
          } bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 overflow-hidden flex flex-col`}
        >
          {/* Hospital Info */}
          <div className="p-3 border-b dark:border-gray-700">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">
                  {hospitalData?.hospital_name || 'Hospital'}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {hospitalData?.custom_hospital_id || 'ID'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t dark:border-gray-700 space-y-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <header className="bg-white dark:bg-gray-800 shadow-md border-b dark:border-gray-700">
            <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
              {/* Left Section */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Toggle sidebar"
                >
                  {sidebarOpen ? (
                    <X className="w-6 h-6 text-gray-900 dark:text-white" />
                  ) : (
                    <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
                  )}
                </button>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {hospitalData?.hospital_name || 'Hospital Dashboard'}
                </h1>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-3 md:gap-4">
                {/* Notifications */}
                <button className="relative p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                  <Bell className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? (
                    <Moon className="w-6 h-6 text-gray-600" />
                  ) : (
                    <Sun className="w-6 h-6 text-yellow-500" />
                  )}
                </button>

                {/* User Profile */}
                <div className="flex items-center gap-3 pl-3 border-l dark:border-gray-700">
                  <div className="hidden md:block text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {hospitalData?.admin_name || 'Admin'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                  </div>
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {hospitalData?.admin_name?.charAt(0) || 'A'}
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
                <main
        ref={mainRef}
        className="flex-1 overflow-auto bg-gray-50 dark:bg-gray-900"
      >

            <div className="p-4 md:p-6 lg:p-8">
              {activeTab === 'overview' && (
                console.log("Rendering Overview"), (
                <DashboardOverview 
                  hospitalData={hospitalData}
                  onShowToast={showToast}
                  onClick={handleTabClick}
                />)
                
              )}
              {activeTab === 'departments' && (
                console.log("Rendering Overview"), (
                <DepartmentManagement 
                  hospitalData={hospitalData}
                  onShowToAast={showToast}
                  onClick={handleTabClick}

                />)
              )}
              {activeTab === 'beds' && (
                <BedManagement 
                  hospitalData={hospitalData}
                  onShowToast={showToast}
                />
              )}
              {activeTab === 'doctors' && (
                <DoctorManagement 
                  hospitalData={hospitalData}
                  onShowToast={showToast}
                />
              )}
              {activeTab === 'patients' && (
                <PatientRecords 
                  hospitalData={hospitalData}
                  onShowToast={showToast}
                />
              )}
              {activeTab === 'appointments' && (
                <AppointmentScheduling 
                  hospitalData={hospitalData}
                  onShowToast={showToast}
                />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
