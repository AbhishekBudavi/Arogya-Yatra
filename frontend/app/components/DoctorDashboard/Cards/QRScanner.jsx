'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import jsQR from 'jsqr';
import {
  QrCode, CheckCircle, X, User, UserPlus
} from 'lucide-react';

const QRScanner = () => {
  const router = useRouter();

  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const [hasPermission, setHasPermission] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const scanIntervalRef = useRef(null);

  //  QR code detection
  const detectQRCode = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!video.videoWidth || !video.videoHeight) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'attemptBoth',
    });

    if (code) {
      handleQRDetected(code.data);
    }
  }, []);

  const handleQRDetected = (qrData) => {
    stopScanning();
    const patientData = parsePatientQR(qrData);
    setScanResult(patientData);
  };

  // Simulated QR parsing (replace with your logic)
  const parsePatientQR = (qrData) => {
    const mockPatients = [
      { patientId: 'PAT-2024-001', name: 'Abhi Budavi', age: 45, condition: 'Routine Checkup' },
  
    ];
    return mockPatients[Math.floor(Math.random() * mockPatients.length)];
  };

  const startScanning = async () => {
    try {
      setError('');
      setIsScanning(true);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 640 }, height: { ideal: 480 } }
      });

      streamRef.current = stream;
      setHasPermission(true);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        videoRef.current.onloadedmetadata = () => {
          scanIntervalRef.current = setInterval(detectQRCode, 200);
        };
      }
    } catch (err) {
      console.error('Camera access error:', err);
      setError('Camera access denied. Please allow permissions.');
      setIsScanning(false);
      setHasPermission(false);
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
    clearInterval(scanIntervalRef.current);
    scanIntervalRef.current = null;

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    return () => stopScanning(); // Cleanup on unmount
  }, []);

  const handleScanToggle = () => {
    isScanning ? stopScanning() : startScanning();
  };

 const handleNavigateToPatient = () => {
  if (scanResult?.patientId) {
    router.push(`/DoctorToPatient/patient/${scanResult.patientId}`);
  }
};

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Patient Check-in</h3>
          <p className="text-gray-500">QR code scanner for patient registration</p>
        </div>
        <div className="bg-indigo-50 p-3 rounded-2xl">
          <QrCode className="h-6 w-6 text-indigo-600" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Scanner */}
        <div className="relative">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white relative overflow-hidden">
            {!isScanning && !scanResult && (
              <div className="text-center">
                <div className="bg-white/10 p-6 rounded-3xl inline-block mb-4">
                  <QrCode className="h-16 w-16" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Ready to Scan</h4>
                <p className="text-gray-300 mb-6">Click to start camera and scan QR code</p>
                <button
                  onClick={handleScanToggle}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-8 py-3 rounded-2xl hover:from-indigo-600 hover:to-purple-700 transition-all font-medium"
                >
                  Start Camera
                </button>
                {error && (
                  <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-xl">
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                )}
              </div>
            )}

            {isScanning && (
              <div>
                <div className="relative bg-black rounded-2xl overflow-hidden">
                  <video ref={videoRef} className="w-full h-64 object-cover" playsInline muted />
                  <canvas ref={canvasRef} className="hidden" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-48 h-48 border-2 border-white/50 rounded-2xl relative">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-lg"></div>
                    </div>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <h4 className="text-xl font-semibold mb-2">Scanning for QR Code</h4>
                  <p className="text-gray-300 mb-4">Hold QR code within the frame</p>
                  <button
                    onClick={stopScanning}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-xl transition-colors flex items-center space-x-2 mx-auto"
                  >
                    <X className="h-4 w-4" />
                    <span>Stop Scanning</span>
                  </button>
                </div>
              </div>
            )}

            {scanResult && (
              <div className="text-center">
                <div className="bg-green-500/20 p-6 rounded-3xl inline-block mb-4">
                  <CheckCircle className="h-16 w-16 text-green-400" />
                </div>
                <h4 className="text-xl font-semibold mb-2">Scan Successful!</h4>
                <p className="text-gray-300">Patient identified</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Patient Info & Actions */}
        <div className="space-y-4">
          {scanResult ? (
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800">{scanResult.name}</h4>
                  <p className="text-sm text-gray-600">ID: {scanResult.patientId}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Age:</span>
                  <span className="ml-2 font-medium">{scanResult.age}</span>
                </div>
                <div>
                  <span className="text-gray-500">Visit:</span>
                  <span className="ml-2 font-medium">{scanResult.condition}</span>
                </div>
              </div>

              <div className="flex space-x-3 mt-4">
                <button
                  onClick={handleNavigateToPatient}
                  className="flex-1 bg-green-600 text-white py-2 rounded-xl hover:bg-green-700 transition-colors"
                >
                  View Patient
                </button>
                <button
                  onClick={() => {
                    setScanResult(null);
                    setError('');
                  }}
                  className="px-4 bg-gray-200 text-gray-600 py-2 rounded-xl hover:bg-gray-300 transition-colors ml-2"
                >
                  Reset
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center">
              <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h4 className="font-medium text-gray-600 mb-2">No patient scanned</h4>
              <p className="text-sm text-gray-500">
                {isScanning ? 'Scanning in progress...' : 'Click "Start Camera" to scan a patient QR code'}
              </p>
            </div>
          )}

          {/* Manual Entry Button */}
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="col-span-2 flex justify-center">
              <button className="flex items-center justify-center space-x-2 bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-xl transition-colors">
                <UserPlus className="h-4 w-4" />
                <span className="text-sm font-bold pl-2">Manual Entry</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRScanner;
