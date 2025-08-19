'use client';
import React, { useEffect, useState } from 'react';
import {
  X, CheckCircle, Eye, ArrowRight, Download,
  Share2, Calendar, FileText
} from 'lucide-react';

export default function UploadSuccessCard({ reportData, onClose }) {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleViewReport = () => alert('Opening report details...');
  const handleDownload = () => alert('Downloading report...');
  const handleShare = () => alert('Opening share options...');

  return (
    <div className="w-full max-w-md transition-all duration-500 transform mx-auto p-4 mt-6
      bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden
      animate-fade-in"
      style={{ transform: animate ? 'scale(1)' : 'scale(0.95)', opacity: animate ? 1 : 0 }}
    >
      {/* Close */}
      <div className="flex justify-end p-2">
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Message */}
      <div className="text-center px-6 pb-6">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Report Uploaded Successfully!</h2>
        <p className="text-sm text-gray-600">Your lab report has been processed and is ready to view.</p>
      </div>

      {/* Report Details */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 space-y-3 text-sm">
        <InfoRow label="Report ID" value={reportData.id || 'N/A'} mono />
        <InfoRow label="Title" value={reportData.title} />
        <InfoRow label="Type" value={reportData.type} />
        <InfoRow
          label="Date"
          value={reportData.date}
          icon={<Calendar className="w-4 h-4 mr-1" />}
        />
        <InfoRow
          label="File"
          value={`${reportData.fileName} (${reportData.fileSize})`}
          icon={<FileText className="w-4 h-4 mr-1" />}
        />
        <InfoRow label="Uploaded" value={`Today at ${reportData.uploadTime}`} />
      </div>

      {/* Action Buttons */}
      <div className="p-6 space-y-3">
        <button
          onClick={handleViewReport}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
        >
          <Eye className="w-4 h-4 mr-2" />
          View Report Details
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            <Download className="w-4 h-4 mr-1" />
            Download
          </button>
          <button
            onClick={handleShare}
            className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm"
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </button>
        </div>
      </div>

      {/* AI Analysis Info */}
      <div className="bg-blue-50 px-6 py-3 border-t border-blue-100">
        <div className="flex items-start">
          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
          <div>
            <p className="text-sm text-blue-800 font-medium">AI Analysis Complete</p>
            <p className="text-xs text-blue-600">
              Your report has been analyzed and a summary is available in the details view.
            </p>
          </div>
        </div>
      </div>

      {/* Back to Dashboard */}
      <div className="mt-4 text-center">
        <button
          onClick={onClose}
          className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Continue to Dashboard →
        </button>
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon = null, mono = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 font-medium">{label}:</span>
      <div className={`flex items-center text-gray-900 ${mono ? 'font-mono' : ''}`}>
        {icon}
        {value}
      </div>
    </div>
  );
}
