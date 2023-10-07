import DoctorDashbaord from "./DoctorDashboard";
import { Box, Typography, FormControl, Button, Container, Paper, TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Link } from 'react-router-dom';

const DoctorManageProfile = () => {
    return (
        <>
            <DoctorDashbaord title="Manage My Profile" />
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                    <Typography variant="h6" sx={{ mb: 4 }}> Update Profile </Typography>
                    <Box component="form">
                        <TextField sx={{ mb: 3 }} type="email" label="Email" fullWidth autoFocus />
                        <FormControl sx={{ mb: 3 }} fullWidth>
                            <InputLabel htmlFor="outlined-adornment-amount">Hourly Rate</InputLabel>
                            <OutlinedInput
                                fullWidth
                                inputProps={{ max: 10000 }}
                                type="number"
                                id="outlined-adornment-amount"
                                startAdornment={<InputAdornment position="start">EGP</InputAdornment>}
                                label="Hourly Rate"
                            />
                        </FormControl>
                        <TextField sx={{ mb: 3 }} label="Affilation (Hospital)" type="text" fullWidth />
                        <Button type="submit" variant="contained" fullWidth sx={{ mb: 3, p: 1.8, fontWeight: 'bold' }}
                            component={Link}
                            to="/pharmacist/medicines">
                            Update Profile
                        </Button>
                    </Box>
                </Paper>
            </Container>
        </>
    );
}

export default DoctorManageProfile;