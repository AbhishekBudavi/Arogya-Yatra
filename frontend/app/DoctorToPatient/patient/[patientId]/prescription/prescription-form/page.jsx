
import PrescriptionForm from '../../../../../components/patientdashboard/Records/prescripation/prescriptionForm'
export default function PrescriptionFormDFill({params}) {
  const {patientId} = params;
  return (
     <PrescriptionForm 
        goBack= {`/DoctorToPatient/patient/${patientId}`}
        base={`/DoctorToPatient/patient/${patientId}`}
        />
  );
}
