import AdminDashboard from "./AdminDashboard";
import EditPackage from '../../components/formComponents/EditPackage'

const AdminEditPackage = () => {
    return (
        <>
            <AdminDashboard title="Manage Health Packages" />
            <EditPackage />
        </>
    );
}

export default AdminEditPackage;