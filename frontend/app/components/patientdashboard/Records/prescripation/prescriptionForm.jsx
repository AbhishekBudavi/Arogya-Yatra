'use client'
import React, { useState, useEffect} from 'react';
import { Upload, ArrowLeft, FileText, Calendar, User, Clipboard, X, CheckCircle, Eye, ArrowRight, Download, Share2 } from 'lucide-react';
import Calendar22 from '../../../../components/datepicker';
import Link from 'next/link';

import { useRouter, useSearchParams } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";
import axios from '../../../../utils/api'

export default function PrescriptionForm({backDashboard,goBack,base}) {
    const router = useRouter();
  const searchParams = useSearchParams();
  const reportId = searchParams.get("reportId");
  const [formData, setFormData] = useState({
    prescriptionTitle: '',
    dateIssued: '',
    doctorName: '',
    patientName: '',
    file: null
  });
const [medicines, setMedicines] = useState([
  { name: '', morning: '', afternoon: '', evening: '' }
]);


  const [dragActive, setDragActive] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showCard, setShowCard] = useState(false);
 const [uploadedReportId, setUploadedReportId] = useState(null);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleMedicineChange = (index, field, value) => {
  const updated = [...medicines];
  updated[index][field] = value;
  setMedicines(updated);
};
const addNewMedicine = () => {
  setMedicines([...medicines, { name: '', morning: '', afternoon:'', evening: '' }]);
};


  const handleFileUpload = (file) => {
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setFormData(prev => ({ ...prev, file }));
      setFileUploaded(true);
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

  useEffect(() => {
      if (!reportId) return;
  
      const fetchReport = async () => {
        try {
          const { data } = await axios.get(`/patient/prescriptionReports`);
          const report = data.labReports.find((r) => r.id === parseInt(reportId));
  
          if (report) {
            const { title, date, documentCategory, doctorName, notes, medicines } =
              report.document_data || {};
            setFormData((prev) => ({
              ...prev,
              prescriptionTitle: title || "",
              dateIssued: date || "",
              doctorName: doctorName || "",
              patientName: patientName || "",
              medicines : medicines || "" ,
              notes: notes || "",
            }));
          }
        } catch (error) {
          console.error("Error loading report:", error);
        }
      };
  
      fetchReport();
    }, [reportId]);

 const uploadDocument = async (payload, reportId) => {
     try {
       const formDataToSend = new FormData();
       if (payload.file) formDataToSend.append("file", payload.file);
       formDataToSend.append("documentType", payload.documentType);
       formDataToSend.append(
         "document_data",
         JSON.stringify(payload.document_data)
       );
 
       const url = reportId
              ? `/patient/update-document/${reportId}`
              : `/patient/upload-report`;
            const method = reportId ? "put" : "post";
      
            const { data } = await axios[method](url, formDataToSend, {
              headers: { "Content-Type": "multipart/form-data" },
            });
      
            return data;
          } catch (error) {
            console.error("Upload failed:", error.response?.data || error.message);
            throw error;
          }
        };
   // Handle form submit
  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.prescriptionTitle || !formData.file) {
    alert("Please fill all required fields and upload a file.");
    return;
  }

  setIsUploading(true);

  const payload = {
    documentType: "prescription", 
   document_data: {
  title: formData.prescriptionTitle,
  date: formData.dateIssued,
  doctorName: formData.doctorName,
  patientName: formData.patientName,
medicines: medicines.map(med => ({
    name: med.name,
    schedule: {
        morning: med.morning ?? 0,
      afternoon: med.afternoon ?? 0,
      evening: med.evening ?? 0
    }
  }))
},

    file: formData.file,
  };

  try {
    const response = await uploadDocument(payload, reportId);
    // Get new report ID (for newly created report)
      const newReportId = reportId || response.document?.id;

      // Track new report ID for button usage
      setUploadedReportId(newReportId);

      // Navigate immediately if it’s a new report
      if (!reportId && newReportId) {
        handleViewReport(newReportId);
      }

      alert(
        reportId
          ? "Report updated successfully!"
          : "Report created successfully!"
      );
      setShowCard(true);
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Failed to submit form.");
    } finally {
      setIsUploading(false);
    }
  };

  const prescriptionData = {
    title: formData.prescriptionTitle,
    doctor: formData.doctorName,
    patient: formData.patientName,
    date: formData.dateIssued ? new Date(formData.dateIssued).toISOString().slice(0, 10) : 'Not specified',
    fileName: formData.file?.name || 'Prescription.pdf',
    fileSize: formData.file ? `${(formData.file.size / 1024 / 1024).toFixed(1)} MB` : 'Unknown',
    uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  };
 const handleViewReport = (id = null) => {
  const reportToView = id || uploadedReportId;
  if (!reportToView) return;
  router.push(`/dashboard/patient/records/prescription/${reportToView}`);
};

  const handleDownload = () => alert('Downloading report...');
  const handleShare = () => alert('Opening share options...');
  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {goBack &&
        <Link href={goBack}>
          <button className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go back
          </button>
        </Link>
}

        {!showCard ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6">
            <h1 className="text-2xl font-semibold text-gray-900 mb-2">Upload Prescription</h1>
            <p className="text-sm text-gray-500 mb-6">Submit your e-prescription for safe storage and future reference.</p>

            {/* Prescription Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Prescription Title <span className="text-red-500">*</span></label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="prescriptionTitle"
                  value={formData.prescriptionTitle}
                  onChange={handleInputChange}
                  placeholder="e.g., General Checkup - July 2025"
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Date Issued */}
            <Calendar22
              value={formData.dateIssued ? new Date(formData.dateIssued) : undefined}
              onChange={(date) => setFormData(prev => ({ ...prev, dateIssued: date?.toISOString() }))}
            />

            {/* Doctor Name */}
            <div className='pt-3'>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Doctor Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="doctorName"
                  value={formData.doctorName}
                  onChange={handleInputChange}
                  placeholder="e.g., Dr. Anjali Singh"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Patient Name */}
            <div className='pt-3'>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Patient Name</label>
              <div className="relative">
                <Clipboard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleInputChange}
                  placeholder="e.g., Abhishek Budavi"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Medicines */}
           <div className="bg-white p-6 mt-4 rounded-lg shadow-sm border border-gray-200">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-gray-900">Prescribed Medicines</h2>
    <button
      onClick={addNewMedicine}
      className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
    >
      + Add Medicine
    </button>
  </div>

  <div className="overflow-x-auto">
    <table className="min-w-full text-sm border border-gray-200 rounded-lg">
      <thead className="bg-blue-50 text-gray-700">
        <tr>
          <th className="px-4 py-2 text-left">Medicine</th>
           <th className="px-4 py-2 text-center">Morning 🌞</th>
           <th className="px-4 py-2 text-center">AfterNoon</th>
           <th className="px-4 py-2 text-center">Evening 🌙</th>
        </tr>
      </thead>
      <tbody>
        {medicines.map((med, index) => (
          <tr key={index} className="border-b hover:bg-gray-50">
            <td className="px-4 py-2">
              <input
                type="text"
                placeholder="e.g. Paracetamol"
                value={med.name}
                onChange={(e) => handleMedicineChange(index, 'name', e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </td>
            <td className="px-4 py-2 text-center">
              <input
                type="text"
                placeholder="e.g. 1 tab"
                value={med.morning}
                onChange={(e) => handleMedicineChange(index, 'morning', e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </td>
            <td className="px-4 py-2 text-center">
              <input
                type="text"
                placeholder="e.g. 1 tab"
                value={med.afternoon}
                onChange={(e) => handleMedicineChange(index, 'afternoon', e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </td>
              <td className="px-4 py-2 text-center">
              <input
                type="text"
                placeholder="e.g. 1 tab"
                value={med.evening}
                onChange={(e) => handleMedicineChange(index, 'evening', e.target.value)}
                className="w-full border rounded px-2 py-1 text-sm"
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
</div>


            {/* File Upload */}
            <div className='pt-3'>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Upload File <span className="text-red-500">*</span></label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 transition-colors ${
                  dragActive ? 'border-blue-500 bg-blue-50' : fileUploaded ? 'border-green-500 bg-green-50' : 'border-gray-300'
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
                  <Upload className={`mx-auto w-12 h-12 mb-4 ${fileUploaded ? 'text-green-500' : 'text-gray-400'}`} />
                  <p className="text-sm text-gray-600 mb-2">
                    {fileUploaded ? 'File uploaded successfully!' : 'Drag & drop or click to upload'}
                  </p>
                  <p className="text-xs text-gray-500">Supported formats: PDF, JPG, PNG</p>
                  {formData.file && <p className="text-sm text-blue-600 mt-2">{formData.file.name}</p>}
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className='pt-3'>
              <button
                type="submit"
                disabled={isUploading || !formData.prescriptionTitle || !formData.dateIssued || !formData.file}
                className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isUploading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Uploading...
                  </div>
                ) : (
                  'Upload Prescription'
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="w-full max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-lg border overflow-hidden">
              <div className="flex justify-end p-2">
                <button onClick={() => setShowCard(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="text-center px-6 pb-6">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-3">Upload Successful! ✨</h2>
                <p className="text-sm text-gray-600">Your prescription is now stored and ready for viewing.</p>
              </div>
              <div className="px-8 py-6 border-t border-gray-100 space-y-3">
                <InfoRow label="Prescription ID" value={prescriptionData.id} mono />
                <InfoRow label="Title" value={prescriptionData.title} />
                <InfoRow label="Doctor" value={prescriptionData.doctor} />
                <InfoRow label="Patient" value={prescriptionData.patient} />
                <InfoRow label="Date" value={prescriptionData.date} icon={<Calendar className="w-4 h-4 mr-2" />} />
                <InfoRow label="File" value={`${prescriptionData.fileName} (${prescriptionData.fileSize})`} />
                <InfoRow label="Uploaded" value={`Today at ${prescriptionData.uploadTime}`} />
              </div>
              <div className="p-6 space-y-3">
                <button onClick={() => handleViewReport(reportId)} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center">
                  <Eye className="w-4 h-4 mr-2" /> View Prescription <ArrowRight className="w-4 h-4 ml-2" />
                </button>
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">
                    <Download className="w-4 h-4 mr-1" /> Download
                  </button>
                  <button className="flex items-center justify-center py-2 px-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm">
                    <Share2 className="w-4 h-4 mr-1" /> Share
                  </button>
                </div>
              </div>
              <div className="bg-blue-50 px-6 py-3 border-t border-blue-100">
                <p className="text-sm text-blue-800">You can find this under “My Records” in your dashboard.</p>
              </div>
            </div>
            <div className="mt-4 text-center">
                {backDashboard &&
              <Link href={backDashboard}>
                <button className="text-sm text-gray-600 hover:text-gray-900">← Back to Dashboard</button>
              </Link>
}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value, icon = null, mono = false }) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-gray-700 font-medium">{label}:</span>
      <div className={`flex items-center text-gray-900 ${mono ? 'font-mono' : ''}`}>
        {icon}{value}
      </div>
    </div>
  );
}
