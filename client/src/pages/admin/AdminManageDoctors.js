import AdminDashboard from "./AdminDashboard";
import AdminViewDoctors from "../../components/ViewComponents/AdminViewDoctors";

import { Box, Typography, Button, Container, Paper, TextField } from "@mui/material";

const AdminManageAdmins = () => {
    return (
        <>
            <AdminDashboard title="Manage System Doctors" />
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                    <Typography variant="h6" sx={{ mb: 4 }}> Remove a Doctor from the System </Typography>
                    <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField sx={{ mr: "2%" }} label="Username" fullWidth />
                        <Button type="submit" variant="outlined" fullWidth sx={{ p: 1.8, fontWeight: 'bold' }}>
                            Remove Doctor
                        </Button>
                    </Box>
                </Paper>
            </Container>
                 <AdminViewDoctors/>


        </>
    );
}

export default AdminManageAdmins;