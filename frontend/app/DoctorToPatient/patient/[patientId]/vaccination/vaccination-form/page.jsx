"use client";
import React, { useState } from "react";
import {
  Upload,
  ArrowLeft,
  FileText,
  Calendar,
  Clipboard,
  X,
  CheckCircle,
  Eye,
  ArrowRight,
  Download,
  Share2,
} from "lucide-react";
import Calendar22 from "../../../../../../components/datepicker";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function VaccinationUpload() {
  const [formData, setFormData] = useState({
    vaccinationId: "",
    vaccinationFor: "",
    vaccinationDate: "",
    validityDate: "",
    description: "",
    file: null,
  });

  const [dragActive, setDragActive] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [showCard, setShowCard] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (file) => {
    if (
      file &&
      (file.type === "application/pdf" || file.type.startsWith("image/"))
    ) {
      setFormData((prev) => ({ ...prev, file }));
      setFileUploaded(true);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
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
    e.preventDefault();
    if (!formData.vaccinationDate || !formData.file) {
      alert("Vaccination Date and File are required!");
      return;
    }
    setShowCard(true);
  };

  const vaccinationData = {
    id:
      formData.vaccinationId ||
      "VAC-" + Math.floor(10000 + Math.random() * 90000),
    vaccine: formData.vaccinationFor,
    date: formData.vaccinationDate,
    validity: formData.validityDate || "Not specified",
    fileName: formData.file?.name || "Vaccination_Certificate.pdf",
    fileSize: formData.file
      ? `${(formData.file.size / 1024 / 1024).toFixed(1)} MB`
      : "Unknown",
    uploadTime: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link href="/dashboard/patient/records">
          <button className="flex items-center text-gray-600 hover:text-gray-900 mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" /> Go back
          </button>
        </Link>

        {!showCard ? (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-md p-6 sm:p-8 space-y-6"
          >
            <h1 className="text-2xl font-semibold text-gray-900">
              Upload Vaccination Record
            </h1>

            {/* Vaccination ID */}
           

            {/* Vaccination For */}
            <div className="pt-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Vaccination For
              </label>
              <select
                name="vaccinationFor"
                value={formData.vaccinationFor}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg"
              >
                <option value="">Select vaccine</option>
                <option value="COVID-19">COVID-19</option>
                <option value="Hepatitis B">Hepatitis B</option>
                <option value="MMR">MMR (Measles, Mumps, Rubella)</option>
                <option value="Tetanus">Tetanus</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Vaccination Date */}
            <div className="pt-3">
              <Calendar22
                name="vaccinationDate"
                label="Vaccination Date"
                value={
                  formData.vaccinationDate
                    ? new Date(formData.vaccinationDate)
                    : undefined
                }
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    vaccinationDate: date?.toISOString(),
                  }))
                }
              />
            </div>

            {/* Validity Date */}
            <div>
              
              <Calendar22
               name="vaccination valid Date"
                label="Vaccination valid Date"
                value={
                  formData.validityDate
                    ? new Date(formData.validityDate)
                    : undefined
                }
                onChange={(date) =>
                  setFormData((prev) => ({
                    ...prev,
                    validityDate: date?.toISOString(),
                  }))
                }
              />
            </div>

            {/* Description */}
            <div className="pt-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <div className="relative">
                <Clipboard className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg resize-none"
                  placeholder="Any relevant notes or symptoms..."
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="pt-3">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Upload File <span className="text-red-500">*</span>
              </label>
              <div
                className={`relative border-2 border-dashed rounded-lg p-6 ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onDragEnter={(e) => {
                  setDragActive(true);
                  e.preventDefault();
                }}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={handleFileInputChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                <div className="text-center">
                  <Upload className="mx-auto w-10 h-10 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    {fileUploaded
                      ? `Uploaded: ${formData.file.name}`
                      : "Drag and drop or click to upload"}
                  </p>
                  <p className="text-xs text-gray-500">
                    PDF, JPG, PNG up to 10MB
                  </p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-5">
             <button
      type="button"
      onClick={handleSubmit}
      disabled={isUploading || !formData.vaccinationFor || !formData.vaccinationDate || !formData.validityDate || !formData.description || formData.file}
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
          </form>
        ) : (
          <div className="w-full max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6">
            <div className="flex justify-end">
              <button onClick={() => setShowCard(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Upload Successful!</h2>
              <p className="text-sm text-gray-600 mb-4">
                Your vaccination record has been saved.
              </p>

              <div className="text-sm text-left space-y-2">
                <p>
                  <strong>ID:</strong> {vaccinationData.id}
                </p>
                <p>
                  <strong>For:</strong> {vaccinationData.vaccine}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(vaccinationData.date).toLocaleDateString()}
                </p>
                <p>
                  <strong>Validity:</strong>{" "}
                  {vaccinationData.validity !== "Not specified"
                    ? new Date(vaccinationData.validity).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>File:</strong> {vaccinationData.fileName} (
                  {vaccinationData.fileSize})
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-6">
                <button
                  onClick={() =>
                    router.push("/dashboard/patient/records/vaccinations")
                  }
                  className="bg-blue-600 text-white py-2 rounded-lg"
                >
                  <Eye className="inline w-4 h-4 mr-1" /> View Record
                </button>
                <button
                  onClick={() => alert("Downloading...")}
                  className="border py-2 rounded-lg"
                >
                  <Download className="inline w-4 h-4 mr-1" /> Download
                </button>
              </div>

              <div className="mt-4">
                <Link href="/dashboard/patient/records">
                  <button className="text-sm text-gray-600 hover:text-gray-900">
                    ← Return to Dashboard
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
