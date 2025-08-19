'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Download, Edit, Trash2, RefreshCw, Share2, Sparkles, CheckCircle,
  Clock, User, Calendar, FileText, Eye
} from 'lucide-react';
import Link from 'next/link';

export default function PrescriptionDetails({allPrescription}) {
  const params = useParams();
  const prescriptionId = params?.prescriptionId;
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    if (!prescriptionId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/prescription/${prescriptionId}`);
        if (!res.ok) throw new Error('Failed to fetch prescription');
        const data = await res.json();
        setPrescriptionData(data);
      } catch (err) {
        console.error('Error fetching prescription:', err);
        setPrescriptionData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [prescriptionId]);

  const handleRegenerateSummary = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      setIsRegenerating(false);
      alert('AI Summary regenerated!');
    }, 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`https://arogyayatra.com/prescription/${prescriptionId}`);
    alert('Link copied to clipboard!');
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    alert('Prescription deleted!');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!prescriptionData) return <div className="min-h-screen flex items-center justify-center text-red-500">Prescription not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {allPrescription &&
        <Link href={allPrescription} className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> All Prescriptions
        </Link>
}

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Prescription Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Prescription Info</h2>
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600 font-medium">{prescriptionData.status}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Prescription ID</p>
                  <p className="text-sm font-mono">{prescriptionData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="text-sm">{prescriptionData.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="text-sm">{prescriptionData.doctorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <p className="text-sm">{prescriptionData.date}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 mt-4 rounded-lg shadow-sm border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Prescription File</h2>
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-blue-500 mr-2" />
                    <div>
                      <p className="text-sm">{prescriptionData.fileName}</p>
                      <p className="text-xs text-gray-500">{prescriptionData.fileSize}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="text-sm text-gray-600 mr-3 flex items-center">
                      <Eye className="w-4 h-4 mr-2" /> Preview
                    </button>
                    <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      <Download className="w-4 h-4 mr-1" /> Download
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - AI Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium flex items-center gap-2">
                  <Sparkles className="text-blue-500 w-5 h-5" />
                  AI Summary
                </h2>
                <button
                  onClick={handleRegenerateSummary}
                  className="text-sm text-blue-600 hover:text-blue-700 flex items-center"
                  disabled={isRegenerating}
                >
                  <RefreshCw className={`w-4 h-4 mr-1 ${isRegenerating ? 'animate-spin' : ''}`} />
                  {isRegenerating ? 'Regenerating...' : 'Regenerate'}
                </button>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
                {prescriptionData.aiSummary}
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-3 flex-wrap">
          <button className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
            <Edit className="w-4 h-4 mr-2" /> Edit
          </button>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
          >
            <Share2 className="w-4 h-4 mr-2" /> Share
          </button>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </button>
        </div>
      </div>

      {/* Modals (same as lab reports version) */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Share Prescription</h3>
            <input
              value={`https://arogyayatra.com/prescription/${prescriptionId}`}
              readOnly
              className="w-full border px-3 py-2 rounded mb-4 text-sm"
            />
            <button
              onClick={handleCopyLink}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
            >
              Copy Link
            </button>
            <button
              onClick={() => setShowShareModal(false)}
              className="ml-2 text-sm text-gray-600 hover:underline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Delete Prescription</h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this prescription? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:bg-gray-300 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
