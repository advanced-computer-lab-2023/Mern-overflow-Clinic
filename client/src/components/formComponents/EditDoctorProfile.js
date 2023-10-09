import { Box, Typography, FormControl, Button, Container, Paper, TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import { Link } from 'react-router-dom'; import axios from 'axios';
import sha256 from 'js-sha256';
import { useForm } from "react-hook-form"
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";

const EditDoctorProfile = () => {
    let { id } = useParams();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [email, setEmail] = useState("");
    const [hourlyRate, setHourlyRate] = useState("");
    const [affiliation, setAffiliation] = useState("");


    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/doctors/${id}`);
                setEmail(response.data.email);
                setHourlyRate(response.data.hourlyRate);
                setAffiliation(response.data.affiliation);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const onSubmit = data => {
        const dataToServer = {email, hourlyRate, affiliation};
        console.log(dataToServer);
        axios.put(`http://localhost:8000/doctors/${id}`, dataToServer)
            .then((response) => {
                console.log('PUT request successful', response);
            })
            .catch((error) => {
                console.error('Error making PUT request', error);
            });
    }

    const handleChange = (event) => {
        if (errors[event.target.name]) {
            setError(event.target.name,
                {
                    type: errors[event.target.name]["type"],
                    message: errors[event.target.name]["type"]
                })
        }
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
                        fullWidth
                        autoFocus />
                    <FormControl sx={{ mb: 3 }} fullWidth>
                        <InputLabel htmlFor="outlined-adornment-amount">Hourly Rate</InputLabel>
                        <OutlinedInput
                            value={hourlyRate}
                            autoComplete="off"
                            onChange={(e) => { setHourlyRate(e.target.value) }}
                            fullWidth
                            inputProps={{ max: 10000 }}
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