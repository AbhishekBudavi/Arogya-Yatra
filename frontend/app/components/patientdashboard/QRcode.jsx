'use client'
import React, { useRef, useState, useEffect } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Share2, Copy, Check, Scan } from 'lucide-react';
import api from "../../utils/api";


const QRCodeComponent = () => {
  const [qrValue, setQrValue] = useState('');
  const [patientName, setPatientName] = useState('');
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const qrRef = useRef(null);

  // Fetch QR code data from backend when component mounts
  useEffect(() => {
    async function fetchQRCode() {
      try {
        const response = await api.get('/patient/my-qrcode'); // your backend endpoint
        if (response.data.success) {
          setQrValue(response.data.qrValue);
          setPatientName(response.data.name);
        }
      } catch (err) {
        console.error('Error fetching QR code:', err);
      }
    }
    fetchQRCode();
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `patient-qr.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `${patientName}'s Medical QR Code`,
        text: `Access ${patientName}'s medical information using this QR code`,
        url: qrValue
      }).catch(err => console.log('Error sharing:', err));
    } else {
      handleCopy();
    }
  };

  if (!qrValue) return <p>Loading QR Code...</p>; // optional loading state

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-800 flex items-center justify-center gap-2">
          <Scan className="w-5 h-5 text-blue-500" />
          Patient QR Code
        </h3>
        <p className="text-gray-500 text-sm mt-1">Scan to Access my Digital Data</p>
      </div>

      <div className="flex pt-4 pb-4 justify-center">
        <div
          ref={qrRef}
          className={`relative p-3 bg-white rounded-lg border border-gray-200 shadow-sm transition-all duration-200 ${
            isHovered ? 'transform scale-105 shadow-md' : ''
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <QRCodeCanvas value={qrValue} size={200} bgColor="#ffffff" fgColor="#1e40af" level="H" includeMargin={true} imageSettings={{ src: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%231e40af' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2'/%3E%3Ccircle cx='12' cy='7' r='4'/%3E%3C/svg%3E", height: 32, width: 32, excavate: true, }} />
        </div>
      </div>

      <div className="bg-blue-50 rounded-md p-2 text-center">
        <p className="text-blue-800 text-xs font-mono truncate">{qrValue}</p>
      </div>

      <div className="flex pt-4 flex-wrap justify-center gap-2">
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-3 py-2 text-xs rounded-md transition-colors ${
            copied ? 'bg-green-100 text-green-800' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          {copied ? 'Copied' : 'Copy'}
        </button>

        <button
          onClick={handleDownload}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs rounded-md transition-colors"
        >
          <Download className="w-3.5 h-3.5" />
          Download
        </button>

        <button
          onClick={handleShare}
          className="flex items-center gap-1.5 px-3 py-2 bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs rounded-md transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          Share
        </button>
      </div>
    </div>
  );
};

export default QRCodeComponent;
