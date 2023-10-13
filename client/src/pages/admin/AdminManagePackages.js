import AdminDashboard from "./AdminDashboard";
import AddPackage from "../../components/formComponents/AddPackage";
import AdminViewPackages from "../../components/ViewComponents/AdminViewPackages";

import { useState } from "react";
const AdminManageAdmins = () => {

    const [dataIsUpdated, setDataIsUpdated] = useState(true);
    return (
        <>
            <AdminDashboard title="Manage Health Packages" />
            <AddPackage setDataIsUpdated= {setDataIsUpdated}  />
            <AdminViewPackages  dataIsUpdated= {dataIsUpdated} setDataIsUpdated={setDataIsUpdated} />
        </>
    );
}

export default AdminManageAdmins;
