import AdminDashboard from "./AdminDashboard";
import { Box, Typography, Button, Container, Paper, TextField } from "@mui/material";
import AddAdmin from '../../components/formComponents/AddAdmin';

const AdminManageAdmins = () => {
    return (
        <>
            <AdminDashboard title="Manage System Admins" />
            <AddAdmin />
        </>
    );
}

export default AdminManageAdmins;