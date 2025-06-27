'use client';
import { useParams } from 'next/navigation';
import DoctorLoginForm from '../../../components/logins/DoctorLoginForm';
import PatientLoginForm from '../../../components/logins/PatientLoginForm';
import HospitalLoginForm from '../../../components/logins/HospitalLoginForm';

export default function RoleLoginPage() {
  const { role } = useParams();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 capitalize">Login - {role}</h1>

      {role === 'doctor' && <DoctorLoginForm />}
      {role === 'patient' && <PatientLoginForm />}
      {role === 'hospital' && <HospitalLoginForm />}
    </div>
  );
}
