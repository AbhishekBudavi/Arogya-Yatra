import PrescriptionForm from '../../../../../../components/patientdashboard/Records/prescripation/prescriptionForm'

export default async function PrescriptionFormFill({params}) {
   const {patientId} = await params;
  
  return (
    <PrescriptionForm 
    goBack="/dashboard/patient"
    goDashboard="dashboard/patient"
    base={`/dashboard/patient/records`}
    />
  );
}
