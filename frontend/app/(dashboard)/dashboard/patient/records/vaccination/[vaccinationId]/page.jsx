'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import { ArrowLeft, Calendar, FileText, User, Download, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import next from 'next';

const VaccinationDetails = () => {
  const { vaccinationId } = useParams();
  const [vaccination, setVaccination] = useState(null);
  const [loading, setLoading] = useState(true);
 const router=useRouter();

 const handelBack = ()=>{
  router.back();
 }
  useEffect(() => {
    const fetchVaccination = async () => {
      try {
        const res = await fetch(`/api/vaccination/${vaccinationId}`);
        if (!res.ok) throw new Error('Not Found');
        const data = await res.json();
        setVaccination(data);
      } catch (err) {
        console.error(err);
        setVaccination(null);
      } finally {
        setLoading(false);
      }
    };

    if (vaccinationId) {
      fetchVaccination();
    }
  }, [vaccinationId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!vaccination) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Vaccination Not Found</h2>
        <p className="text-gray-600 mb-6">The record you’re looking for doesn’t exist.</p>
        
          <button onClick={handelBack} className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            Go Back
          </button>
        
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
    
        <button onClick={handelBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Records
        </button>
      

      <h1 className="text-3xl font-bold mb-4">{vaccination.title}</h1>

      <div className="grid md:grid-cols-2 gap-6 bg-white p-6 rounded-xl shadow">
        <div className="space-y-4">
          <p className="flex items-center text-gray-700">
            <Calendar className="w-5 h-5 mr-2" /> Date: {new Date(vaccination.date).toLocaleDateString()}
          </p>
          <p className="flex items-center text-gray-700">
            <User className="w-5 h-5 mr-2" /> Doctor: {vaccination.doctorName}
          </p>
          <p className="flex items-center text-gray-700">
            <FileText className="w-5 h-5 mr-2" /> File Size: {vaccination.fileSize}
          </p>
          <p className="flex items-center text-gray-700">
            Status: <span className="ml-2 font-medium">{vaccination.status}</span>
          </p>
        </div>

        <div className="bg-blue-50 p-4 rounded-xl">
          <h3 className="font-bold text-lg mb-2 text-blue-800">AI Summary</h3>
          <p className="text-gray-700 leading-relaxed">{vaccination.aiSummary}</p>
        </div>
      </div>

      <div className="mt-6 flex gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" /> Download Report
        </button>
        {/* Add share/edit buttons here if needed */}
      </div>
    </div>
  );
};

export default VaccinationDetails;
