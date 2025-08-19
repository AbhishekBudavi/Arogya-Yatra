'use client'
import React, { useState } from 'react';
import PatientQRScanner from './QRScanner';

const PatientManagement = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedPatientId, setScannedPatientId] = useState(null);
  const [patientData, setPatientData] = useState(null);

  const handleScanSuccess = async (patientId) => {
    setScannedPatientId(patientId);
    setShowScanner(false);
    
    try {
      // Fetch patient data from your backend
      const response = await fetch(`https://your-api-endpoint/patients/${patientId}`);
      const data = await response.json();
      
      if (response.ok) {
        setPatientData(data);
      } else {
        alert('Error', 'Patient not found');
      }
    } catch (error) {
      alert('Error', 'Failed to fetch patient data');
    }
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Patient Management</h1>
      
      {patientData ? (
        <div className="mt-5 p-4 bg-gray-100 rounded-lg">
          <h2 className="text-xl font-bold mb-2">{patientData.name}</h2>
          <p>ID: {patientData.id}</p>
          <p>DOB: {patientData.dob}</p>
          {/* Display other patient details */}
        </div>
      ) : (
        <p className="mt-5 italic text-gray-500">No patient selected</p>
      )}
      
      <button 
        className="mt-5 bg-blue-500 px-6 py-3 rounded-lg w-full"
        onClick={() => setShowScanner(true)}
      >
        <span className="text-white font-bold text-lg">Scan Patient ID</span>
      </button>
      
      {showScanner && (
        <div className="fixed inset-0 z-50">
          <PatientQRScanner 
            onScanSuccess={handleScanSuccess}
            onClose={() => setShowScanner(false)}
          />
        </div>
      )}
    </div>
  );
};

export default PatientManagement;