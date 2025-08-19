import { BookingProvider } from '../../../../context/BookingContent';
import LocationFilters from '../../../../components/patientdashboard/Appointment/LocationFilters';
import DoctorList from '../../../../components/patientdashboard/Appointment/DoctorList';

export default function AppointmentPage() {
  return (
    <BookingProvider>
      <div className="p-6 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>
        <LocationFilters />
        <DoctorList />
      </div>
    </BookingProvider>
  );
}
