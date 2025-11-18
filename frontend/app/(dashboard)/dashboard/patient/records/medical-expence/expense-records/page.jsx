"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarDays,
  User,
  Heart,
  Building,
  Eye,
  Trash,
  Download,
  Edit,
  Plus,
  Search,
  Filter,
  Phone,
  FileText,
  IndianRupee,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";
import { api } from "../../../../../../utils/api";

const MedicalExpenseRecords = () => {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch medical expenses from API
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        setLoading(true);
        const res = await api.get('/patient/medical-expenses');
        const medicalExpenses = res.data.medicalExpenses || [];
        
        // Transform API data to component format
        const transformedRecords = medicalExpenses.map((expense) => {
          const docData = expense.document_data || {};
          const expensesList = docData.expenses || [];
          const totalAmount = expensesList.reduce(
            (sum, exp) => sum + (parseFloat(exp.amount) || 0),
            0
          );

          return {
            id: expense.id,
            documentId: expense.document_id,
            documentName: expense.document_name,
            documentUrl: expense.document_url,
            patientName: docData.fullName || "N/A",
            date: docData.expenseDate || new Date().toISOString().split('T')[0],
            hospitalName: docData.hospitalName || "N/A",
            doctorName: docData.doctorName || "N/A",
            department: docData.department || "N/A",
            expenses: expensesList.map((exp) => ({
              type: exp.type || "N/A",
              amount: parseFloat(exp.amount) || 0,
              notes: exp.notes || "",
            })),
            totalAmount: totalAmount,
            status: "Submitted", // Default status
            hasReceipt: !!expense.document_url,
          };
        });

        setRecords(transformedRecords);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch medical expenses:', err);
        setError(err.message || 'Failed to load medical expenses');
        setRecords([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
      case "Submitted":
        return "bg-blue-100 text-blue-800";
      case "Pending Reimbursement":
        return "bg-yellow-100 text-yellow-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.hospitalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || record.status === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDelete = (id) => {
    setRecords(records.filter((record) => record.id !== id));
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Medical Expense Records
          </h1>
          <p className="text-gray-600">Manage and track all medical expenses</p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-700">Error: {error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600">Loading medical expenses...</p>
          </div>
        )}

        {/* Search and Filter Bar */}
        {!loading && (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by patient name, hospital, or doctor..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="Approved">Approved</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Pending Reimbursement">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <Link
                href="/dashboard/patient/records/medical-expence/expense-form"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Expense</span>
              </Link>
            </div>
          </div>
        </div>
        )}

        {/* Records Grid */}
        {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredRecords.map((record) => (
            <div
              key={record.id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 p-6"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="w-4 h-4 text-gray-500" />
                    <span className="text-xl font-bold text-gray-600">
                      {record.hospitalName}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">ID: {record.id}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(record.status)}`}
                >
                  {record.status}
                </span>
              </div>

              {/* Patient Info */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 font-medium">
                    {record.patientName}
                  </span>
                </div>
              </div>

              {/* Date and Hospital */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{record.date}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600">
                    {record.doctorName} - {record.department}
                  </span>
                </div>
              </div>

              {/* Expenses Summary */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Expense Breakdown
                </h4>
                <div className="space-y-2">
                  {record.expenses.length > 0 ? (
                    record.expenses.map((expense, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-start"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">
                            {expense.type}
                          </p>
                          {expense.notes && (
                            <p className="text-xs text-gray-500 mt-1">
                              {expense.notes}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <IndianRupee className="w-3 h-3 text-gray-500" />
                          <span className="text-sm font-medium text-gray-900">
                            {expense.amount.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">No expenses recorded</p>
                  )}
                </div>
                <div className="border-t pt-2 mt-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-900">
                      Total Amount
                    </span>
                    <div className="flex items-center gap-1">
                      <IndianRupee className="w-4 h-4 text-blue-600" />
                      <span className="text-lg font-bold text-blue-600">
                        {record.totalAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Receipt Status */}
              {record.hasReceipt && (
                <div className="flex items-center gap-2 mb-4 bg-green-50 p-2 rounded">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    Receipt available
                  </span>
                  {record.documentUrl && (
                    <a
                      href={record.documentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-auto text-green-600 hover:text-green-700 text-xs font-medium"
                    >
                      View
                    </a>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200" title="View details">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200" title="Edit expense">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200" title="Download receipt">
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                  title="Delete expense"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Empty State */}
        {!loading && filteredRecords.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No records found
            </h3>
            <p className="text-gray-600 mb-4">
              {records.length === 0
                ? "You haven't added any medical expenses yet"
                : "Try adjusting your search or filter criteria"}
            </p>
            <Link
              href="/dashboard/patient/records/medical-expence/expence-form"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add New Record
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalExpenseRecords;
