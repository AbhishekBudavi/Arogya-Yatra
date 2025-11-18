'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Download, Edit, Trash2, RefreshCw, Share2, Sparkles, CheckCircle,
  Clock, User, Calendar, FileText, Eye
} from 'lucide-react';
import Link from 'next/link';
// use the shared API wrapper (keeps baseURL/auth/etc centralized)
import api from '../../../../../utils/api';
import axios from 'axios';

export default function PrescriptionDetails() {
  const params = useParams();
  const router = useRouter();
  // The route folder is [prescriptionId] so read that param. Keep reportId as fallback
  const prescriptionId = params?.prescriptionId ?? params?.reportId;
  const [prescriptionData, setPrescriptionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
   const fetchReport = async () => {
     try {
       const res = await api.get(`/patient/prescriptionReports`);
       const allReports = res.data.prescriptionReports;
       const report = allReports.find(r => r.id === parseInt(prescriptionId));
 
       if (!report) {
         throw new Error('Report not found');
       }
 
       setPrescriptionData(report);
     } catch (err) {
       console.error('Error fetching report:', err);
       setPrescriptionData(null);
     } finally {
       setLoading(false);
     }
   };
 
   if (prescriptionId) fetchReport();
 }, [prescriptionId]);
 const handleEdit = () => {
    // Redirect to form page with reportId as query param
    router.push(`/dashboard/patient/records/prescription/prescription-report?prescriptionId=${prescriptionId}`);
  };
const handleDeleteReport = async () => {
  if (!confirm("Are you sure you want to delete this report?")) return;
    try {
      await api.delete(`/patient/delete-document/${prescriptionId}`);
      setShowDeleteModal(false);
      alert("Report deleted successfully!");
      router.push("/dashboard/patient/records/prescription/prescription-records");
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete report.");
    }
  };

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



  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!prescriptionData) return <div className="min-h-screen flex items-center justify-center text-red-500">Prescription not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <Link href="/dashboard/patient/records/prescription/prescription-records" className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" /> All Prescriptions
        </Link>

        <h1 className="text-2xl font-bold text-gray-900 mb-6">Prescription Details</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">Prescription Info</h2>
             
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Prescription ID</p>
                  <p className="text-sm font-mono">{prescriptionData.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Title</p>
                  <p className="text-sm">{prescriptionData.document_data?.title}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doctor</p>
                  <p className="text-sm">{prescriptionData.document_data?.doctorName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date</p>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    <p className="text-sm">{prescriptionData.document_data?.date}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-3">
                              <div>
                                <label className="text-sm font-medium text-gray-500">Uploaded By</label>
                                <div className="flex items-center">
                                  <User className="w-4 h-4 text-gray-400 mr-1 mt-3" />
                                  <p className="text-sm text-gray-900 pt-1">{prescriptionData.created_by}</p>
                                </div>
                              </div>
                            
                              <div>
                                <label className="text-sm font-medium text-gray-500">Last Updated</label>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 text-gray-400 mr-1 mt-3" />
                                  <p className="text-sm text-gray-900 pt-1 ">{new Date(prescriptionData.updated_at).toLocaleString()}</p>
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
                      <p className="text-sm font-medium text-gray-900">{prescriptionData.document_name}</p>
                
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                     <Link href={`http://localhost:5000${prescriptionData.document_url}`} >
                    <button className="flex items-center pr-3 text-gray-600 hover:text-gray-900 text-sm">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </button>
                    </Link>
                      <Link   href={`http://localhost:5000${prescriptionData.document_url}`} >

                    <button className="flex items-center bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                      <Download className="w-4 h-4 mr-1" />
                      Download
                    </button>
                    </Link>
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
          <button 
          onClick={handleEdit}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
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
                onClick={handleDeleteReport}
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
