import { Box, Typography, Grid, FormControl, Button, Container, Paper, TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useForm } from "react-hook-form"
import { useParams } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

const EditDosage = () => {
    let { id, mid } = useParams();
    console.log("presId:" + id);
    console.log("medId:" + mid);
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [dosage, setDosage] = useState("");
    const [discountOnDoctorSessions, setDiscountOnDoctorSessions] = useState("");
    const [discountOnMedicine, setDiscountOnMedicine] = useState("");
    const [discountForFamily, setDiscountForFamily] = useState("");
    const [subscriptionPeriod, setSubscriptionPeriod] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                console.log("Heree ");
                const response = await axios.get(`http://localhost:8000/prescriptions/${id}/medicineDosage/${mid}`);
                console.log("Response:", response);
                console.log("dosage = " + response.data);
                setDosage(response.data.dosage);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const onSubmit = data => {
        const dataToServer = { dosage };
        axios.put(`http://localhost:8000/prescriptions/${id}/updateDosage/${mid}`, dataToServer)
            .then((response) => {
                console.log('PUT request successful', response);
                navigate(`/doctor/prescriptions/${id}`);
            })
            .catch((error) => {
                console.error('Error making PUT request', error);
            });
    }

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                <Typography variant="h6" sx={{ mb: 4 }}> Update Medicine Dosage </Typography>
                <Box component="form" sx={{ display: 'flex', alignItems: 'center' }} onSubmit={handleSubmit(onSubmit)} >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                value={dosage}
                                onChange={(e) => { setDosage(e.target.value) }}
                                sx={{ marginBottom: "1rem" }}
                                type="number"
                                label="Dosage"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" fullWidth sx={{ my: 3, p: 1.8, fontWeight: 'bold' }}>
                                Update Medicine Dosage
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="button" variant="outlined" fullWidth sx={{ mb: 3, p: 1.8, fontWeight: 'bold' }}
                                component={Link}
                                to = {`/doctor/prescriptions/${id}`}>
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container >
    );
}

export default EditDosage;