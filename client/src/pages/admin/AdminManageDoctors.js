import AdminDashboard from "./AdminDashboard";
import AdminViewDoctors from "../../components/ViewComponents/AdminViewDoctors";

const AdminManageAdmins = () => {
    return (
        <>
            <AdminDashboard title="Manage System Doctors" />
            <AdminViewDoctors />
        </>
    );
}

export default AdminManageAdmins;