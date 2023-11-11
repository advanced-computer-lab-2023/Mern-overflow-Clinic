import { Box, Typography, FormControl, Button, Container, Paper, TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { useForm } from "react-hook-form"
import axios from 'axios';
import { useEffect, useState } from "react";
import { useUser } from '../../userContest';

const EditDoctorProfile = () => {
    const { userId } = useUser();
    let id = userId;
    //let  id  = "65293c2cb5a34d208108cc33"; 
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [email, setEmail] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [affiliation, setAffiliation] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/doctors/${id}`, {params: {id:id}});
                setEmail(response.data[0].email);
                setHourlyRate(response.data[0].hourlyRate);
                setAffiliation(response.data[0].affiliation);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const onSubmit = data => {
        const dataToServer = { email, hourlyRate, affiliation };
        axios.put(`http://localhost:8000/doctors/${id}`, dataToServer)
            .then((response) => {
                console.log('PUT request successful', response);
            })
            .catch((error) => {
                console.error('Error making PUT request', error);
            });
    }

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                <Typography variant="h6" sx={{ mb: 4 }}> Update Profile </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <TextField
                        sx={{ mb: 3 }}
                        value={email}
                        onChange={(e) => { setEmail(e.target.value) }}
                        type="email"
                        label="Email"
                        required
                        fullWidth
                        autoFocus />
                    <FormControl sx={{ mb: 3 }} fullWidth>
                        <InputLabel htmlFor="outlined-adornment-amount">Hourly Rate</InputLabel>
                        <OutlinedInput
                            value={hourlyRate}
                            autoComplete="off"
                            onChange={(e) => { setHourlyRate(e.target.value) }}
                            fullWidth
                            required
                            inputProps={{ max: 10000, min: 10 }}
                            type="number"
                            id="outlined-adornment-amount"
                            startAdornment={<InputAdornment position="start">EGP</InputAdornment>}
                            label="Hourly Rate"
                        />
                    </FormControl>
                    <TextField
                        sx={{ mb: 3 }}
                        value={affiliation}
                        label="Affiliation (Hospital)"
                        type="text"
                        fullWidth
                        required
                        onChange={(e) => { setAffiliation(e.target.value) }} />
                    <Button type="submit" variant="contained" fullWidth sx={{ mb: 3, p: 1.8, fontWeight: 'bold' }}>
                        Update Profile
                    </Button>
                </Box>
            </Paper>
        </Container>

    );
}

export default EditDoctorProfile;
