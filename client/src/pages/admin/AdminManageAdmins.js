import AdminDashboard from "./AdminDashboard";
import AddAdmin from '../../components/formComponents/AddAdmin';
import AdminViewAdmins from '../../components/ViewComponents/AdminViewAdmins'

const AdminManageAdmins = () => {
    return (
        <>
            <AdminDashboard title="Manage System Admins" />
            <AddAdmin />
            <AdminViewAdmins />
        </>
    );
}

export default AdminManageAdmins;