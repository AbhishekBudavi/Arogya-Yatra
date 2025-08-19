"use client";
import React from "react";
import Link from "next/link";


// Removed ScrollArea import - using div with custom scroll instead
import {
  Calendar,
  Syringe,
  FileText,
  QrCode,
  Clock,
  Heart,
  Sparkles,
  ChevronRight,
  Activity,
  Users,
  TrendingUp,
  Stethoscope,
  Pill,
  ClipboardList,
  History,
  DollarSign,
  TestTube,
  X,
  Plus,
} from "lucide-react";
import { useRouter } from 'next/navigation';
const RecordsLandingPage = ({basePath,visibleCards}) => {
  const [recordCounts] = React.useState({
    labReports: 2,
    prescriptions: 1,
    doctorNotes: 1,
    medicalHistory: 2,
    medicalExpenses: 0,
    Vaccination: 1,

  });

  const [showAddModal, setShowAddModal] = React.useState(false);

  const medicalRecords = [
    {
    id:"Lab Reports",
      title: "Lab Reports",
      count: recordCounts.labReports,
      icon: TestTube,
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      description: "Blood tests, urine tests, and other lab results",
      href: `${basePath}/labreports/report-records`,
      hrefModal: `${basePath}/labreports/report-form`
    },
    { 
    id:"Prescription",
      title: "Prescriptions",
      count: recordCounts.prescriptions,
      icon: Pill,
      color: "from-green-500 to-emerald-500",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      description: "Medications and dosage instructions",
        href:`${basePath}/prescription/prescription-records`,
         hrefModal:`${basePath}/prescription/prescription-form`
    },
    {
        id:"Doctor Notes",
      title: "Doctor Notes",
      count: recordCounts.doctorNotes,
      icon: ClipboardList,
      color: "from-purple-500 to-violet-500",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      description: "Consultation notes and observations",
        href:`${basePath}/doctor-notes/note-records`,
         hrefModal:`${basePath}/doctor-notes/note-form`
    },
    {
    id:"Medical History",
      title: "Medical History",
      count: recordCounts.medicalHistory,
      icon: History,
      color: "from-orange-500 to-amber-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      description: "Past medical conditions and treatments",
        href:`${basePath}/medicalHistory`,
         hrefModal:`${basePath}records/medicalHistory`
    },
    {
        id:"Medical Expenses",
      title: "Medical Expenses",
      count: recordCounts.medicalExpenses,
      icon: DollarSign,
      color: "from-pink-500 to-rose-500",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
      description: "Bills, insurance claims, and expenses",
        href:`${basePath}/medical-expence/expence-records`,
         hrefModal:`${basePath}/medical-expence/expence-form`
    },
    {
        id:"Vaccination",
      title: "Vaccination",
      count: recordCounts.Vaccination,
      icon: Syringe,
      color: "from-red-500 to-orange-500",
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      description: "Vaccination records and schedules",
        href:`${basePath}/vaccination/vaccination-records`,
         hrefModal:`${basePath}records/vaccination/vaccination-form`
    },
  ];
const router = useRouter()
   const handleAddRecord = (recordType) => {
    const record = medicalRecords.find(r => r.title === recordType);
    if (record?.href) {
      setShowAddModal(false);
      router.push(record.hrefModal);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-3xl p-8 shadow-xl overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Documents</h1>
                  <p className="text-blue-100 text-lg">
                    All your health documents, neatly organized and easily accessible
                  </p>
                </div>
                <div className="hidden md:block">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4">
                    <Heart className="h-12 w-12 text-white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>
          </div>
        </div>

        {/* Medical Records Section */}
        <div className="mb-8">
          <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
            {medicalRecords
             .filter(record => visibleCards.includes(record.id))
            .map((record, index) => {
              const IconComponent = record.icon;
              return (
                <Link key={record.id} href={record.href}>
                <div
                  key={record.id}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center justify-center mb-3">
                      <span
                        className={`text-xl md:text-3xl font-bold ${record.iconColor}`}
                      >
                        {record.count}
                      </span>
                    </div>
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${record.color} opacity-70 group-hover:opacity-30 transition-opacity`}
                    >
                      <IconComponent className="h-6 w-6 text-white" />
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="text-md md:text-lg font-semibold text-gray-600 mb-2">
                      {record.title}
                    </h3>
                  </div>
                </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Add New Record Button */}
        <div className="pt-3 flex justify-center">
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-150 h-14 md:flex items-center justify-center px-8 py-3 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.03]"
          >
            <span className="font-bold text-3xl mr-2">+</span>
            Add New Record
          </button>
        </div>

        {/* Recent Activity */}
        <div className="pt-10">
          <div className="h-72 rounded-md border border-gray-200 overflow-y-auto">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h2 className="text-xl font-bold text-blue-600 mb-4">
                Recent Records
              </h2>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <div className="bg-blue-100 p-2 rounded-lg mr-4">
                    <TestTube className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      New lab report added
                    </p>
                    <p className="text-sm text-gray-500">
                      Blood test results from Dr. Smith
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">2 hours ago</span>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <div className="bg-green-100 p-2 rounded-lg mr-4">
                    <Pill className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      Prescription updated
                    </p>
                    <p className="text-sm text-gray-500">
                      Medication dosage adjusted
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">1 day ago</span>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                  <div className="bg-purple-100 p-2 rounded-lg mr-4">
                    <Calendar className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800">
                      Appointment scheduled
                    </p>
                    <p className="text-sm text-gray-500">
                      Follow-up with Dr. Smith
                    </p>
                  </div>
                  <span className="text-sm text-gray-400">3 days ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Record Modal - Slide up from bottom */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowAddModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative w-full max-w-md bg-white rounded-t-3xl shadow-2xl animate-[slideUp_0.3s_ease-out] max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add New Record</h2>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 pb-8 space-y-4 max-h-[calc(80vh-100px)] overflow-y-auto">
              <p className="text-gray-600 mb-6">Choose the type of record you'd like to add:</p>
              
              {medicalRecords.map((record, index) => {
  const IconComponent = record.icon;
  return (
    <div key={record.id} className="pb-4">
      <button
        onClick={() => handleAddRecord(record.title)}
        className="w-full p-4 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 hover:shadow-md group"
      >
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${record.color} opacity-80 group-hover:opacity-100 transition-opacity`}>
            <IconComponent className="h-4 w-4 text-white" />
          </div>
          <div className="flex-1 text-left pl-2">
            <h3 className="font-semibold text-gray-900 mb-1">{record.title}</h3>
            <p className="text-sm text-gray-500">{record.description}</p>
          </div>
          <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-gray-600 transition-colors" />
        </div>
      </button>
    </div>
  );
})}

            </div>
          </div>
        </div>
      )}

      {/* Custom CSS for slide-up animation */}
      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default RecordsLandingPage;