'use client'
import React from 'react';
import { useParams } from "next/navigation";
import { FileText, Pill, Syringe, Heart, Calendar, Download, Eye, User, Phone, Mail } from 'lucide-react';
import RecordsLandingPage from '../../../components/patientdashboard/Records/RecordContent';
export const dynamic = 'force-dynamic';
const PatientDocumentsDashboard = () => {
  


  const { patientId } = useParams();

  const patientInfo = {
    id: patientId,
    name: 'Abhi Budavi',
    age: 34,
    gender: 'Female',
    phone: '8660485626',
    email: 'abhibudavi@email.com',
    profilePicture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
  };


  const documents = [
    {
      id: 1,
      title: 'Annual Physical Exam',
      type: 'Medical Report',
      date: 'March 15, 2024',
      status: 'completed',
      icon: FileText
    },
    {
      id: 2,
      title: 'Prescription - Lisinopril',
      type: 'Prescription',
      date: 'March 10, 2024',
      status: 'completed',
      icon: Pill
    },
    {
      id: 3,
      title: 'COVID-19 Vaccination',
      type: 'Immunization Record',
      date: 'February 28, 2024',
      status: 'completed',
      icon: Syringe
    },
    {
      id: 4,
      title: 'Cardiac Stress Test',
      type: 'Test Results',
      date: 'February 20, 2024',
      status: 'pending',
      icon: Heart
    },
    {
      id: 5,
      title: 'Follow-up Appointment',
      type: 'Appointment Summary',
      date: 'January 30, 2024',
      status: 'completed',
      icon: Calendar
    },
    {
      id: 6,
      title: 'Blood Work Results',
      type: 'Lab Results',
      date: 'January 25, 2024',
      status: 'urgent',
      icon: FileText
    }
  ];

  const handleView = (docId) => {
    console.log('Viewing document:', docId);
    // Add view functionality here
  };

  const handleDownload = (docId) => {
    console.log('Downloading document:', docId);
    // Add download functionality here
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Documents</h1>
              <p className="text-sm text-blue-600 font-medium bg-blue-50 px-3 py-1 rounded-full inline-block">
                Patient ID: {patientInfo.id}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              <div className="flex items-center space-x-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{patientInfo.name}</p>
                  <p className="text-xs text-gray-500">Last updated: Today</p>
                </div>
                <img
                  src={patientInfo.profilePicture}
                  alt="Patient Profile"
                  className="h-12 w-12 rounded-full object-cover border-2 border-blue-200"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Patient Info Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-blue-50">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
            <User className="h-5 w-5 text-blue-600 mr-2" />
            Patient Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">Full Name</p>
              <p className="font-medium text-gray-800">{patientInfo.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Age</p>
              <p className="font-medium text-gray-800">{patientInfo.age} years</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Gender</p>
              <p className="font-medium text-gray-800">{patientInfo.gender}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Patient ID</p>
              <p className="font-medium text-blue-600">{patientInfo.id}</p>
            </div>
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Phone</p>
                <p className="font-medium text-gray-800">{patientInfo.phone}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail className="h-4 w-4 text-gray-400 mr-2" />
              <div>
                <p className="text-sm text-gray-500 mb-1">Email</p>
                <p className="font-medium text-gray-800">{patientInfo.email}</p>
              </div>
            </div>
          </div>
        </div>
        <div className='mb-8'>
          <RecordsLandingPage
            basePath={`/DoctorToPatient/patient/${patientId}`}
            visibleCards={["Lab Reports", "Prescription", "Doctor Notes", "Medical History", "Vaccination"]} 

          />
        </div>
        </div>
        </div>
  )}
    
  export default PatientDocumentsDashboard;