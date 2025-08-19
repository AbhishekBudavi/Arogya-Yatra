'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Download, Edit, Trash2, RefreshCw, Share2, Sparkles, CheckCircle,
  Clock, User, Calendar, FileText, Eye
} from 'lucide-react';
import Link from 'next/link'
export default function LabReportDetails({allReports}) {
  const params = useParams();
  const reportId = params?.reportId;
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!reportId) return;

    const fetchReport = async () => {
      try {
        const res = await fetch(`/api/labreports/${reportId}`);
        if (!res.ok) throw new Error('Failed to fetch report');
        const data = await res.json();
        setReportData(data);
      } catch (err) {
        console.error('Error fetching report:', err);
        setReportData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [reportId]);

  const handleRegenerateSummary = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      alert('Summary regenerated successfully!');
    }, 2000);
  };

  const handleShare = () => setShowShareModal(true);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://arogyayatra.com/report/${reportId}`);
    alert('Link copied to clipboard!');
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    alert('Report deleted successfully!');
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-500">Loading report...</div>;
  }

  if (!reportData) {
    return <div className="min-h-screen flex items-center justify-center text-red-500">Report not found.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
            {allReports &&
          <Link href={allReports} className="flex items-center text-gray-600 hover:text-gray-900 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            All Reports
          </Link>
           }
          <h1 className="text-2xl font-semibold text-gray-900">Lab Report Details</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-900">Report Information</h2>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">{reportData.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Report ID</label>
                    <p className="text-sm text-gray-900 font-mono pt-1">{reportData.id}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Report Title</label>
                    <p className="text-sm text-gray-900 pt-1">{reportData.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Report Type</label>
                    <p className="text-sm text-gray-900 pt-1">{reportData.type}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Report Date</label>
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 text-gray-800 mr-1 mt-3" />
                      <p className="text-sm text-gray-900 pt-1">{reportData.date}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Uploaded By</label>
                    <div className="flex items-center">
                      <User className="w-4 h-4 text-gray-400 mr-1 mt-3" />
                      <p className="text-sm text-gray-900 pt-1">{reportData.uploadedBy}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Doctor Name</label>
                    <p className="text-sm text-gray-900 pt-1">{reportData.doctorName}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Notes</label>
                    <p className="text-sm text-gray-900 pt-1">{reportData.notes}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Last Updated</label>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 text-gray-400 mr-1 mt-3" />
                      <p className="text-sm text-gray-900 pt-1 ">{reportData.lastUpdated}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pt-5">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Uploaded Report File</h2>
              <div className="border border-gray-200 rounded-lg p-4 mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{reportData.fileName}</p>
                      <p className="text-xs text-gray-500">{reportData.fileSize}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="flex items-center pr-3 text-gray-600 hover:text-gray-900 text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </button>
                    <button className="flex items-center bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded border-2 border-dashed border-gray-200 h-48 flex items-center justify-center">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">PDF Preview</p>
                    <p className="text-xs text-gray-400">Click preview to view full document</p>
                  </div>
                </div>
              </div>
            </div>
            </div>
          </div>

          {/* Right Column - AI Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <h2 className="text-lg font-medium text-gray-900">AI Summary</h2>
                </div>
                <button
                  onClick={handleRegenerateSummary}
                  disabled={isRegenerating}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
                  {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                </button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4 text-justify ">
                <p className="text-sm text-gray-700 leading-relaxed ">{reportData.aiSummary}</p>
              </div>
              <div className="text-xs text-gray-500 mb-4">
                <span className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Analysis confidence: 92%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
            <Edit className="w-4 h-4 mr-2" />
            Edit Report
          </button>
          <button
            onClick={handleShare}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share Report
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete Report
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Report</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this report? This action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={handleDelete}
                className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Share Report</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share Link</label>
                <div className="flex">
                  <input
                    type="text"
                    value={`https://arogyayatra.com/report/${reportId}`}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-3 py-2 bg-blue-600 text-white rounded-r-lg hover:bg-blue-700 text-sm"
                  >
                    Copy
                  </button>
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
