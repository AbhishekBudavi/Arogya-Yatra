'use client';
import { useParams } from 'next/navigation';
import DoctorLoginForm from '../../../../components/logins/DoctorLoginForm';
import MobileLogin from "../../../../components/logins/mobilelogin";
import HospitalLoginForm from '../../../../components/logins/HospitalLoginForm';
import SelectPatientComponent from '../../../../components/SelectPatientComponent'; // 👈 new component

export default function RoleLoginPage() {
  const { role } = useParams();

  // Simulated multiple patient logic
  const multiplePatients = role === 'patient'; // Example: always true for demo

  return (
    <div >
      <h1 className="text-2xl font-bold mb-4 capitalize">Login - {role}</h1>

      {role === 'doctor' && <DoctorLoginForm />}
      {role === 'hospital' && <HospitalLoginForm />}
      
      {/* 👇 If role is patient, render multiple-patient selector */}
      {role === 'patient' && <MobileLogin />}
    </div>
  );
}
