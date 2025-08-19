import RecordsLandingPage from '../../../../components/patientdashboard/Records/RecordContent'
export default function RecordsContentpage(){
return(

    <RecordsLandingPage
    basePath="/dashboard/patient/records"
    visibleCards={["Lab Reports", "Prescription", "Doctor Notes", "Medical History", "Medical Expenses","Vaccination"]} 

    />
    
)
}