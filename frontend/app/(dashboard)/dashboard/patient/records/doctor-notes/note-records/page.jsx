import DoctorNoteLandingPage from '../../../../../../components/patientdashboard/Records/doctornotes/doctornotesList';
const DoctorNotesLandingPage = () => {
  return (
    <DoctorNoteLandingPage
    goBack='/dashboard/patient'
    addRecords='/dashboard/patient/records/doctor-notes/note-form'
    base='/dashboard/patient/records'
    />

  );
};

export default DoctorNotesLandingPage;
