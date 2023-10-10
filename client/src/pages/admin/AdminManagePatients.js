import AdminDashboard from "./AdminDashboard";
import AdminViewPatients from "../../components/ViewComponents/AdminViewPatients";

const AdminManagePatients = () => {
    return (
        <>
            <AdminDashboard title="Manage System Patients" />
            <AdminViewPatients/>
        </>
    );
}

export default AdminManagePatients;