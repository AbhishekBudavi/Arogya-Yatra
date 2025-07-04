'use client';

import React from 'react';
import { Calendar, FileText, Activity, Heart, Sparkles } from 'lucide-react';

const PatientDashboardHome = () => {
  const stats = [
    {
      title: 'Total Appointments',
      value: '2,340',
      change: '+8% this month',
      icon: Calendar,
    },
    {
      title: 'Pending Reports',
      value: '156',
      change: '-2% this month',
      icon: FileText,
    },
    {
      title: 'Active Prescriptions',
      value: '89',
      change: '+5% this month',
      icon: Activity,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden">
        <h1 className="text-2xl font-bold mb-1">Welcome back!</h1>
        <p className="text-blue-100">Track your health journey with ease</p>
        <div className="absolute right-6 top-6 hidden md:block">
          <Sparkles className="h-10 w-10 text-white opacity-80" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-4 shadow hover:shadow-md transition">
            <div className="flex items-center justify-between mb-2">
              <div className="bg-blue-100 p-2 rounded-lg">
                <stat.icon className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-sm text-gray-500">{stat.change}</span>
            </div>
            <h3 className="text-xl font-bold text-gray-800">{stat.value}</h3>
            <p className="text-sm text-gray-600">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Summary Section */}
      <div className="bg-white rounded-2xl p-6 shadow">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
            <Heart className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">Your Health Dashboard</h2>
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Here you can manage your appointments, records, prescriptions, and insurance.
        </p>
      </div>
    </div>
  );
};

export default PatientDashboardHome;
