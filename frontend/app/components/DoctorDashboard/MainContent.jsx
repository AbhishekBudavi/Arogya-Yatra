'use client'
import React from 'react';
import { useState, useEffect } from 'react';
import api from '../../utils/api'
import {
  QrCode,
  Calendar,
  Users,
  FileText,
  Activity,
  TrendingUp,
  TrendingDown,
  Heart,
  Clock,
  AlertCircle,
  CheckCircle,
  XCircle,
  Camera,
  User,
  Stethoscope,
  Pill,
  Brain,
  Eye
} from 'lucide-react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar
} from 'recharts';
import QRScanner from './Cards/QRScanner'
import { ScrollArea } from "@/components/ui/scroll-area";
// Mock QR Scanner Component
const MainContent = () => {
  // Chart data
  const appointmentsData = [
    { time: '9:00', appointments: 2, completed: 2 },
    { time: '10:00', appointments: 3, completed: 3 },
    { time: '11:00', appointments: 4, completed: 2 },
    { time: '12:00', appointments: 2, completed: 1 },
    { time: '13:00', appointments: 1, completed: 0 },
    { time: '14:00', appointments: 5, completed: 3 },
    { time: '15:00', appointments: 3, completed: 1 },
    { time: '16:00', appointments: 4, completed: 0 },
  ];

  const weeklyPatientsData = [
    { day: 'Mon', patients: 24, newPatients: 5 },
    { day: 'Tue', patients: 32, newPatients: 8 },
    { day: 'Wed', patients: 18, newPatients: 3 },
    { day: 'Thu', patients: 28, newPatients: 6 },
    { day: 'Fri', patients: 35, newPatients: 9 },
    { day: 'Sat', patients: 22, newPatients: 4 },
    { day: 'Sun', patients: 15, newPatients: 2 },
  ];

  const departmentData = [
    { name: 'Cardiology', value: 35, color: '#3B82F6' },
    { name: 'Neurology', value: 25, color: '#8B5CF6' },
    { name: 'Orthopedics', value: 20, color: '#10B981' },
    { name: 'General', value: 20, color: '#F59E0B' },
  ];

  const vitalSignsData = [
    { patient: 'ramesh.', heartRate: 72, bloodPressure: 120, temp: 98.6, status: 'normal' },
    { patient: 'khan.', heartRate: 89, bloodPressure: 140, temp: 99.2, status: 'elevated' },
    { patient: 'shivanda.', heartRate: 65, bloodPressure: 110, temp: 98.4, status: 'normal' },
    { patient: 'Paddy', heartRate: 78, bloodPressure: 125, temp: 98.8, status: 'normal' },
  ];

  const healthMetrics = [
    { label: 'Patient Satisfaction', value: 94, color: '#10B981' },
    { label: 'Treatment Success', value: 89, color: '#3B82F6' },
    { label: 'Response Time', value: 76, color: '#F59E0B' },
  ];

  const summaryCards = [
    {
      title: "Today's Appointments",
      value: "24",
      subtitle: "3 pending, 21 completed",
      icon: Calendar,
      gradient: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Active Patients",
      value: "1,247",
      subtitle: "52 new this week",
      icon: Users,
      gradient: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Prescriptions",
      value: "89",
      subtitle: "15 pending review",
      icon: FileText,
      gradient: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      trend: "+23%",
      trendUp: true
    },
    {
      title: "Lab Reports",
      value: "156",
      subtitle: "8 critical alerts",
      icon: Activity,
      gradient: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      trend: "-5%",
      trendUp: false
    },
  ];

  const upcomingAppointments = [
    { time: "09:30", patient: "ramesh", type: "Consultation", status: "confirmed", avatar: "JD" },
    { time: "10:15", patient: "paddy", type: "Follow-up", status: "pending", avatar: "SW" },
    { time: "11:00", patient: "Raghu M", type: "Check-up", status: "confirmed", avatar: "MJ" },
    { time: "14:30", patient: "Jitendra", type: "Surgery", status: "confirmed", avatar: "EB" },
    { time: "15:45", patient: "Laxman", type: "Consultation", status: "pending", avatar: "DL" },
  ];

 
 const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const res = await api.get("/dashboard/doctor", {
          withCredentials: true, //nsures cookies are sent
        });
        console.log("Fetched data from API:", res.data);
        // API returns { success, message, data: { doctor info } }
        setDoctorData(res.data?.data || res.data);
      } catch (err) {
        console.error(
          "Dashboard fetch error:",
          err.response?.data || err.message
        );
        setError("Failed to load doctor dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-red-600 text-lg">{error}</p>
      </div>
    );
  }

  // Data safety check - API returns doctor data directly
  const doctor = doctorData || {};
  if (!doctor.doctor_name) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">No doctor data found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-700 text-white rounded-3xl p-8 shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">{doctor.doctor_name}</h1>
                <p className="text-blue-100 text-lg mb-4">Ready to make a difference today</p>
             
              </div>
              <div className="hidden md:block">
                <div className="bg-white/20 backdrop-blur-sm rounded-3xl p-6">
                  <Stethoscope className="h-16 w-16 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
        {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {summaryCards.map((card, index) => (
          <div key={index} className="group">
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full">
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bgColor} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-300`}>
                  <card.icon className={`h-6 w-6 ${card.iconColor}`} />
                </div>
                <div className={`flex items-center space-x-1 text-sm font-semibold ${
                  card.trendUp ? 'text-green-600' : 'text-red-600'
                }`}>
                  {card.trendUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span>{card.trend}</span>
                </div>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-gray-800 mb-2">{card.value}</h3>
                <p className="text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-xs text-gray-400">{card.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>


      {/* QR Scanner */}
      <div className="mb-8">
        <QRScanner />
      </div>

    
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Appointments Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Today's Schedule</h3>
              <p className="text-gray-500">Appointments vs Completed</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-2xl">
              <Clock className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={appointmentsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="time" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  shadow: '0 10px 25px rgba(0,0,0,0.1)' 
                }} 
              />
              <Area 
                type="monotone" 
                dataKey="appointments" 
                stackId="1"
                stroke="#3B82F6" 
                fill="url(#appointmentsGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="completed" 
                stackId="2"
                stroke="#10B981" 
                fill="url(#completedGradient)" 
              />
              <defs>
                <linearGradient id="appointmentsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="completedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                </linearGradient>
              </defs>
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Patients Chart */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Weekly Overview</h3>
              <p className="text-gray-500">Patients treated this week</p>
            </div>
            <div className="bg-emerald-50 p-3 rounded-2xl">
              <TrendingUp className="h-6 w-6 text-emerald-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyPatientsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  shadow: '0 10px 25px rgba(0,0,0,0.1)' 
                }} 
              />
              <Bar dataKey="patients" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="newPatients" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Dashboard Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Department Distribution */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Department Load</h3>
              <p className="text-gray-500">Patient distribution</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-2xl">
              <Pie className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={departmentData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {departmentData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  shadow: '0 10px 25px rgba(0,0,0,0.1)' 
                }} 
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-3 mt-4">
            {departmentData.map((dept, index) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dept.color }}></div>
                <span className="text-sm text-gray-600">{dept.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Health Metrics */}
        <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Performance Metrics</h3>
              <p className="text-gray-500">Key indicators</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-2xl">
              <Activity className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="space-y-6">
            {healthMetrics.map((metric, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">{metric.label}</span>
                  <span className="text-lg font-bold" style={{ color: metric.color }}>{metric.value}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="h-3 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${metric.value}%`, 
                      backgroundColor: metric.color 
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Appointments */}
      
      </div>
      <div className='mb-8'>
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Next Appointments</h3>
              <p className="text-gray-500">Today's schedule</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-2xl">
              <Calendar className="h-6 w-6 text-orange-600" />
            </div>
          </div>
           <ScrollArea className="h-72 rounded-md border border-gray-200">
          <div className="space-y-4">
            {upcomingAppointments.map((appointment, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                    {appointment.avatar}
                  </div>
                </div>
                <div className="flex-1 min-w-0 pl-3">
                  <p className="text-sm font-semibold text-gray-800 truncate">{appointment.patient}</p>
                  <p className="text-xs text-gray-500">{appointment.type}</p>
                </div>
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-600 pr-3 pb-2">{appointment.time}</span>
                  <span className={`text-xs px-2 py-1 rounded-full  ${
                    appointment.status === 'confirmed' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appointment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          </ScrollArea>
        </div>
      </div>

      {/* Real-time Vital Signs Monitor */}
      
    </div>
  );
};

export default MainContent;