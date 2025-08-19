// app/dashboard/doctor/patient/[id]/layout.jsx

export const metadata = {
  title: 'Patient Details',
};

export default function PatientIdLayout({ children }) {
  return (
    <div className="min-h-screen bg-white p-4">
      {children}
    </div>
  );
}
