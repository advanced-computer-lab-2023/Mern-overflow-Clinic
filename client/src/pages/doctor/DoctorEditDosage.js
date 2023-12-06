import DoctorDashboard from "./DoctorDashboard";
import EditDosage from '../../components/formComponents/EditDosage'

const DoctorEditDosage = () => {
    return (
        <>
            <DoctorDashboard title="Edit Medicine Dosage" />
            <EditDosage />
        </>
    );
}

export default DoctorEditDosage;