"use client";

import * as React from "react";
import { useEffect,useState} from "react";
import {
  Calendar,
  FileText,
  QrCode,
  Clock,
  Heart,
  Sparkles,
  ChevronRight,
  Activity,
  Users,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import api from '../../utils/api'
const MainContent = () => {
    const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
useEffect(() => {
  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await api.get('/patient/dashboard');
      console.log('Fetched data from API:', res.data); // Axios already gives data
      setPatientData(res.data);
    } catch (err) {
      console.error('Dashboard fetch error:', err.response?.data || err.message);
      setError('Failed to load patient dashboard');
    } finally {
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

console.log("Patient data", patientData);

  const mainCards = [
    {
      title: "QR Code",
      subtitle: "Quick Access",
      description: "Scan for instant check-in",
      icon: QrCode,
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      action: "Get QRCode",
      href: "/dashboard/patient/qr-code",
    },
    {
      title: "Documents",
      subtitle: "Medical History",
      description: "24 documents available",
      icon: FileText,
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      action: "View All",
      href: "/dashboard/patient/records",
    },
    {
      title: "Appointments",
      subtitle: "Schedule & Manage",
      description: "3 upcoming this week",
      icon: Calendar,
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      action: "Book New",
      href: "/dashboard/patient/appointment",
    },
    {
      title: "Recent Appointments",
      subtitle: "Past Visits",
      description: "Last visit: 2 days ago",
      icon: Clock,
      gradient: "from-orange-500 to-red-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      action: "View History",
      href: "/dashboard/patient/Appointment/recent-appointment",
    },
  ];

  const quickStats = [
    {
      label: "Health Score",
      value: "94%",
      trend: "+2%",
      color: "text-emerald-600",
    },
    {
      label: "Next Appointment",
      value: "2 days",
      trend: "Dr. Smith",
      color: "text-blue-600",
    },
    {
      label: "Active Medications",
      value: "3",
      trend: "All current",
      color: "text-purple-600",
    },
  ];

  const recentActivity = [
    { title: "Blood Test Results", time: "2 hours ago", status: "completed" },
    { title: "Cardiology Appointment", time: "1 day ago", status: "completed" },
    { title: "Prescription Refill", time: "3 days ago", status: "pending" },
    { title: "Blood Test Results", time: "2 hours ago", status: "completed" },
    { title: "Cardiology Appointment", time: "1 day ago", status: "completed" },
    { title: "Prescription Refill", time: "3 days ago", status: "pending" },
    { title: "Blood Test Results", time: "2 hours ago", status: "completed" },
    { title: "Cardiology Appointment", time: "1 day ago", status: "completed" },
    { title: "Prescription Refill", time: "3 days ago", status: "pending" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="">
        {/* Welcome Header */}
        <div className="relative">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-3xl p-8 shadow-xl overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  {patientData && 
                  <h1 className="text-4xl font-bold mb-2">
                    Welcome back {patientData.patient?.first_name}
                  </h1>
}
                  <p className="text-blue-100 text-lg">
                    Your ArogyaYatra health journey continues here
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {quickStats.map((stat, index) => (
            <div key={index} className="pt-10 md:pt-10">
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-3 mb-3">
                      {stat.value}
                    </p>
                    <p className={`text-sm ${stat.color} font-medium`}>
                      {stat.trend}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-3 rounded-xl">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {mainCards.map((card, index) => (
            <div key={index} className="group pt-10">
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full">
                <div className="flex flex-col h-full">
                  {/* Card Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`${card.bgColor} p-3 rounded-2xl group-hover:scale-110 transition-transform duration-300`}
                    >
                      <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </div>

                  {/* Card Content */}
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-gray-500 mb-3 mt-3">
                      {card.subtitle}
                    </p>
                    <p className="text-gray-600 mb-4">{card.description}</p>
                  </div>

                  {/* Card Action */}
                  <div className="mt-4 mb-4">
                    <Link href={card.href}>
                      <button
                        className={`w-full bg-gradient-to-r ${card.gradient} text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 group-hover:scale-105`}
                      >
                        {card.action}
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="pt-10">
          <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-2xl">
                  <Activity className="h-6 w-6 text-white" />
                </div>
                <h2 className="text-2xl pl-3 md:pl-3 font-bold text-gray-800">
                  Recent Activity
                </h2>
              </div>
             
            </div>

            <ScrollArea className="h-72 rounded-md border border-gray-200">
              <div className="space-y-4 pr-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full flex-shrink-0 ${
                          activity.status === "completed"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      />
                      <div className="pl-3">
                        <p className="font-medium  text-gray-800">
                          {activity.title}
                        </p>
                        <p className="text-sm text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                        activity.status === "completed"
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {activity.status}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainContent;
