import AdminDashboard from "./AdminDashboard";
import AdminAddContract from "../../components/formComponents/AdminAddContract";


const AdminManageContracts = () => {
  return (
    <>
      <AdminDashboard title="Manage Doctor Registration Requests" />
      <AdminAddContract />
    </>
  );
};

export default AdminManageContracts;

