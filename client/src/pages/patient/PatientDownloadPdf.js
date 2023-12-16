import PatientDashboard from "./PatientDashboard";
import PatientDownloadPrescription from '../../components/ViewComponents/PatientDownloadPrescription'

const PatientDownloadPdf = () => {
    return (
        <>
            <PatientDashboard title="Download Prescription Details" />
            <PatientDownloadPrescription />
        </>
    );
}

export default PatientDownloadPdf;