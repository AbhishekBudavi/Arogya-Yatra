"use client";

import LabReportList from "../../../../../components/patientdashboard/Records/labreport/labreportList";
import { useParams } from "next/navigation";
const LabReportsPage = () => {
      
 const { patientId } = useParams();
    return (
    <LabReportList 
    goBack={`/DoctorToPatient/patient/${patientId}`}
    addRecords={`/DoctorToPatient/patient/${patientId}/labreports/report-form`}
    base = {`/DoctorToPatient/patient/${patientId}`}
    />

  );
};


export default LabReportsPage;
