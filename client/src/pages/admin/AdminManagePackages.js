import AdminDashboard from "./AdminDashboard";
import { Box, Typography, FormControl, Button, Container, Paper, TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
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