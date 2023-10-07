import AdminDashboard from "./AdminDashboard";
import { Box, Typography, FormControl, Button, Container, Paper, TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import { Link } from 'react-router-dom';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const AdminEditPackage = () => {
    return (
        <>
            <AdminDashboard title="Manage Health Packages" />
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                    <Typography variant="h6" sx={{ mb: 4 }}> Update Health Package </Typography>
                    <Box component="form">
                        <TextField sx={{ mb: 3 }} label="Name" fullWidth />
                        <FormControl fullWidth variant="outlined" sx={{ mb: 4 }}>
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
                        <Button type="submit" variant="contained" fullWidth sx={{ mb: 3, p: 1.8, fontWeight: 'bold' }}
                            component={Link}
                            to="/admin/packages">
                            Update Health Package
                        </Button>
                        <Button type="submit" variant="outlined" fullWidth sx={{ mb: 3, p: 1.8, fontWeight: 'bold' }}
                            component={Link}
                            to="/admin/packages">
                            Cancel
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}

export default AdminEditPackage;