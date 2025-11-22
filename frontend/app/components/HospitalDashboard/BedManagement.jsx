'use client'
import React, { useState } from 'react';
import { Bed, Plus, Minus, AlertCircle } from 'lucide-react';

export default function BedManagement({ hospitalData, onShowToast }) {
  const totalBeds = hospitalData?.bed_count || 0;
  const [occupiedBeds, setOccupiedBeds] = useState(Math.floor(totalBeds * 0.6));
  const [icuOccupied, setIcuOccupied] = useState(Math.floor(totalBeds * 0.2));
  const availableBeds = totalBeds - occupiedBeds;
  const occupancyRate = ((occupiedBeds / totalBeds) * 100).toFixed(1);

  const handleOccupyBed = () => {
    if (occupiedBeds < totalBeds) {
      setOccupiedBeds(occupiedBeds + 1);
      onShowToast('Bed marked as occupied', 'success');
    } else {
      onShowToast('No available beds', 'error');
    }
  };

  const handleFreeBed = () => {
    if (occupiedBeds > 0) {
      setOccupiedBeds(occupiedBeds - 1);
      onShowToast('Bed marked as available', 'success');
    }
  };

  const handleOccupyICU = () => {
    if (icuOccupied < Math.floor(totalBeds * 0.3)) {
      setIcuOccupied(icuOccupied + 1);
      onShowToast('ICU bed occupied', 'success');
    }
  };

  const handleFreeICU = () => {
    if (icuOccupied > 0) {
      setIcuOccupied(icuOccupied - 1);
      onShowToast('ICU bed freed', 'success');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Bed className="w-8 h-8 text-blue-600" />
            Bed Management System
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Monitor and manage bed availability and occupancy
          </p>
        </div>
      </div>

      {/* Overall Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Total Beds</p>
          <p className="text-3xl font-bold text-blue-600">{totalBeds}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Hospital capacity</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Available Beds</p>
          <p className="text-3xl font-bold text-green-600">{availableBeds}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Ready for patients</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Occupied Beds</p>
          <p className="text-3xl font-bold text-orange-600">{occupiedBeds}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Currently in use</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">Occupancy Rate</p>
          <p className="text-3xl font-bold text-purple-600">{occupancyRate}%</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">Capacity utilization</p>
        </div>
      </div>

      {/* Bed Management Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-4">
        {/* General Beds */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Bed className="w-5 h-5 text-blue-600" />
            General Ward Beds
          </h2>
          
          <div className="space-y-6">
            {/* Progress Bar */}
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupancy</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">
                  {occupiedBeds}/{totalBeds}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-3 rounded-full transition-all"
                  style={{ width: `${(occupiedBeds / totalBeds) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Bed Statistics */}
            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-1">Occupied</p>
                <p className="text-2xl font-bold text-blue-600">{occupiedBeds}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                <p className="text-xs text-green-600 dark:text-green-400 font-medium mb-1">Available</p>
                <p className="text-2xl font-bold text-green-600">{availableBeds}</p>
              </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 pt-6">
              <button
                onClick={handleOccupyBed}
                disabled={occupiedBeds >= totalBeds}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                  bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                  text-white rounded-lg font-medium transition-colors"
              >
                <Plus className="w-5 h-5" />
                Mark as Occupied
              </button>
              <button
                onClick={handleFreeBed}
                disabled={occupiedBeds <= 0}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                  bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                  text-white rounded-lg font-medium transition-colors"
              >
                <Minus className="w-5 h-5" />
                Mark as Available
              </button>
            </div>
          </div>
        </div>

        {/* ICU Beds */}
        {hospitalData?.icu_available && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-600" />
              ICU Beds
            </h2>
            
            <div className="space-y-6">
              {/* Progress Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Occupancy</span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {icuOccupied}/{Math.floor(totalBeds * 0.3)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-red-500 to-orange-600 h-3 rounded-full transition-all"
                    style={{ width: `${(icuOccupied / Math.floor(totalBeds * 0.3)) * 100}%` }}
                  ></div>
                </div>
              </div>

              {/* ICU Statistics */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-4">
                  <p className="text-xs text-red-600 dark:text-red-400 font-medium mb-1">Occupied</p>
                  <p className="text-2xl font-bold text-red-600">{icuOccupied}</p>
                </div>
                <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
                  <p className="text-xs text-orange-600 dark:text-orange-400 font-medium mb-1">Available</p>
                  <p className="text-2xl font-bold text-orange-600">
                    {Math.floor(totalBeds * 0.3) - icuOccupied}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex gap-3">
                <button
                  onClick={handleOccupyICU}
                  disabled={icuOccupied >= Math.floor(totalBeds * 0.3)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                    bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                    text-white rounded-lg font-medium transition-colors"
                >
                  <Plus className="w-5 h-5" />
                  Occupy ICU Bed
                </button>
                <button
                  onClick={handleFreeICU}
                  disabled={icuOccupied <= 0}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 
                    bg-orange-600 hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed
                    text-white rounded-lg font-medium transition-colors"
                >
                  <Minus className="w-5 h-5" />
                  Free ICU Bed
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alert */}
      {occupancyRate > 80 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 
          rounded-xl p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">High Occupancy Alert</h3>
            <p className="text-sm text-yellow-800 dark:text-yellow-200 mt-1">
              Your hospital is operating at {occupancyRate}% capacity. Consider expanding bed capacity or managing patient flow.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
