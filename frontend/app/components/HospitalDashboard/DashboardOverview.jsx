'use client'
import React from 'react';
import { Building2, Bed, Users, Calendar, TrendingUp, Activity } from 'lucide-react';

export default function DashboardOverview({ hospitalData, onShowToast }) {
  const stats = [
    {
      title: 'Total Beds',
      value: hospitalData?.bed_count || 0,
      icon: Bed,
      color: 'blue',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    {
      title: 'ICU Available',
      value: hospitalData?.icu_available ? 'Yes' : 'No',
      icon: Activity,
      color: 'green',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    {
      title: 'Emergency Services',
      value: hospitalData?.emergency_services ? 'Active' : 'Inactive',
      icon: TrendingUp,
      color: 'red',
      bgColor: 'bg-red-50 dark:bg-red-900/20'
    },
    {
      title: 'Departments',
      value: hospitalData?.departments?.split(',').length || 0,
      icon: Building2,
      color: 'purple',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    }
  ];

  const colorClasses = {
    blue: 'text-blue-600 dark:text-blue-400',
    green: 'text-green-600 dark:text-green-400',
    red: 'text-red-600 dark:text-red-400',
    purple: 'text-purple-600 dark:text-purple-400'
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white rounded-2xl p-8 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Welcome back, {hospitalData?.admin_name || 'Admin'}!</h1>
        <p className="text-blue-100">Manage your hospital operations efficiently and securely</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-4 pb-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-2">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-lg`}>
                  <Icon className={`w-6 h-6 ${colorClasses[stat.color]}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Hospital Information Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hospital Details */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Hospital Information</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Hospital Name</label>
              <p className="text-gray-900 dark:text-white mt-1">{hospitalData?.hospital_name || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Hospital ID</label>
              <p className="text-gray-900 dark:text-white mt-1">{hospitalData?.custom_hospital_id || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Hospital Type</label>
              <p className="text-gray-900 dark:text-white mt-1">{hospitalData?.hospital_type || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Registration Status</label>
              <p className="text-green-600 dark:text-green-400 mt-1 font-semibold">Active</p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Contact & Location</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
              <p className="text-gray-900 dark:text-white mt-1 break-all">{hospitalData?.email || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Address</label>
              <p className="text-gray-900 dark:text-white mt-1">{hospitalData?.address || 'N/A'}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">City, State</label>
              <p className="text-gray-900 dark:text-white mt-1">
                {hospitalData?.city}, {hospitalData?.state}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Pincode</label>
              <p className="text-gray-900 dark:text-white mt-1">{hospitalData?.pincode || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Departments */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 pt-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Available Departments</h2>
        <div className="flex flex-wrap gap-3">
          {hospitalData?.departments?.split(',').map((dept, index) => (
            <span
              key={index}
              className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium"
            >
              {dept.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
