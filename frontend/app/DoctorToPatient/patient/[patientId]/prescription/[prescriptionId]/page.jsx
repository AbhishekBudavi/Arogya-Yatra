
import PrescriptionDetails from "../../../../../components/patientdashboard/Records/prescripation/prescriptionDetail";
export default async function PrescriptionDetailed({params}) {
const { patientId } = await params;
  return (
    <PrescriptionDetails 
    allPrescription={`/DoctorToPatient/patient/${patientId}/prescription-records`}
    />

  );
}
