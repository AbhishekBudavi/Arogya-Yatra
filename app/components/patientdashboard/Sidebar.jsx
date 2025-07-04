'use client'
import React, { useState, useEffect } from 'react';
import Navbar from './nav-main';
import {
    QrCode,
    FileText,
    Calendar,
    Clock,
    Activity,
    ChevronDown,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Sparkles,
    Heart,
    Shield,
    Users,
} from 'lucide-react';
import Image from 'next/image'

const Sidebar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [collapsed, setCollapsed] = useState(false);
    const [recordsDropdown, setRecordsDropdown] = useState(false);
    const [activeItem, setActiveItem] = useState('QR Code');

    // Handle escape key and focus trap
    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === 'Escape' && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        // Add event listener when sidebar is open
        if (sidebarOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll when sidebar is open on mobile
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [sidebarOpen]);

 useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden'; // prevent scroll
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => document.body.style.overflow = 'unset';
  }, [sidebarOpen]);

    // Close sidebar when clicking outside
    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setSidebarOpen(false);
        }
    };

    // Close sidebar on mobile when screen size changes
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const sidebarItems = [
        { icon: QrCode, label: 'QR Code', href: '#', gradient: 'from-blue-500 to-purple-600' },
        {
            icon: FileText,
            label: 'Records',
            href: '#',
            hasDropdown: true,
            gradient: 'from-emerald-500 to-teal-600',
            dropdownItems: ['Lab Reports', 'Prescriptions', 'Medical History', 'Vaccination Records'],
        },
        { icon: Calendar, label: 'Appointments', href: '#', gradient: 'from-orange-500 to-red-600' },
        { icon: Clock, label: 'Recent Appointments', href: '#', gradient: 'from-pink-500 to-rose-600' },
        { icon: Users, label: 'Doctors', href: '#', gradient: 'from-indigo-500 to-purple-600' },
        { icon: Shield, label: 'Insurance', href: '#', gradient: 'from-green-500 to-emerald-600' },
    ];

    const stats = [
        {
            title: 'Total Appointments',
            value: '2,340',
            change: '+8% this month',
            icon: Calendar,
            gradient: 'from-green-400 to-emerald-500',
            bgGradient: 'from-green-50 to-emerald-50',
        },
        {
            title: 'Pending Reports',
            value: '156',
            change: '-2% this month',
            icon: FileText,
            gradient: 'from-blue-400 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50',
        },
        {
            title: 'Active Prescriptions',
            value: '89',
            change: '+5% this month',
            icon: Activity,
            gradient: 'from-purple-400 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50',
        },
    ];

    const sidebarWidth = collapsed ? 'w-20' : 'w-72';

    return (
        
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
 <div className={`
        fixed inset-y-0 left-0 z-50
        bg-white shadow-xl w-72
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:shadow-none
      `}>
        {/* Sidebar Header */}
        <div className="flex items-center justify-between p-4 border-b md:hidden">
          <h2 className="text-lg font-bold">Sidebar</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

            {/* Sidebar Container */}
            <div
                className={`
                    fixed z-50 inset-y-0 left-0 
                    bg-white/95 backdrop-blur-xl border-r border-white/20
                    shadow-2xl shadow-black/10
                    transition-all duration-300 ease-out
                    flex flex-col
                    ${sidebarWidth}
                    ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                    md:translate-x-0 md:static md:shadow-none
                    overflow-hidden
                `}
                style={{ 
                    background: 'linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)',
                    height: '100vh'
                }}
            >
                {/* Sidebar Content */}
                <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100/50 md:hidden shrink-0">
                        <div className="flex items-center space-x-2">
                            <div className="h-8 flex items-center">
                                <Image
                                    src="https://health-e.in/wp-content/uploads/2022/11/health-e-logo.svg"
                                    alt="Health-e logo"
                                    width={120}
                                    height={32}
                                    className="h-full w-auto"
                                />
                            </div>
                            <span className="text-lg font-bold text-gray-800">
                                Health-e
                            </span>
                        </div>
                        <button 
                            onClick={() => setSidebarOpen(false)}
                            className="p-2 rounded-xl hover:bg-gray-100/50 transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Close sidebar"
                        >
                            <X className="h-6 w-6 text-gray-600" />
                        </button>
                    </div>

                    {/* Desktop Header */}
                    <div className={`hidden md:flex items-center p-4 ${collapsed ? 'justify-center' : 'justify-start'} shrink-0`}>
                        <div className="flex items-center pt-3 space-x-3">
                            <div className="h-10 flex items-center">
                                <Image
                                    src="https://health-e.in/wp-content/uploads/2022/11/health-e-logo.svg"
                                    alt="Health-e logo"
                                    width={collapsed ? 80 : 150}
                                    height={40}
                                    className="h-full w-auto"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Collapse Button (Desktop only) */}
                    <div className="hidden md:flex items-center justify-end px-4 pb-2 shrink-0">
                        <button
                            className="p-2 rounded-xl hover:bg-gray-100/50 transition-all duration-300 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => setCollapsed((c) => !c)}
                            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                        >
                            {collapsed ? (
                                <ChevronRight className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
                            ) : (
                                <ChevronLeft className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors" />
                            )}
                        </button>
                    </div>

                    {/* Scrollable Content Area */}
                    <div className="flex-1 overflow-y-auto px-4 pb-4">
                        {/* Navigation Items */}
                        <nav className="space-y-2">
                            <ul className="space-y-1">
                                {sidebarItems.map((item, index) => (
                                    <li key={index}>
                                        <div>
                                            <button
                                                className={`
                                                    w-full flex items-center px-4 py-3 rounded-2xl
                                                    transition-all duration-300 group relative
                                                    ${collapsed ? 'justify-center' : 'justify-between'}
                                                    ${activeItem === item.label 
                                                        ? 'bg-gradient-to-r shadow-lg scale-[1.02] shadow-black/10' 
                                                        : 'hover:bg-gray-50/50 hover:shadow-md hover:scale-[1.01]'
                                                    }
                                                    focus:outline-none focus:ring-2 focus:ring-blue-500
                                                `}
                                                onClick={() => {
                                                    if (item.hasDropdown) {
                                                        setRecordsDropdown((open) => !open);
                                                    }
                                                    setActiveItem(item.label);
                                                    // Close sidebar on mobile when item is clicked
                                                    if (window.innerWidth < 768) {
                                                        setSidebarOpen(false);
                                                    }
                                                }}
                                                style={{
                                                    background: activeItem === item.label 
                                                        ? `linear-gradient(135deg, ${item.gradient.includes('blue') ? '#3b82f6' : item.gradient.includes('emerald') ? '#10b981' : item.gradient.includes('orange') ? '#f97316' : item.gradient.includes('pink') ? '#ec4899' : item.gradient.includes('indigo') ? '#6366f1' : '#22c55e'} 0%, ${item.gradient.includes('purple') ? '#9333ea' : item.gradient.includes('teal') ? '#14b8a6' : item.gradient.includes('red') ? '#dc2626' : item.gradient.includes('rose') ? '#f43f5e' : item.gradient.includes('purple') ? '#9333ea' : '#059669'} 100%)`
                                                        : undefined
                                                }}
                                            >
                                                <div className={`flex items-center space-x-4 ${collapsed ? 'justify-center w-full' : ''}`}>
                                                    <div className={`
                                                        p-2 rounded-xl transition-all duration-300
                                                        ${activeItem === item.label 
                                                            ? 'bg-white/20 shadow-lg' 
                                                            : 'bg-gray-100 shadow-sm'
                                                        }
                                                    `}>
                                                        <item.icon className={`h-5 w-5 ${
                                                            activeItem === item.label ? 'text-white' : 'text-gray-600'
                                                        }`} />
                                                    </div>
                                                    {!collapsed && (
                                                        <span className={`font-medium transition-colors ${
                                                            activeItem === item.label ? 'text-white' : 'text-gray-700'
                                                        }`}>
                                                            {item.label}
                                                        </span>
                                                    )}
                                                </div>
                                                {item.hasDropdown && !collapsed && (
                                                    <ChevronDown
                                                        className={`h-4 w-4 transition-all duration-300 ${
                                                            recordsDropdown ? 'rotate-180' : ''
                                                        } ${activeItem === item.label ? 'text-white' : 'text-gray-500'}`}
                                                    />
                                                )}
                                            </button>
                                            
                                            {/* Dropdown Items */}
                                            {item.hasDropdown && recordsDropdown && !collapsed && (
                                                <div className="mt-2 ml-4 space-y-1">
                                                    {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                                                        <a
                                                            key={dropdownIndex}
                                                            href="#"
                                                            className="block px-6 py-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50/50 rounded-xl transition-all duration-300 hover:translate-x-1 hover:shadow-sm border-l-2 border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                            onClick={() => {
                                                                if (window.innerWidth < 768) {
                                                                    setSidebarOpen(false);
                                                                }
                                                            }}
                                                        >
                                                            {dropdownItem}
                                                        </a>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </nav>

                        {/* Stats Section */}
                        {!collapsed && (
                            <div className="py-4 mt-4">
                                <div className="bg-gradient-to-r from-gray-50/50 to-gray-100/50 rounded-2xl p-4 backdrop-blur-sm">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <Sparkles className="h-4 w-4 text-purple-500" />
                                        <span className="text-sm font-semibold text-gray-700">Quick Stats</span>
                                    </div>
                                    <div className="space-y-2">
                                        {stats.slice(0, 2).map((stat, index) => (
                                            <div key={index} className="p-3 rounded-xl bg-white/60 border border-white/50 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-xs text-gray-600 font-medium">{stat.title}</p>
                                                        <p className="text-lg font-bold text-gray-800">{stat.value}</p>
                                                    </div>
                                                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-400 to-purple-500 shadow-lg">
                                                        <stat.icon className="h-4 w-4 text-white" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div
                        className={`
                            border-t border-gray-100/50
                            flex items-center justify-center
                            ${collapsed ? 'h-0 p-0 opacity-0' : 'h-16 px-4 opacity-100'}
                            bg-gradient-to-r from-gray-50/30 to-gray-100/30
                            text-gray-500 text-xs
                            transition-all duration-500
                            backdrop-blur-sm
                            shrink-0
                        `}
                        style={{
                            minHeight: collapsed ? 0 : 64,
                            fontWeight: 500,
                            letterSpacing: '0.02em',
                        }}
                    >
                        {!collapsed && (
                            <div className="flex items-center space-x-2">
                                <Heart className="h-3 w-3 text-red-400" />
                                <span>© 2025 Arogya Yatra</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen md:ml-0">
                <Navbar 
                    collapsed={collapsed} 
                    setSidebarOpen={setSidebarOpen} 
                    sidebarOpen={sidebarOpen}
                />

                {/* Main Content Area */}
                <main className="flex-1 p-4 md:p-6 overflow-y-auto">
                    {/* Welcome Section */}
                    <div className="mb-6 md:mb-8">
                        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-3xl p-6 md:p-8 text-white shadow-2xl relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
                            <div className="relative z-10 flex items-center justify-between">
                                <div>
                                    <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome back!</h1>
                                    <p className="text-blue-100 text-base md:text-lg">Track your health journey with ease</p>
                                </div>
                                <div className="hidden md:block">
                                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                        <Sparkles className="h-10 w-10 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 border border-white/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative overflow-hidden">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-3 md:mb-4">
                                        <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
                                            <stat.icon className="h-5 md:h-6 w-5 md:w-6 text-white" />
                                        </div>
                                        <span className="text-xs md:text-sm text-gray-600 font-medium bg-gray-100/50 px-2 md:px-3 py-1 rounded-full">
                                            {stat.change}
                                        </span>
                                    </div>
                                    <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">{stat.value}</h3>
                                    <p className="text-sm md:text-base text-gray-600 font-medium">{stat.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Additional content */}
                    <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 shadow-lg relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-purple-50/30"></div>
                        <div className="relative z-10">
                            <div className="flex items-center space-x-3 mb-4 md:mb-6">
                                <div className="w-10 md:w-12 h-10 md:h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <Heart className="h-5 md:h-6 w-5 md:w-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">Your Health Dashboard</h2>
                                    <p className="text-gray-500 text-xs md:text-sm">Manage your healthcare journey</p>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-4 md:mb-6">
                                Welcome to your personalized health dashboard. Here you can manage your appointments, 
                                view medical records, track prescriptions, and much more. Navigate through the sidebar 
                                to explore different features and take control of your health journey.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 md:p-4 border border-green-200/50">
                                    <div className="flex items-center space-x-2 md:space-x-3">
                                        <div className="w-7 md:w-8 h-7 md:h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                                            <Calendar className="h-3 md:h-4 w-3 md:w-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm md:text-base text-gray-800">Next Appointment</h3>
                                            <p className="text-xs md:text-sm text-gray-600">Dr. Smith - Tomorrow 10:30 AM</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-3 md:p-4 border border-purple-200/50">
                                    <div className="flex items-center space-x-2 md:space-x-3">
                                        <div className="w-7 md:w-8 h-7 md:h-8 bg-gradient-to-r from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">
                                            <Activity className="h-3 md:h-4 w-3 md:w-4 text-white" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-sm md:text-base text-gray-800">Health Score</h3>
                                            <p className="text-xs md:text-sm text-gray-600">85/100 - Excellent</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
        </div>
    );
};

export default Sidebar;