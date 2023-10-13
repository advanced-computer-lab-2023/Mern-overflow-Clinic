import AdminDashboard from "./AdminDashboard";
import AddAdmin from '../../components/formComponents/AddAdmin';
import AdminViewAdmins from '../../components/ViewComponents/AdminViewAdmins'
import { useState } from "react";

const AdminManageAdmins = () => {
    const [dataIsUpdated, setDataIsUpdated] = useState(true);

    return (
        <>
            <AdminDashboard title="Manage System Admins" />
            <AddAdmin setDataIsUpdated= {setDataIsUpdated} />
            <AdminViewAdmins dataIsUpdated= {dataIsUpdated} setDataIsUpdated={setDataIsUpdated} />
        </>
    );
}

export default AdminManageAdmins;