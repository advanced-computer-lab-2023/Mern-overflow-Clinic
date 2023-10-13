import AdminDashboard from "./AdminDashboard";
import AddPackage from "../../components/formComponents/AddPackage";

const AdminManageAdmins = () => {
    return (
        <>
            <AdminDashboard title="Manage Health Packages" />
            <AddPackage />
        </>
    );
}

export default AdminManageAdmins;