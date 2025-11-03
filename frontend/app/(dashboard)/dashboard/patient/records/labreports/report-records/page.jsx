import LabReportList from '../../../../../../components/patientdashboard/Records/labreport/labreportList'
import api from '../../../../../../utils/api';
const LabReportsPage = () => {
  return (
    <LabReportList 
    goBack='/dashboard/patient'
    addRecords='/dashboard/patient/records/labreports/report-form'
    base='/dashboard/patient/records'
    />

  );
};

export default LabReportsPage;
