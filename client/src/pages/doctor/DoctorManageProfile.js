import DoctorDashboard from "./DoctorDashboard";
import EditDoctorProfile from "../../components/formComponents/EditDoctorProfile";

const DoctorManageProfile = () => {
    return (
        <>
            <DoctorDashboard title="Manage My Profile" />
            <EditDoctorProfile />
        </>
    );
}

export default DoctorManageProfile;
