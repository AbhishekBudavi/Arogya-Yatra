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

const MedicalExpenseRecords = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [expences, setExpences] = useState([]);

  // Sample data - in real app this would come from API
  const expenceIds = ["EXP-2024-001", "EXP-2024-002", "EXP-2024-003"];
  useEffect(() => {
    const fetchExpences = async () => {
      const allExpences = await Promise.all(
        expenceIds.map(async (id) => {
          const res = await fetch(`/api/medical-expenses/${id}`);
          if (!res.ok) return null;
          return res.json();
        })
      );
      setExpences(allExpences.filter(Boolean));
    };
    fetchExpences();
  }, []);

  const [records, setRecords] = useState([
    {
      id: "MED001",
      patientName: "Rajesh Kumar",
      age: 45,
      gender: "Male",
      phone: "+91 9876543210",
      date: "2024-07-08",
      hospitalName: "Apollo Hospital",
      doctorName: "Dr. Priya Sharma",
      department: "Cardiology",
      expenses: [
        { type: "Consultation", amount: 1500, notes: "Regular checkup" },
        { type: "ECG Test", amount: 800, notes: "Routine cardiac screening" },
        { type: "Medication", amount: 2200, notes: "Prescribed medicines" },
      ],
      totalAmount: 4500,
      status: "Pending Reimbursement",
      hasReceipt: true,
    },
    {
      id: "MED002",
      patientName: "Meera Patel",
      age: 32,
      gender: "Female",
      phone: "+91 9123456789",
      date: "2024-07-06",
      hospitalName: "Fortis Healthcare",
      doctorName: "Dr. Amit Gupta",
      department: "Orthopedics",
      expenses: [
        { type: "X-Ray", amount: 1200, notes: "Knee injury assessment" },
        { type: "Physiotherapy", amount: 3000, notes: "6 sessions" },
      ],
      totalAmount: 4200,
      status: "Approved",
      hasReceipt: true,
    },
    {
      id: "MED003",
      patientName: "Arjun Singh",
      age: 28,
      gender: "Male",
      phone: "+91 9998887776",
      date: "2024-07-10",
      hospitalName: "Max Hospital",
      doctorName: "Dr. Kavita Rao",
      department: "Dermatology",
      expenses: [
        { type: "Consultation", amount: 1800, notes: "Skin allergy treatment" },
        { type: "Medication", amount: 1500, notes: "Topical creams" },
      ],
      totalAmount: 3300,
      status: "Rejected",
      hasReceipt: false,
    },
  ]);

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "bg-green-100 text-green-800";
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
  const router = useRouter();
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

        {/* Search and Filter Bar */}
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
                  <option value="Pending Reimbursement">Pending</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <Link
                href="/dashboard/patient/records/medical-expence/expence-form"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                <span className="hidden sm:inline">New Expense</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Records Grid */}
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
                <h4 className="font-medium text-gray-900 mb-2">
                  Expense Breakdown
                </h4>
                <div className="space-y-2">
                  {record.expenses.map((expense, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-sm text-gray-600">
                        {expense.type}
                      </span>
                      <div className="flex items-center gap-1">
                        <IndianRupee className="w-3 h-3 text-gray-500" />
                        <span className="text-sm font-medium">
                          {expense.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-2 mt-2">
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
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm text-green-600">
                    Receipt available
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-2">
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                  <Eye className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200">
                  <Edit className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200">
                  <Download className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(record.id)}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredRecords.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No records found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2 mx-auto">
              <Plus className="w-5 h-5" />
              Add New Record
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalExpenseRecords;
