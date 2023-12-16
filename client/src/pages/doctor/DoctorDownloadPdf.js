import DoctorDashboard from "./DoctorDashboard";
import DoctorDownloadPrescription from '../../components/ViewComponents/DoctorDownloadPrescription'

const DoctorDownloadPdf = () => {
    return (
        <>
            <DoctorDashboard title="Download Prescription Details" />
            <DoctorDownloadPrescription />
        </>
    );
}

export default DoctorDownloadPdf;