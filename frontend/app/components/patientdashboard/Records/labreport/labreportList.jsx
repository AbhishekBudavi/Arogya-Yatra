'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import api from '../../../../utils/api';
import { 
  Search, Filter, Eye, Download, FileText, 
  Calendar, User, ArrowLeft, CheckCircle, Clock, XCircle, AlertCircle 
} from 'lucide-react';

const LabReportList = ({ goBack, addRecords }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedSummaries, setExpandedSummaries] = useState({});
  const [reportsDetail, setReportsDetail] = useState([]); // ✅ initialize as empty array

  // 🧩 status helpers
  const getStatusColor = (status) => {
    switch (status) {
      case 'Verified': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending Review': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Rejected': return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Verified': return <CheckCircle className="w-4 h-4" />;
      case 'Pending Review': return <Clock className="w-4 h-4" />;
      case 'Rejected': return <XCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'Blood Test': return '🩸';
      case 'Urine Test': return '🧪';
      case 'Radiology': return '🏥';
      default: return '📋';
    }
  };

  const toggleSummary = (id) => {
    setExpandedSummaries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // ✅ FIX: Use correct API key
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await api.get('/patient/labreports');
        const data = res.data.labReports || []; // ✅ correct key + fallback
        console.log("APi Response", data);
        setReportsDetail(data);
        console.log("✅ Lab reports fetched:", data);
      } catch (error) {
        console.error('Failed to fetch lab reports:', error);
        setReportsDetail([]);
      }
    };
    fetchReports();
  }, []);

  // ✅ Always filter safely
  const filteredReports = (reportsDetail || []).filter((report) => {
    const data = report.document_data || {};

    const matchesSearch =
      (data.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (data.documentCategory?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (data.doctorName?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterStatus === 'All' ||
      data.documentCategory === filterStatus ||
      report.document_type === filterStatus;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      {goBack && (
        <Link href="/dashboard/patient/records">
          <button className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go back
          </button>
        </Link>
      )}

      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Lab Reports</h1>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search reports, tests, or doctors..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6">
          <div className="relative w-full md:w-60">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              className="w-full pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Reports</option>
              <option value="Verified">Verified</option>
              <option value="Pending Review">Pending Review</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          {addRecords && (
            <Link href="/dashboard/patient/records/labreports/report-form">
              <div className="w-full md:w-60 py-3 px-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:scale-[1.03] text-center cursor-pointer">
                <span className="text-xl mr-2">+</span> Add New Record
              </div>
            </Link>
          )}
        </div>
      </div>

      {/* Reports List */}
      <div className="grid gap-6">
        {filteredReports.map((report) => {
          const data = report.document_data || {};
          return (
            
              <div key={report.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-xl flex items-center justify-center text-2xl">
                        {getTypeIcon(data.documentCategory)}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-bold text-xl text-gray-900 mb-1">{data.title}</h3>
                        <p className="text-sm text-gray-600 font-medium">{data.documentCategory}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-3 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 ml-2">Date</p>
                        <p className="text-sm font-semibold ml-2">
                          {data.date ? new Date(data.date).toLocaleDateString() : '—'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-gray-600">
                      <User className="w-4 h-4" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 ml-2">Doctor</p>
                        <p className="text-sm font-semibold ml-2">{data.doctorName || '—'}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-3 text-gray-600">
                      <FileText className="w-4 h-4" />
                      <div>
                        <p className="text-xs font-medium text-gray-500 ml-2">File</p>
                        <p className="text-sm font-semibold ml-2">{report.document_name}</p>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t flex justify-between items-center">
                    <div>
                    <a href={`http://localhost:5000${report.document_url}`} target="_blank" rel="noopener noreferrer">
                    <button className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200">
                      <Eye className="w-4 h-4 mr-2" /> Preview
                    </button>
                    </a>
                    </div>
                    <Link
                      href={`/dashboard/patient/records/labreports/${report.id}`}
                      className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                    >
                      View Details
                    </Link>
                    <a
                      href={`http://localhost:5000${report.document_url}`}
                      download
                      className="flex items-center text-gray-600 hover:text-gray-700 font-medium transition-colors duration-200"
                    >
                      <Download className="w-4 h-4 mr-2" /> Download
                    </a>
                  </div>
                </div>
              </div>
          
          );
        })}
      </div>

      {/* Empty State */}
      {filteredReports.length === 0 && (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <FileText className="w-12 h-12 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No reports found</h3>
          <p className="text-gray-600 text-lg mb-6">
            Try adjusting your search or filter to find what you're looking for.
          </p>
          <Link
            href="/dashboard/patient/records/labreports/report-form"
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            Add Your First Report
          </Link>
        </div>
      )}
    </div>
  );
};

export default LabReportList;
