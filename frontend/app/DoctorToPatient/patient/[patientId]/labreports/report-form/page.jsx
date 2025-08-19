
import LabReportForm from "../../../../../components/patientdashboard/Records/labreport/labreportForm";

export default async  function LabReportUpload({params}) {
 const { patientId } = await params;
  return (
   <LabReportForm 
    goBack={`/DoctorToPatient/patient/${patientId}`}
     
   />
  );
}

