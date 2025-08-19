import PrescriptionList from "../../../../../components/patientdashboard/Records/prescripation/prescriptionList";
export default async function PrescriptionRecordsPage({params}){
 const { patientId } = await params;
  return (
   <PrescriptionList
   goBack={`/DoctorToPatient/patient/${patientId}`}
   base={`/DoctorToPatient/patient/${patientId}`}
   />
  );
};
