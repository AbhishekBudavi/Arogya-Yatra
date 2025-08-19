'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, User, Calendar, Building, Heart,
  Download, FileText, DollarSign, Stethoscope,
  MapPin, Clock
} from 'lucide-react';

export default function MedicalExpenseDetails() {
  const [expense, setExpense] = useState(null);
  const [loading, setLoading] = useState(true);

  const params = useParams();
  const expenseId = params?.expenseId; // ✅ must match folder name [expenseId]

  useEffect(() => {
    if (!expenseId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/medical-expenses/${expenseId}`);
        if (!res.ok) throw new Error('Failed to fetch expense');
        const data = await res.json();
        setExpense(data);
      } catch (err) {
        console.error('Error fetching expense:', err);
        setExpense(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [expenseId]);

  const handleGoBack = () => {
    console.log("Going back to medical expenses list");
    // Optionally use router.back() if needed
  };

  const handleDownloadReceipt = () => {
    console.log("Downloading receipt:", expense?.receiptFile);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'bg-green-100 text-green-800';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) return <p className="text-center p-10">Loading...</p>;
  if (!expense) return <p className="text-center text-red-500 p-10">Expense not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-4 sm:p-6">
      {/* Back Button */}
      <div className="max-w-4xl mx-auto mb-6">
        <button
          onClick={handleGoBack}
          className="flex items-center text-gray-600 hover:text-blue-600 transition-colors duration-200 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform duration-200" />
          <span className="font-bold">Back to Expenses</span>
        </button>
      </div>

      {/* Expense Card */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-3 rounded-full mr-4">
                <Heart className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Medical Expense Details</h1>
                <p className="text-blue-100 mt-1">Expense ID: {expense.id}</p>
              </div>
            </div>
            <div className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(expense.status)}`}>
              {expense.status}
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-8">

          {/* Patient Info */}
          <section>
            <div className="flex items-center border-b pb-3">
              <User className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Patient Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Patient ID</p>
                <p className="text-lg font-bold text-gray-800">{expense.patient.patientId}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="text-lg font-bold text-gray-800">{expense.patient.fullName}</p>
              </div>
            </div>
          </section>

          {/* Expense Summary */}
          <section>
            <div className="flex items-center border-b pb-3">
              <Calendar className="w-5 h-5 text-green-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Expense Summary</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Expense Date</p>
                <p className="text-lg font-bold text-gray-800">{expense.date}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Submitted On</p>
                <p className="text-lg font-bold text-gray-800">{expense.submissionDate}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-xl border border-green-200">
                <p className="text-sm text-green-600 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-green-800">₹{expense.totalAmount.toLocaleString()}</p>
              </div>
            </div>
          </section>

          {/* Expense Items */}
          <section>
            <div className="flex items-center border-b pb-3">
              <FileText className="w-5 h-5 text-purple-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Expense Items</h2>
            </div>
            <div className="space-y-4 mt-6">
              {expense.expenses.map((item, idx) => (
                <div key={idx} className="bg-gray-50 border rounded-xl p-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Expense Type</p>
                      <p className="text-lg font-bold">{item.type}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Amount</p>
                      <p className="text-lg font-bold text-blue-600">₹{item.amount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Description</p>
                      <p className="text-lg">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Hospital Info */}
          <section>
            <div className="flex items-center border-b pb-3">
              <Building className="w-5 h-5 text-orange-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Hospital Information</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Hospital</p>
                <p className="text-lg font-bold">{expense.hospital.name}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl">
                <p className="text-sm text-gray-600 mb-1">Doctor</p>
                <p className="text-lg font-bold">{expense.hospital.doctor}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-xl md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Department</p>
                <p className="text-lg font-bold">{expense.hospital.department}</p>
              </div>
            </div>
          </section>

          {/* Receipt */}
          <section>
            <div className="flex items-center border-b pb-3">
              <FileText className="w-5 h-5 text-indigo-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-800">Receipt</h2>
            </div>
            <div className="bg-gray-50 p-6 rounded-xl flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-indigo-600 mr-3" />
                <div>
                  <p className="font-bold">{expense.receiptFile}</p>
                  <p className="text-sm text-gray-600">Receipt document</p>
                </div>
              </div>
              <button
                onClick={handleDownloadReceipt}
                className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
              >
                <Download className="w-4 h-4 mr-2 inline" />
                Download
              </button>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
