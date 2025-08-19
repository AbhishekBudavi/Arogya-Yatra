import PrescriptionList from "../../../../../../components/patientdashboard/Records/prescripation/prescriptionList";
const PrescriptionRecordsPage = ({params}) => {

  return (
   <PrescriptionList
   goBack="/dashboard/patient"
   base={`/dashboard/patient/records`}
   />
  );
};

export default PrescriptionRecordsPage;
