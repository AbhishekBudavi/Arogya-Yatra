"use client";
import React, { useState, useEffect } from "react";
import DoctorDashboardNavbar from "./DoctorDashNav";
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
    Scan
} from "lucide-react";
import Image from "next/image";
import Link from 'next/link'

const DoctorDashboardSidebar = ({
  collapsed,
  setCollapsed,
  sidebarOpen,
  setSidebarOpen,
  activeItem,
  setActiveItem
}) => {
  const [recordsDropdown, setRecordsDropdown] = useState(false);

    useEffect(() => {
        const handleEscape = (e) => {
            if (e.key === "Escape" && sidebarOpen) {
                setSidebarOpen(false);
            }
        };

        if (sidebarOpen) {
            document.addEventListener("keydown", handleEscape);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.removeEventListener("keydown", handleEscape);
            document.body.style.overflow = "unset";
        };
    }, [sidebarOpen]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setSidebarOpen(false);
        }
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    const sidebarItems = [
        {
            icon: Scan,
            label: "Scanner",
            href: "/dashboard/patient/qr-code",
            gradient: "from-blue-500 to-purple-600",
        },
      
        {
            icon: Calendar,
            label: "Appointments",
            href: "/dashboard/patient/appointments",
            gradient: "from-orange-500 to-red-600",
        },
        {
            icon: Clock,
            label: "Recent Appointments",
            href: "#",
            gradient: "from-pink-500 to-rose-600",
        },
        {
            icon: Users,
            label: "Doctors",
            href: "#",
            gradient: "from-indigo-500 to-purple-600",
        },
        {
            icon: Shield,
            label: "Insurance",
            href: "#",
            gradient: "from-green-500 to-emerald-600",
        },
    ];

    const stats = [
        {
            title: "Total Appointments",
            value: "2,340",
            change: "+8% this month",
            icon: Calendar,
            gradient: "from-green-400 to-emerald-500",
            bgGradient: "from-green-50 to-emerald-50",
        },
        {
            title: "Pending Reports",
            value: "156",
            change: "-2% this month",
            icon: FileText,
            gradient: "from-blue-400 to-cyan-500",
            bgGradient: "from-blue-50 to-cyan-50",
        },
        {
            title: "Active Prescriptions",
            value: "89",
            change: "+5% this month",
            icon: Activity,
            gradient: "from-purple-400 to-pink-500",
            bgGradient: "from-purple-50 to-pink-50",
        },
    ];

    const sidebarWidth = collapsed ? "w-20" : "w-72";

    // Helper for gradients in inline style
    const getGradient = (gradient) => {
        if (gradient.includes("blue")) {
            return "linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)";
        }
        if (gradient.includes("emerald")) {
            return "linear-gradient(135deg, #10b981 0%, #14b8a6 100%)";
        }
        if (gradient.includes("orange")) {
            return "linear-gradient(135deg, #f97316 0%, #dc2626 100%)";
        }
        if (gradient.includes("pink")) {
            return "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)";
        }
        if (gradient.includes("indigo")) {
            return "linear-gradient(135deg, #6366f1 0%, #9333ea 100%)";
        }
        if (gradient.includes("green")) {
            return "linear-gradient(135deg, #22c55e 0%, #059669 100%)";
        }
        return "linear-gradient(135deg, #3b82f6 0%, #9333ea 100%)";
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:block lg:hidden transition-all duration-300"
                    onClick={handleOverlayClick}
                    aria-hidden="true"
                />
            )}

            {/* Sidebar Container */}
            <div
                className={`
                    fixed z-50 inset-y-0 left-0 
                    bg-white/95 backdrop-blur-xl border-r border-white/20
                    shadow-2xl shadow-black/10
                    transition-all duration-300 ease-out
                    flex flex-col
                    ${sidebarWidth}
                    ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
                    md:translate-x-0 md:static md:shadow-none
                    overflow-hidden
                `}
                style={{
                    background:
                        "linear-gradient(145deg, rgba(255,255,255,0.98) 0%, rgba(248,250,252,0.98) 100%)",
                    height: "100vh",
                }}
            >
                {/* Sidebar Content */}
                <div className="flex flex-col h-full">
                    {/* Mobile Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-100/50 md:hidden shrink-0">
                        <div className="flex items-center space-x-2">
                            <div className="h-10 flex items-center">
                                <Link href='/'>
                                <Image
                                    src="https://health-e.in/wp-content/uploads/2022/11/health-e-logo.svg"
                                    alt="Health-e logo"
                                    width={120}
                                    height={32}
                                    className="h-full w-auto"
                                />
                                </Link>
                            </div>
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
                    <div
                        className={`hidden md:flex items-center p-4 ${collapsed ? "justify-center" : "justify-start"} shrink-0`}
                    >
                        <div className="flex items-center pt-3 space-x-3">
                            <div className="h-12 flex items-center">
                            <Link href='/'>
                                <Image
                                    src="https://health-e.in/wp-content/uploads/2022/11/health-e-logo.svg"
                                    alt="Health-e logo"
                                    width={collapsed ? 150 : 150}
                                    height={collapsed ? 40 : 60}
                                    className="h-full w-auto"
                                />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Collapse Button (Desktop only) */}
                    <div className="hidden md:flex items-center justify-end px-4 pb-2 shrink-0">
                        <button
                            className="p-2 rounded-xl hover:bg-gray-100/50 transition-all duration-300 hover:scale-105 group focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onClick={() => setCollapsed((c) => !c)}
                            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
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
        <li key={index} className="pb-3">
          <div>
            {item.hasDropdown ? (
              <button
                className={`
                  w-full flex items-center px-4 py-3 rounded-2xl
                  transition-all duration-300 group relative
                  ${collapsed ? "justify-center" : "justify-between"}
                  ${activeItem === item.label
                    ? "bg-gradient-to-r shadow-lg scale-[1.02] shadow-black/10"
                    : "hover:bg-gray-50/50 hover:shadow-md hover:scale-[1.01]"}
                  focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
                onClick={() => {
                  setRecordsDropdown((open) => !open);
                  setActiveItem(item.label);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
                style={{
                  background:
                    activeItem === item.label
                      ? getGradient(item.gradient)
                      : undefined,
                }}
              >
                <div className={`flex items-center space-x-4 ${collapsed ? "justify-center w-full" : ""}`}>
                  <div
                    className={`
                      p-2 rounded-xl transition-all duration-300
                      ${activeItem === item.label
                        ? "bg-white/20 shadow-lg"
                        : "bg-gray-100 shadow-sm"}
                    `}
                  >
                    <item.icon
                      className={`h-5 w-5 ${activeItem === item.label
                        ? "text-white"
                        : "text-gray-600"}`}
                    />
                  </div>
                  {!collapsed && (
                    <span className={`font-medium pl-2 transition-colors ${activeItem === item.label
                      ? "text-white"
                      : "text-gray-700"}`}>
                      {item.label}
                    </span>
                  )}
                </div>
                {!collapsed && (
                  <ChevronDown
                    className={`
                      h-4 w-4 transition-all duration-300
                      ${recordsDropdown ? "rotate-180" : ""}
                      ${activeItem === item.label ? "text-white" : "text-gray-500"}
                    `}
                  />
                )}
              </button>
            ) : (
              <Link href={item.href}>
                <button
                  className={`
                    w-full flex items-center px-4 py-3 rounded-2xl
                    transition-all duration-300 group relative
                    ${collapsed ? "justify-center" : "justify-between"}
                    ${activeItem === item.label
                      ? "bg-gradient-to-r shadow-lg scale-[1.02] shadow-black/10"
                      : "hover:bg-gray-50/50 hover:shadow-md hover:scale-[1.01]"}
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                  `}
                  onClick={() => {
                    setActiveItem(item.label);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  style={{
                    background:
                      activeItem === item.label
                        ? getGradient(item.gradient)
                        : undefined,
                  }}
                >
                  <div className={`flex items-center space-x-4 ${collapsed ? "justify-center w-full" : ""}`}>
                    <div
                      className={`
                        p-2 rounded-xl transition-all duration-300
                        ${activeItem === item.label
                          ? "bg-white/20 shadow-lg"
                          : "bg-gray-100 shadow-sm"}
                      `}
                    >
                      <item.icon
                        className={`h-5 w-5 ${activeItem === item.label
                          ? "text-white"
                          : "text-gray-600"}`}
                      />
                    </div>
                    {!collapsed && (
                      <span className={`font-medium pl-2 transition-colors ${activeItem === item.label
                        ? "text-white"
                        : "text-gray-700"}`}>
                        {item.label}
                      </span>
                    )}
                  </div>
                </button>
              </Link>
            )}

            {/* Dropdown Items */}
            {item.hasDropdown &&
              recordsDropdown &&
              !collapsed &&
              item.dropdownItems?.length > 0 && (
                <div className="mt-3 ml-4 space-y-1">
                  {item.dropdownItems.map((dropdownItem, dropdownIndex) => (
                    <div className="pb-3" key={dropdownIndex}>
                      <Link href={dropdownItem.href}
                        
                          className="block px-6 py-3 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50/50 rounded-xl transition-all duration-300 hover:translate-x-1 hover:shadow-sm border-l-2 border-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          onClick={() => {
                            if (window.innerWidth < 768) {
                              setSidebarOpen(false);
                            }
                          }}
                        >
                          {dropdownItem.label}
                        
                      </Link>
                    </div>
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
          <span className="text-md pl-1 font-semibold text-gray-700">
            Quick Stats
          </span>
        </div>
        <div className="space-y-2">
          {stats.slice(0, 2).map((stat, index) => (
            <div className="pb-3" key={index}>
              <div className="p-3 rounded-xl bg-white/60 border border-white/50 shadow-sm">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  )}
</div>


                    {/* Footer */}
                </div>
            </div>

            {/* Main Content */}
        </div>
    );
};

export default DoctorDashboardSidebar;
