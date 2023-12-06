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

const EditPackage = () => {
    let { id } = useParams();
    const { register, handleSubmit, setError, formState: { errors } } = useForm();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [discountOnDoctorSessions, setDiscountOnDoctorSessions] = useState("");
    const [discountOnMedicine, setDiscountOnMedicine] = useState("");
    const [discountForFamily, setDiscountForFamily] = useState("");
    const [subscriptionPeriod, setSubscriptionPeriod] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/packages/${id}`);
                setName(response.data.name);
                setPrice(response.data.price);
                setDiscountOnDoctorSessions(response.data.discountOnDoctorSessions);
                setDiscountOnMedicine(response.data.discountOnMedicine);
                setDiscountForFamily(response.data.discountForFamily);
                setSubscriptionPeriod(response.data.subscriptionPeriod);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    const onSubmit = data => {
        const dataToServer = { name, price, discountOnDoctorSessions, discountOnMedicine, discountForFamily, subscriptionPeriod };
        axios.put(`http://localhost:8000/packages/${id}`, dataToServer)
            .then((response) => {
                console.log('PUT request successful', response);
                navigate("/admin/packages");
            })
            .catch((error) => {
                console.error('Error making PUT request', error);
            });
    }

    return (
        <Container maxWidth="lg">
            <Paper elevation={3} sx={{ p: '20px', my: '40px' }}>
                <Typography variant="h6" sx={{ mb: 4 }}> Update Health Package </Typography>
                <Box component="form" sx={{ display: 'flex', alignItems: 'center' }} onSubmit={handleSubmit(onSubmit)} >
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                                sx={{ marginBottom: "1rem" }}
                                label="Name"
                                fullWidth
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                                <OutlinedInput
                                    value={price}
                                    onChange={(e) => { setPrice(e.target.value) }}
                                    autoComplete="off"
                                    required
                                    fullWidth
                                    type="number"
                                    id="outlined-adornment-amount"
                                    startAdornment={<InputAdornment position="start">EGP</InputAdornment>}
                                    label="Price"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-amount">Discount on Doctor Sessions</InputLabel>
                                <OutlinedInput
                                    value={discountOnDoctorSessions}
                                    onChange={(e) => { setDiscountOnDoctorSessions(e.target.value) }}
                                    inputProps={{ min: 0, max: 100 }}
                                    autoComplete="off"
                                    required
                                    fullWidth
                                    type="number"
                                    id="outlined-adornment-amount"
                                    startAdornment={<InputAdornment position="start">%</InputAdornment>}
                                    label="Discount on Doctor Sessions"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-amount">Discount on Medicine</InputLabel>
                                <OutlinedInput
                                    value={discountOnMedicine}
                                    onChange={(e) => { setDiscountOnMedicine(e.target.value) }}
                                    inputProps={{ min: 0, max: 100 }}
                                    autoComplete="off"
                                    required
                                    fullWidth
                                    type="number"
                                    id="outlined-adornment-amount"
                                    startAdornment={<InputAdornment position="start">%</InputAdornment>}
                                    label="Discount on Medicine"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-amount">Discount For Family</InputLabel>
                                <OutlinedInput
                                    value={discountForFamily}
                                    onChange={(e) => { setDiscountForFamily(e.target.value) }}
                                    inputProps={{ min: 0, max: 100 }}
                                    autoComplete="off"
                                    required
                                    fullWidth
                                    type="number"
                                    id="outlined-adornment-amount"
                                    startAdornment={<InputAdornment position="start">%</InputAdornment>}
                                    label="Discount For Family"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-amount">Subscription Period</InputLabel>
                                <OutlinedInput
                                    value={subscriptionPeriod}
                                    onChange={(e) => { setSubscriptionPeriod(e.target.value) }}
                                    inputProps={{ min: 0, max: 1000 }}
                                    autoComplete="off"
                                    required
                                    fullWidth
                                    type="number"
                                    id="outlined-adornment-amount"
                                    startAdornment={<InputAdornment position="start">days</InputAdornment>}
                                    label="Subscription Period"
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="submit" variant="contained" fullWidth sx={{ my: 3, p: 1.8, fontWeight: 'bold' }}>
                                Update Health Package
                            </Button>
                        </Grid>
                        <Grid item xs={12}>
                            <Button type="button" variant="outlined" fullWidth sx={{ mb: 3, p: 1.8, fontWeight: 'bold' }}
                                component={Link}
                                to="/admin/packages">
                                Cancel
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container >
    );
}

export default EditPackage;