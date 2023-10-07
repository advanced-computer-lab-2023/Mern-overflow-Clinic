import AdminDashboard from "./AdminDashboard";
import { Box, Typography, FormControl, Button, Container, Paper, TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const AdminManageAdmins = () => {
    return (
        <>
            <AdminDashboard title="Manage Health Packages" />
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                    <Typography variant="h6" sx={{ mb: 4 }}> Add a New Health Package to the System </Typography>
                    <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
                        <TextField sx={{ mr: "2%" }} label="Name" fullWidth />
                        <FormControl fullWidth variant="outlined" sx={{ mr: "2%" }}>
                            <InputLabel id="gender-label">Choose Package Type</InputLabel>
                            <Select
                                sx={{ textAlign: 'left' }}
                                labelId="gender-label"
                                id="gender-select"
                                label="Choose Package Type"
                            >
                                <MenuItem value="silver">Silver</MenuItem>
                                <MenuItem value="gold">Gold</MenuItem>
                                <MenuItem value="platinum">Platinum</MenuItem>
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="outlined" fullWidth sx={{ p: 1.8, fontWeight: 'bold' }}>
                            Add Health Package
                        </Button>
                    </Box>
                </Paper>
            </Container>
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                    <Typography variant="h6" sx={{ mb: 4 }}> Remove a Health Package from the System </Typography>
                    <Box component="form" sx={{ display: 'flex', alignItems: 'center' }}>
                        <FormControl fullWidth variant="outlined" sx={{ mr: "2%" }}>
                            <InputLabel id="gender-label">Choose a Package</InputLabel>
                            <Select
                                sx={{ textAlign: 'left' }}
                                labelId="gender-label"
                                id="gender-select"
                                label="Choose a Package"
                            >
                                <MenuItem value="package1">Package 1</MenuItem>
                                <MenuItem value="package2">Package 2</MenuItem>
                            </Select>
                        </FormControl>
                        <Button type="submit" variant="outlined" fullWidth sx={{ p: 1.8, fontWeight: 'bold' }}>
                            Remove Health Package
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}

export default AdminManageAdmins;