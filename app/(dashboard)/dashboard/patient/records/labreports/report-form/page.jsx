'use client'
import React, { useState } from 'react';
import { Upload, ArrowLeft, FileText, Calendar, User, Clipboard, Bot, X, CheckCircle, Eye, ArrowRight, Download, Share2 } from 'lucide-react';
import Calendar22 from '../../../../../../components/datepicker'
import Link from 'next/link'
import { ScrollArea } from "@/components/ui/scroll-area";

export default function LabReportUpload() {
  const [formData, setFormData] = useState({
    reportTitle: '',
    reportType: '',
    reportDate: '',
    doctorName: '',
    notes: '',
    file: null
  });

  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [aiSummary, setAiSummary] = useState('Waiting for upload...');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const reportTypes = [
    'Blood Test', 'Urine Test', 'X-Ray', 'ECG', 'MRI', 'CT Scan', 'Ultrasound', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (file) => {
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setFormData(prev => ({ ...prev, file }));
      setFileUploaded(true);
      setAiSummary('Analyzing your report...');
      setTimeout(() => {
        setAiSummary('Blood test results show normal glucose levels (85 mg/dL), slightly elevated cholesterol (210 mg/dL), and healthy kidney function markers. White blood cell count is within normal range. Overall health indicators are good with minor attention needed for cholesterol management.');
      }, 3000);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      setShowCard(true);
    }, 2000);
  };
const reportData = {
  id: 'RPT-' + Math.floor(10000 + Math.random() * 90000),
  title: formData.reportTitle,
  type: formData.reportType,
  date: formData.reportDate ? new Date(formData.reportDate).toISOString().slice(0, 10) : 'Not specified',
  fileName: formData.file?.name || 'Uploaded_Report.pdf',
  fileSize: formData.file ? `${(formData.file.size / 1024 / 1024).toFixed(1)} MB` : 'Unknown',
  uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
};


  const handleViewReport = () => alert('Opening report details...');
  const handleDownload = () => alert('Downloading report...');
  const handleShare = () => alert('Opening share options...');

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/patient/records">
          <button className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go back
          </button>
        </Link>

        {!showCard ? (
          <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8">
            <div className="mb-8">
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">Upload Lab Report</h1>
              <p className="text-sm text-gray-500">Add your diagnostic report and we'll generate a summary and store.</p>
            </div>
            {/* All Form Code Here (unchanged) */}
            {/* Replace last Submit Button with below */}
            <div className="space-y-6">
  {/* Report Title */}
  <div className='pt-2'>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Report Title <span className="text-red-500">*</span>
    </label>
    <div className="relative">
      <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        name="reportTitle"
        value={formData.reportTitle}
        onChange={handleInputChange}
        placeholder="e.g., Blood Test - July 2025"
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        required
      />
    </div>
  </div>

  {/* Report Type */}
  <div className='pt-4'>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Report Type / Category <span className="text-red-500">*</span>
    </label>
    <select
      name="reportType"
      value={formData.reportType}
      onChange={handleInputChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      required
    >
      <option value="">Select report type</option>
      {reportTypes.map(type => (
        <option key={type} value={type}>{type}</option>
      ))}
    </select>
  </div>

  {/* Report Date */}
  <div className='pt-4'>
    <Calendar22
      value={formData.reportDate ? new Date(formData.reportDate) : undefined}
      onChange={(date) => {
        setFormData(prev => ({
          ...prev,
          reportDate: date?.toISOString()
        }));
      }}
    />
  </div>

  {/* Doctor Name */}
  <div className='pt-4'>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Doctor Name
    </label>
    <div className="relative">
      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        name="doctorName"
        value={formData.doctorName}
        onChange={handleInputChange}
        placeholder="e.g., Dr. Ramesh Kumar"
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
  </div>

  {/* Notes */}
  <div className='pt-4'>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Notes / Description
    </label>
    <div className="relative">
      <Clipboard className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
      <textarea
        name="notes"
        value={formData.notes}
        onChange={handleInputChange}
        placeholder="Brief info or symptoms (optional)"
        rows={3}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  </div>

  {/* File Upload */}
  <div className='pt-4'>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      Upload File <span className="text-red-500">*</span>
    </label>
    <div
      className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
        dragActive 
          ? 'border-blue-500 bg-blue-50' 
          : fileUploaded 
            ? 'border-green-500 bg-green-50' 
            : 'border-gray-300 hover:border-gray-400'
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileInputChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      />
      <div className="text-center">
        <Upload className={`mx-auto w-12 h-12 mb-4 ${
          fileUploaded ? 'text-green-500' : 'text-gray-400'
        }`} />
        <p className="text-sm text-gray-600 mb-2">
          {fileUploaded ? 'File uploaded successfully!' : 'Drag and drop your file here, or click to browse'}
        </p>
        <p className="text-xs text-gray-500">
          Supports PDF, JPG, PNG files
        </p>
        {formData.file && (
          <p className="text-sm text-blue-600 mt-2 font-medium">
            {formData.file.name}
          </p>
        )}
      </div>
    </div>
  </div>

  {/* AI Summary */}
  <div className='pt-4'>
    <div className="flex items-center mb-3">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-lg mr-3">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">AI-Generated Summary</h3>
        <p className="text-xs text-gray-500">Powered by advanced medical AI</p>
      </div>
    </div>
    <div className="relative bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 border border-blue-200 rounded-xl p-6 shadow-sm">
      {!fileUploaded ? (
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <p className="text-gray-500 text-sm">Waiting for file upload...</p>
            <p className="text-xs text-gray-400 mt-1">AI will analyze your report once uploaded</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
              <span className="text-sm font-medium text-green-700">Analysis Complete</span>
            </div>
            <div className="bg-white bg-opacity-60 px-2 py-1 rounded-full">
              <span className="text-xs text-gray-600">95% Confidence</span>
            </div>
          </div>
          <ScrollArea className="h-40 rounded-md border border-gray-200">
            <div className="bg-white bg-opacity-70 rounded-lg p-4 border border-white border-opacity-50">
              <p className="text-sm tracking-wider text-justify text-gray-700 leading-relaxed">
                {aiSummary}
              </p>
            </div>
          </ScrollArea>
          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>
                <span>Key findings identified</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-purple-400 rounded-full mr-1"></div>
                <span>Recommendations included</span>
              </div>
            </div>
            <button className="text-blue-600 hover:text-blue-700 text-xs font-medium">
              View detailed analysis →
            </button>
          </div>
        </div>
      )}
    </div>
  </div>

  {/* Submit Button */}
  <div className="pt-4">
    <button
      type="button"
      onClick={handleSubmit}
      disabled={isUploading || !formData.reportTitle || !formData.reportType || !formData.reportDate || !formData.file}
      className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
    >
      {isUploading ? (
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Uploading...
        </div>
      ) : (
        'Upload Report'
      )}
    </button>
  </div>
</div>

            
          </div>
        ) : (
          <div className="w-full max-w-xl mx-auto transition-all duration-500 transform">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="flex justify-end p-2">
                <button onClick={() => setShowCard(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center px-6 pb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-3">
                  Upload Successful! ✨
                </h2>
                <p className="text-sm text-gray-600">Your lab report has been processed and is ready to view</p>
              </div>
              <div className="relative bg-gradient-to-r from-gray-50/80 to-gray-50/60 backdrop-blur-sm px-8 py-6 border-y border-gray-100/50">
                <InfoRow label="Report ID"  value={reportData.id} mono highlight />
                <InfoRow label="Title" value={reportData.title} className="mb-4" />
                <InfoRow label="Type" value={reportData.type} className="mb-4" badge/>
                <InfoRow label="Date" value={reportData.date} className="mb-4" icon={<Calendar className="w-4 h-4 mr-2" />} />
                <InfoRow label="File" value={`${reportData.fileName} (${reportData.fileSize})`}  className="mb-4"  icon={<FileText className="w-4 h-4 mr-1" />} />
                <InfoRow label="Uploaded" value={`Today at ${reportData.uploadTime}`}  className="mb-4" />
              </div>
              <div className="p-6 space-y-3">
                <button onClick={handleViewReport} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center">
                  <Eye className="w-4 h-4 mr-2" /> View Report Details <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <div className="grid grid-cols-2 gap-3 pt-6">
                  <button onClick={handleDownload} className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                    <Download className="w-4 h-4 mr-1" /> Download
                  </button>
                  <button onClick={handleShare} className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                    <Share2 className="w-4 h-4 mr-1" /> Share
                  </button>
                </div>
              </div>
              <div className="bg-blue-50 px-6 py-3 border-t border-blue-100">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  <div>
                    <p className="text-sm text-blue-800 font-medium">AI Analysis Complete</p>
                    <p className="text-xs text-blue-600">Your report has been analyzed and a summary is available in the details view.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-4 text-center">
              <Link href="/dashboard/patient/records">
              <button onClick={() => setShowCard(false)} className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Continue to Dashboard →
              </button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon = null, mono = false }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700 font-medium">{label}:</span>
      <div className={`flex items-center text-gray-900 ${mono ? 'font-mono' : ''}`}>{icon}{value}</div>
    </div>
  );
}
