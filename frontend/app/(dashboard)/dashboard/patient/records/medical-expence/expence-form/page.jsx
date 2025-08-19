"use client";
import React, { useState } from "react";
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CalendarDays,
  Plus,
  X,
  Upload,
  ArrowLeft,
  User,
  Heart,
  Building,
} from "lucide-react";

export default function MedicalExpensesForm() {
      const router = useRouter();


  const [expenseRows, setExpenseRows] = useState([
    { type: "", amount: "", notes: "", id: Date.now() },
  ]);
  const [patientInfo, setPatientInfo] = useState({
    fullName: "",
  });

  const [expenseDate, setExpenseDate] = useState("");
  const [receiptFile, setReceiptFile] = useState(null);

  const [hospitalInfo, setHospitalInfo] = useState({
    hospital: "",
    doctor: "",
    department: "",
  });

  const handleAddRow = () => {
    setExpenseRows([
      ...expenseRows,
      { type: "", amount: "", notes: "", id: Date.now() },
    ]);
  };

  const handleRemoveRow = (id) => {
    setExpenseRows(expenseRows.filter((row) => row.id !== id));
  };

  const handleChange = (id, field, value) => {
    setExpenseRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  const handleGoBack = () => {
    console.log("Going back...");
    router.back();
  };
 
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    formData.append("fullName", patientInfo.fullName);

    formData.append("expenseDate", expenseDate);

    if (receiptFile) {
      formData.append("receiptFile", receiptFile);
    }

    formData.append("expenses", JSON.stringify(expenseRows));
    formData.append("hospital", hospitalInfo.hospital);
    formData.append("doctor", hospitalInfo.doctor);
    formData.append("department", hospitalInfo.department);

    for (let pair of formData.entries()) {
      console.log(pair[0] + ":", pair[1]);
    }

    alert("Form data collected! See console for output.");
    router.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 sm:p-6">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
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
              <h1 className="text-2xl font-bold text-white">
                Medical Expenses Form
              </h1>
              <p className="text-blue-100 mt-1">
                Submit your medical expense details
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* 1. Patient Information */}
          <section className="space-y-6">
            <div className="flex items-center border-b border-gray-200 pb-3">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Patient Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Patient ID
                </label>
                <input
                  type="text"
                  placeholder="Auto-generated ID"
                  disabled
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter patient's full name"
                  value={patientInfo.fullName}
                  onChange={(e) =>
                    setPatientInfo({ ...patientInfo, fullName: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
          </section>

          {/* 2. Expense Details */}
          <section className="space-y-6">
            <div className="flex items-center border-b border-gray-200 pb-3 pt-6">
              <CalendarDays className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Expense Details
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Date of Expense *
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                  />
                  <CalendarDays className="absolute top-1/2 left-4 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Upload Receipt
                </label>
                <div className="relative">
                  <input
                    type="file"
                    onChange={(e) => setReceiptFile(e.target.files[0])}
                    className="w-full px-4 py-3 pl-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <Upload className="absolute top-1/2 left-4 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                </div>
              </div>
            </div>

            {/* Dynamic Expense Rows */}
            <div className="space-y-4 pt-4">
              <h3 className="text-lg font-bold text-gray-800 pb-4">
                Expense Items
              </h3>
              {expenseRows.map((row, index) => (
                <div
                  key={row.id}
                  className={`bg-gray-50 border border-gray-200 rounded-xl p-6 transition-shadow duration-200 ${
                    index > 0 ? "pt-6" : ""
                  }`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Expense Type *
                      </label>
                      <select
                        value={row.type}
                        onChange={(e) =>
                          handleChange(row.id, "type", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                      >
                        <option value="">Select Type</option>
                        <option value="Consultation">Consultation</option>
                        <option value="Medication">Medication</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Diagnostic">Diagnostic Tests</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Amount (₹) *
                      </label>
                      <input
                        type="number"
                        placeholder="0.00"
                        value={row.amount}
                        onChange={(e) =>
                          handleChange(row.id, "amount", e.target.value)
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-gray-700">
                        Description
                      </label>
                      <input
                        type="text"
                        placeholder="Add notes or description"
                        value={row.notes}
                        onChange={(e) =>
                          handleChange(row.id, "notes", e.target.value)
                        }
                        className="w-[300px] px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveRow(row.id)}
                        className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-colors duration-200"
                        disabled={expenseRows.length === 1}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddRow}
              className="flex items-center px-4 py-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl font-bold transition-colors duration-200 group"
            >
              <Plus className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" />
              Add Another Expense
            </button>
          </section>

          {/* 3. Doctor/Hospital Information */}
          <section className="space-y-6">
            <div className="flex items-center border-b border-gray-200 pb-3 pt-4">
              <Building className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">
                Doctor / Hospital Information
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Hospital/Clinic Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter hospital or clinic name"
                  value={hospitalInfo.hospital}
                  onChange={(e) =>
                    setHospitalInfo({
                      ...hospitalInfo,
                      hospital: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">
                  Doctor Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter doctor's name"
                  value={hospitalInfo.doctor}
                  onChange={(e) =>
                    setHospitalInfo({ ...hospitalInfo, doctor: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-bold text-gray-700">
                  Department (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g., Cardiology, Orthopedics"
                  value={hospitalInfo.department}
                  onChange={(e) =>
                    setHospitalInfo({
                      ...hospitalInfo,
                      department: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
                />
              </div>
            </div>
          </section>

          {/* 4. Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleGoBack}
              className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors duration-200 font-bold"
            >
              Cancel
            </button>
            <button

              type="submit"
              onClick={handleSubmit}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all duration-200 font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Submit Form
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
