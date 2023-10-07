import PatientDashboard from "./PatientDashboard";
import { Box, Grid, Typography, FormControl, Button, Container, Paper, TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const PatientManageFamily = () => {
    return (
        <>
            <PatientDashboard title="Manage My Family Members" />
            <Container maxWidth="lg">
                <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                    <Typography variant="h6" sx={{ mb: 4 }}> Add a New Family Member </Typography>
                    <Box component="form">
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={4}>
                                <TextField label="Name" fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField label="National ID" type="number" fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField label="Age" type="number" fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth variant="outlined">
                                    <InputLabel id="gender-label">Gender</InputLabel>
                                    <Select
                                        sx={{ textAlign: 'left' }}
                                        labelId="gender-label"
                                        id="gender-select"
                                        label="Gender"
                                    >
                                        <MenuItem value="male">Male</MenuItem>
                                        <MenuItem value="female">Female</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField label="Relation" fullWidth />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button type="submit" variant="outlined" fullWidth sx={{ p: 1.8, fontWeight: 'bold' }}>
                                    Add Member
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Container>

        </>
    );
}

export default PatientManageFamily;