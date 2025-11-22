'use client'
import React from 'react';
import { Menu, Moon, Sun, Bell, LogOut } from 'lucide-react';

export default function Header({ 
  onMenuToggle, 
  onThemeToggle, 
  theme, 
  hospitalData,
  onLogout 
}) {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-md border-b dark:border-gray-700">
      <div className="flex items-center justify-between px-4 md:px-6 lg:px-8 py-4">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuToggle}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6 text-gray-900 dark:text-white" />
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
            onClick={onThemeToggle}
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

          {/* Logout */}
          <button
            onClick={onLogout}
            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors text-red-600 dark:text-red-400"
            aria-label="Logout"
          >
            <LogOut className="w-6 h-6" />
          </button>
        </div>
      </div>
    </header>
  );
}
