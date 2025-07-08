'use client';
import React from 'react';
import { ChevronRight, Home } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const Breadcrumb = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);
    if (pathname === '/dashboard/patient') {
    return null;
  }

  // Get only the last segment
  const lastSegment = segments[segments.length - 1] || 'Dashboard';

  const formatted = lastSegment
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return (
  <nav className="bg-transparent border-none shadow-none mx-4 md:mx-8 mt-4"
  aria-label="Breadcrumb">
      <div className="px-6 py-4">
        <ol className="flex items-center space-x-3">
          {/* Home link */}
          <li>
            <Link href="/dashboard/patient" className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors duration-200">
              <Home className="w-4 h-4 text-blue-600" />
              <span className="text-blue-600 font-medium text-sm hover:text-blue-700">Home</span>
            </Link>
          </li>

          {/* Chevron */}
          <li>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </li>

          {/* Current page */}
          <li>
            <div className="flex items-center px-3 py-2 rounded-lg bg-gray-50">
              <span className="text-gray-900 font-semibold text-sm">{formatted}</span>
            </div>
          </li>
        </ol>
      </div>
    </nav>
  );
};

export default Breadcrumb;
