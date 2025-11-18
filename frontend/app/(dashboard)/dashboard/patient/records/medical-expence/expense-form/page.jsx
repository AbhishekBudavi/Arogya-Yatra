"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import axios from '../../../../../../utils/api'
import {
  CalendarDays,
  Plus,
  X,
  Upload,
  ArrowLeft,
  User,
  Heart,
  Building,
  AlertCircle,
} from "lucide-react";

const EXPENSE_TYPES = [
  { value: "Consultation", label: "Consultation" },
  { value: "Medication", label: "Medication" },
  { value: "Surgery", label: "Surgery" },
  { value: "Diagnostic", label: "Diagnostic Tests" },
  { value: "Other", label: "Other" },
];

const INITIAL_EXPENSE_ROW = { type: "", amount: "", notes: "", id: Date.now() };

export default function MedicalExpensesForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const expenseId = searchParams.get("expenseId");

  const [expenseRows, setExpenseRows] = useState([{ ...INITIAL_EXPENSE_ROW }]);
  const [patientInfo, setPatientInfo] = useState({ fullName: "" });
  const [hospitalInfo, setHospitalInfo] = useState({
    hospital: "",
    doctor: "",
    department: "",
  });
  const [expenseDate, setExpenseDate] = useState("");
  const [receiptFile, setReceiptFile] = useState({
    file: null
  });
  const [fileUploaded, setFileUploaded] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedExpenseId, setUploadedExpenseId] = useState(null);

  // Fetch existing expense data
  useEffect(() => {
    if (!expenseId) return;

    const fetchExpense = async () => {
      try {
        const { data } = await axios.get(`/patient/medical-expenses`);
        const expense = data.expenses.find((e) => e.id === parseInt(expenseId));

        if (expense) {
          const { fullName, expenseDate, hospitalName, doctorName, department, expenses: expenseItems } =
            expense.document_data || {};
          
          setPatientInfo({ fullName: fullName || "" });
          setExpenseDate(expenseDate || "");
          setHospitalInfo({
            hospital: hospitalName || "",
            doctor: doctorName || "",
            department: department || "",
          });
          
          if (expenseItems?.length > 0) {
            setExpenseRows(expenseItems);
          }
        }
      } catch (err) {
        setError("Failed to load expense data");
        console.error("Error loading expense:", err);
      }
    };

    fetchExpense();
  }, [expenseId]);

  // Handlers
  const handleAddRow = useCallback(() => {
    setExpenseRows((prev) => [
      ...prev,
      { type: "", amount: "", notes: "", id: Date.now() },
    ]);
  }, []);

  const handleRemoveRow = useCallback((id) => {
    setExpenseRows((prev) => prev.filter((row) => row.id !== id));
  }, []);

  const handleExpenseChange = useCallback((id, field, value) => {
    setExpenseRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  }, []);

const handleFileUpload = (file) => {
    if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
      setReceiptFile({ file });
      setFileUploaded(true);
    } else {
      setError("Please upload a valid PDF or image file");
    }
  };


  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(["dragenter", "dragover"].includes(e.type));
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  }, [handleFileUpload]);

  const uploadDocument = async (payload, expenseId) => {
    try {
      const formDataToSend = new FormData();
      if (payload.file) formDataToSend.append("file", payload.file);
      formDataToSend.append("documentType", payload.documentType);
      formDataToSend.append(
        "document_data",
        JSON.stringify(payload.document_data)
      );

      const url = expenseId
        ? `/patient/update-report/${expenseId}`
        : `/patient/upload-report`;
      const method = expenseId ? "put" : "post";

      const { data } = await axios[method](url, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return data;
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsUploading(true);

    // Validation
    if (!patientInfo.fullName.trim()) {
      setError("Patient name is required");
      setIsUploading(false);
      return;
    }

    if (!expenseDate) {
      setError("Expense date is required");
      setIsUploading(false);
      return;
    }

    if (!hospitalInfo.hospital.trim()) {
      setError("Hospital/Clinic name is required");
      setIsUploading(false);
      return;
    }

    const payload = {
      documentType: "medicalExpenses",
      document_data: {
        title: hospitalInfo.hospital,
        fullName: patientInfo.fullName,
        expenseDate,
        hospitalName: hospitalInfo.hospital,
        doctorName: hospitalInfo.doctor,
        department: hospitalInfo.department,
        expenses: expenseRows,
      },
      file: receiptFile.file,
    };

    try {
      const response = await uploadDocument(payload, expenseId);
      const newExpenseId = expenseId || response.document?.id;
      setUploadedExpenseId(newExpenseId);

      // Show success message
      const successMessage = expenseId
        ? "Expense updated successfully!"
        : "Expense created successfully!";
      
      alert(successMessage);

      // Custom routing after successful submission
      if (!expenseId) {
        // For new expense: navigate to the expense details page
        router.push(
          `/dashboard/patient/records/medical-expence/${newExpenseId}`
        );
      } else {
        // For updated expense: navigate to expense records list
        router.push(`/dashboard/patient/records/medical-expence/expense-records`);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        "Failed to submit form";
      setError(errorMessage);
      console.error("Submit error:", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span className="font-bold">Go back</span>
        </button>
      </div>

      {/* Main Form */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Medical Expenses Form</h1>
              <p className="text-blue-100 mt-1">Submit your medical expense details</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Error Alert */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {/* Patient Information */}
          <FormSection icon={User} title="Patient Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Patient ID</label>
                <input
                  type="text"
                  placeholder="Auto-generated ID"
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Full Name *</label>
                <input
                  type="text"
                  placeholder="Enter patient's full name"
                  value={patientInfo.fullName}
                  onChange={(e) =>
                    setPatientInfo({ ...patientInfo, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </FormSection>

          {/* Expense Details */}
          <FormSection icon={CalendarDays} title="Expense Details">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Date of Expense *</label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Upload Receipt</label>
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
                    dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                  }`}
                >
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Drag file here or</p>
                  <label className="text-blue-600 cursor-pointer font-semibold">
                    click to browse
                    <input
                      type="file"
                      accept=".pdf,image/*"
                      onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                      className="hidden"
                    />
                  </label>
                </div>
                {fileUploaded && receiptFile.file && (
                  <p className="text-sm text-green-600 font-semibold">✓ {receiptFile.file.name}</p>
                )}
              </div>
            </div>

            {/* Expense Items */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-gray-800">Expense Items</h3>
              {expenseRows.map((row) => (
                <ExpenseRow
                  key={row.id}
                  row={row}
                  onChangeField={(field, value) => handleExpenseChange(row.id, field, value)}
                  onRemove={() => handleRemoveRow(row.id)}
                  canRemove={expenseRows.length > 1}
                />
              ))}
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-xl font-bold"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Another Expense
              </button>
            </div>
          </FormSection>

          {/* Hospital Information */}
          <FormSection icon={Building} title="Doctor / Hospital Information">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input
                type="text"
                placeholder="Hospital/Clinic Name *"
                value={hospitalInfo.hospital}
                onChange={(e) =>
                  setHospitalInfo({ ...hospitalInfo, hospital: e.target.value })
                }
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Doctor Name *"
                value={hospitalInfo.doctor}
                onChange={(e) =>
                  setHospitalInfo({ ...hospitalInfo, doctor: e.target.value })
                }
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Department (Optional)"
                value={hospitalInfo.department}
                onChange={(e) =>
                  setHospitalInfo({ ...hospitalInfo, department: e.target.value })
                }
                className="md:col-span-2 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </FormSection>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 font-bold"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUploading}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 font-bold disabled:opacity-50"
            >
              {isUploading ? "Submitting..." : "Submit Form"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Components
function FormSection({ icon: Icon, title, children }) {
  return (
    <section className="space-y-6">
      <div className="flex items-center border-b border-gray-200 pb-3">
        <Icon className="w-5 h-5 text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      <div className="pt-4">{children}</div>
    </section>
  );
}

function ExpenseRow({ row, onChangeField, onRemove, canRemove }) {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
        <select
          value={row.type}
          onChange={(e) => onChangeField("type", e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Type</option>
          {EXPENSE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Amount (₹)"
          value={row.amount}
          onChange={(e) => onChangeField("amount", e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl"
        />
        <input
          type="text"
          placeholder="Description"
          value={row.notes}
          onChange={(e) => onChangeField("notes", e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-xl"
        />
        <button
          onClick={onRemove}
          disabled={!canRemove}
          className="p-3 text-red-500 hover:bg-red-50 rounded-xl disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
