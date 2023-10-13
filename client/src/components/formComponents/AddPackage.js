import { Box, Typography, Grid, FormControl, Button, Container, Paper, TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment'; import axios from 'axios';
import { useForm } from "react-hook-form"

const AddPackage = () => {
    const { register, handleSubmit, setError, formState: { errors } } = useForm();

    const onSubmit = data => {
        const dataToServer = { ...data };
        axios.post('http://localhost:8000/packages', dataToServer)
            .then((response) => {
                console.log('POST request successful', response);
            })
            .catch((error) => {
                console.error('Error making POST request', error);
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
                <Typography variant="h6" sx={{ mb: 4 }}> Add a New Health Package to the System </Typography>
                <Box component="form" sx={{ display: 'flex', alignItems: 'center' }} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <TextField sx={{ mr: "2%" }} label="Name" fullWidth
                                {...register("name", { required: true})}
                                error={!!errors["name"]}
                                helperText={errors["name"]?.message}
                                onBlur={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-amount">Price</InputLabel>
                                <OutlinedInput
                                    {...register("price", { required: true})}
                                    error={!!errors["price"]}
                                    helperText={errors["price"]?.message}
                                    onBlur={handleChange}
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
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-amount">Discount on Doctor Sessions</InputLabel>
                                <OutlinedInput
                                    inputProps={{ min: 0, max: 100 }}
                                    {...register("discountOnDoctorSessions", { required: true })}
                                    error={!!errors["discountOnDoctorSessions"]}
                                    helperText={errors["discountOnDoctorSessions"]?.message}
                                    onBlur={handleChange}
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
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-amount">Discount on Medicine</InputLabel>
                                <OutlinedInput
                                    inputProps={{ min: 0, max: 100 }}
                                    {...register("discountOnMedicine", { required: true})}
                                    error={!!errors["discountOnMedicine"]}
                                    helperText={errors["discountOnMedicine"]?.message}
                                    onBlur={handleChange}
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
                        <Grid item xs={12} sm={4}>
                            <FormControl fullWidth>
                                <InputLabel htmlFor="outlined-adornment-amount">Discount For Family</InputLabel>
                                <OutlinedInput
                                    inputProps={{ min: 0, max: 100 }}
                                    {...register("discountForFamily", { required: true})}
                                    error={!!errors["discountForFamily"]}
                                    helperText={errors["discountForFamily"]?.message}
                                    onBlur={handleChange}
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
                        <Grid item xs={12} sm={4}>
                            <Button type="submit" variant="outlined" fullWidth sx={{ p: 1.8, fontWeight: 'bold' }}>
                                Add Health Package
                            </Button>
                        </Grid>
                    </Grid>
                </Box>
            </Paper>
        </Container>
    );
}

export default AddPackage;