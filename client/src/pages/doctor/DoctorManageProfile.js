import DoctorDashbaord from "./DoctorDashboard";
import EditDoctorProfile from "../../components/formComponents/EditDoctorProfile";

const DoctorManageProfile = () => {
    return (
        <>
            <DoctorDashbaord title="Manage My Profile" />
            <EditDoctorProfile />
        </>
    );
}

export default DoctorManageProfile;